from sqlalchemy.orm import Session
from sqlalchemy import or_
from openai import OpenAI
import os
import json
import google.generativeai as genai
import logging
from datetime import datetime
from prompts.chatbotprompt import SYSTEM_PROMPT
from fastapi import HTTPException
from schemas import ChatRequest, ChatResponse
from models import User, Transaction, TransactionType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

generation_config = {
    "max_output_tokens": 512,
    "temperature": 0.2
}

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)

    def _build_system_prompt(self, user: User) -> str:
        from sqlalchemy.sql import func
        income_sum = self.db.query(func.sum(Transaction.amount)).filter(Transaction.user_id == user.id, Transaction.type == TransactionType.Income).scalar() or 0
        expense_sum = self.db.query(func.sum(Transaction.amount)).filter(Transaction.user_id == user.id, Transaction.type == TransactionType.Expense).scalar() or 0
        saldo = (user.monthly_income or 0) + income_sum - expense_sum
        
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        return (f"{SYSTEM_PROMPT}\n"
                f"Data Keuangan User saat ini:\n"
                f"- Nama: {user.username}\n"
                f"- Goal: {user.savings_goal or '-'}\n"
                f"- Dream: {user.dream_item or '-'}\n"
                f"- Max Limit: {user.max_spending or '-'}\n"
                f"- Sisa Saldo: {saldo}\n"
                f"Tanggal hari ini: {today_str}\n"
                "Instruksi Khusus CRUD (SANGAT PENTING):\n"
                "1. MENCATAT: Gunakan `date` YYYY-MM-DD jika user menyebut tanggal. Jika tidak, kosongkan.\n"
                "2. MENGHAPUS/MENGEDIT: JANGAN PERNAH langsung menghapus/edit jika perintahnya kurang spesifik.\n"
                "   - Panggil `search_transactions` terlebih dahulu dengan parameter pencarian yang sesuai (misal keyword 'makan' atau date '2026-09-23').\n"
                "   - Jika ada >1 hasil yang cocok, sebutkan daftarnya dan MINTA KONFIRMASI user ID mana yang dihapus/edit.\n"
                "   - Jika hanya 1 hasil atau user sudah konfirmasi ID, jalankan `delete_transaction`/`update_transaction`.\n")

    def get_chat_response(self, request: ChatRequest, user: User):
        provider = request.provider.lower() if request.provider else "openai"
        if provider == "gemini":
            return self._get_gemini_response(request, user)
        else:
            return self._get_openai_response(request, user)

    def _get_openai_response(self, request: ChatRequest, user: User):
        logger.info(f"Menerima request OpenAI dari user: {user.username} | Pesan: {request.message}")
        try:
            messages = [{"role": "system", "content": self._build_system_prompt(user)}]
            if request.history:
                for msg in request.history[-6:]:  # OPTIMIZATION: Only keep last 6 messages in history to save tokens
                    messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": request.message})
            logger.info("Mengirim request ke OpenAI API...")
            
            tools = [
                {
                    "type": "function",
                    "function": {
                        "name": "record_transaction",
                        "description": "Catat transaksi baru. Kategori WAJIB dipetakan sesuai daftar di System Prompt.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "amount": {"type": "number"},
                                "type": {"type": "string", "enum": ["Income", "Expense"]},
                                "category": {"type": "string", "description": "WAJIB dipetakan ke daftar kategori valid (tidak boleh kosong/ngarang)."},
                                "description": {"type": "string", "description": "Keterangan singkat"},
                                "date": {"type": "string", "description": "Format YYYY-MM-DD"}
                            },
                            "required": ["amount", "type", "category", "description", "date"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "search_transactions",
                        "description": "Cari data transaksi berdasarkan kata kunci atau tanggal (sangat menghemat token).",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "keyword": {"type": "string", "description": "Kata kunci pencarian di deskripsi/kategori (opsional)"},
                                "date": {"type": "string", "description": "Tanggal format YYYY-MM-DD (opsional)"}
                            }
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "update_transaction",
                        "description": "Update data transaksi (HANYA panggil jika ID sudah pasti)",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"},
                                "amount": {"type": "number"},
                                "type": {"type": "string", "enum": ["Income", "Expense"]},
                                "category": {"type": "string"},
                                "description": {"type": "string"},
                                "date": {"type": "string"}
                            },
                            "required": ["id"]
                        }
                    }
                },
                {
                    "type": "function",
                    "function": {
                        "name": "delete_transaction",
                        "description": "Hapus transaksi (HANYA panggil jika ID sudah pasti)",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"}
                            },
                            "required": ["id"]
                        }
                    }
                }
            ]

            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=tools,
                max_tokens=300
            )
            message = response.choices[0].message
            
            if message.tool_calls:
                messages.append(message)
                
                needs_second_ai_call = False
                hardcoded_response_msg = "✅ Perintah dieksekusi dengan sukses oleh sistem."

                for tool_call in message.tool_calls:
                    args = json.loads(tool_call.function.arguments)
                    result = {}
                    
                    if tool_call.function.name == "record_transaction":
                        logger.info(f"[OpenAI Tool] Mengeksekusi record_transaction: {args.get('amount')} | {args.get('type')} | {args.get('category')}")
                        if "category" not in args or not args["category"] or "description" not in args or not args["description"] or "date" not in args or not args["date"]:
                            result = {"status": "error", "message": "TOLAK PENCATATAN: Kategori, Deskripsi, atau Tanggal kosong. Kamu HARUS membalas ke user dan tanyakan data yang kurang tersebut."}
                            needs_second_ai_call = True
                            hardcoded_response_msg = None
                        else:
                            d_obj = datetime.utcnow()
                            if "date" in args and args["date"]:
                                try:
                                    d_obj = datetime.strptime(args["date"], "%Y-%m-%d")
                                except ValueError:
                                    pass
                            t = Transaction(user_id=user.id, amount=args["amount"], type=TransactionType(args["type"]), category=args["category"], description=args["description"], date=d_obj)
                            self.db.add(t)
                            self.db.commit()
                            result = {"status": "success"}
                            hardcoded_response_msg = f"✅ Transaksi berhasil dicatat:\n**Rp {args['amount']:,.0f}** - {args.get('description', '')}"
                    
                    elif tool_call.function.name == "search_transactions":
                        # OPTIMIZATION: Push filtering to DB level
                        query = self.db.query(Transaction).filter(Transaction.user_id == user.id)
                        if "date" in args and args["date"]:
                            query = query.filter(Transaction.date >= datetime.strptime(args["date"], "%Y-%m-%d"))
                        if "keyword" in args and args["keyword"]:
                            kw = f"%{args['keyword']}%"
                            query = query.filter(or_(Transaction.description.ilike(kw), Transaction.category.ilike(kw)))
                        
                        txs = query.order_by(Transaction.date.desc()).limit(5).all() # Max 5 results to save tokens
                        result = [{"id": t.id, "amount": t.amount, "type": t.type.value, "desc": t.description, "date": str(t.date).split(' ')[0]} for t in txs]
                        needs_second_ai_call = True # AI must read results to answer user
                    
                    elif tool_call.function.name == "update_transaction":
                        t = self.db.query(Transaction).filter(Transaction.id == args["id"], Transaction.user_id == user.id).first()
                        if t:
                            if "amount" in args: t.amount = args["amount"]
                            if "type" in args: t.type = TransactionType(args["type"])
                            if "category" in args: t.category = args["category"]
                            if "description" in args: t.description = args["description"]
                            if "date" in args and args["date"]:
                                try:
                                    t.date = datetime.strptime(args["date"], "%Y-%m-%d")
                                except ValueError:
                                    pass
                            self.db.commit()
                            result = {"status": "success"}
                            hardcoded_response_msg = "✅ Data transaksi berhasil diperbarui."
                        else:
                            result = {"status": "error", "message": "ID not found"}
                            needs_second_ai_call = True

                    elif tool_call.function.name == "delete_transaction":
                        t = self.db.query(Transaction).filter(Transaction.id == args["id"], Transaction.user_id == user.id).first()
                        if t:
                            self.db.delete(t)
                            self.db.commit()
                            result = {"status": "success"}
                            hardcoded_response_msg = "✅ Transaksi berhasil dihapus secara permanen."
                        else:
                            result = {"status": "error", "message": "ID not found"}
                            needs_second_ai_call = True

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": json.dumps(result)
                    })
                
                # OPTIMIZATION: Skip 2nd API call if doing CRUD, return hardcoded message!
                if needs_second_ai_call:
                    response = self.openai_client.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=messages,
                        max_tokens=300
                    )
                    return ChatResponse(response=response.choices[0].message.content)
                else:
                    return ChatResponse(response=hardcoded_response_msg)

            return ChatResponse(response=message.content)
        except Exception as e:
            logger.error(f"OpenAI API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")

    def _get_gemini_response(self, request: ChatRequest, user: User):
        logger.info(f"Menerima request Gemini dari user: {user.username} | Pesan: {request.message}")
        try:
            def record_transaction(amount: float, type: str, category: str = None, description: str = None, date: str = None):
                """Catat transaksi baru. Kategori WAJIB dipetakan ke salah satu daftar valid di System Prompt."""
                logger.info(f"[Gemini Tool] Mengeksekusi record_transaction: {amount} | {type} | {category}")
                if not category or not description or not date:
                    return {"status": "error", "message": "TOLAK PENCATATAN: Kategori, Deskripsi, atau Tanggal kosong. Kamu HARUS membalas ke user dan tanyakan data yang kurang tersebut."}
                
                d_obj = datetime.utcnow()
                if date:
                    try:
                        d_obj = datetime.strptime(date, "%Y-%m-%d")
                    except ValueError:
                        pass
                t = Transaction(user_id=user.id, amount=amount, type=TransactionType(type), category=category, description=description, date=d_obj)
                self.db.add(t)
                self.db.commit()
                return {"status": "success"}
            
            def search_transactions(keyword: str = None, date: str = None):
                """Cari transaksi berdasarkan kata kunci atau tanggal."""
                query = self.db.query(Transaction).filter(Transaction.user_id == user.id)
                if date:
                    query = query.filter(Transaction.date >= datetime.strptime(date, "%Y-%m-%d"))
                if keyword:
                    kw = f"%{keyword}%"
                    query = query.filter(or_(Transaction.description.ilike(kw), Transaction.category.ilike(kw)))
                txs = query.order_by(Transaction.date.desc()).limit(5).all()
                return [{"id": t.id, "amount": t.amount, "type": t.type.value, "desc": t.description, "date": str(t.date).split(' ')[0]} for t in txs]

            def update_transaction(id: int, amount: float = None, type: str = None, category: str = None, description: str = None, date: str = None):
                """Update transaksi. Pastikan ID valid."""
                t = self.db.query(Transaction).filter(Transaction.id == id, Transaction.user_id == user.id).first()
                if not t: return {"status": "error", "message": "Not found"}
                if amount is not None: t.amount = amount
                if type: t.type = TransactionType(type)
                if category: t.category = category
                if description: t.description = description
                if date:
                    try:
                        t.date = datetime.strptime(date, "%Y-%m-%d")
                    except ValueError:
                        pass
                self.db.commit()
                return {"status": "success"}

            def delete_transaction(id: int):
                """Hapus transaksi berdasarkan ID"""
                t = self.db.query(Transaction).filter(Transaction.id == id, Transaction.user_id == user.id).first()
                if not t: return {"status": "error", "message": "Not found"}
                self.db.delete(t)
                self.db.commit()
                return {"status": "success"}

            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                generation_config=generation_config,
                system_instruction=self._build_system_prompt(user),
                tools=[record_transaction, search_transactions, update_transaction, delete_transaction]
            )

            history = []
            # OPTIMIZATION: Only keep last 6 messages
            safe_history = request.history[-6:] if request.history else []
            for msg in safe_history:
                history.append({"role": "user" if msg.role == "user" else "model", "parts": [msg.content]})
            
            chat = model.start_chat(history=history, enable_automatic_function_calling=True)
            logger.info("Mengirim request ke Gemini API (menunggu respon dan auto-function calling)...")
            response = chat.send_message(request.message)
            return ChatResponse(response=response.text)
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from Gemini")
