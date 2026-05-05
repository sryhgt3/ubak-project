import logging
from openai import OpenAI
import os
import google.generativeai as genai
from prompts.chatbotprompt import SYSTEM_PROMPT
from fastapi import HTTPException
from schemas import ChatRequest, ChatResponse
from models import User, ChatSession, ChatMessage, ChatRole, TransactionType
from repositories.chat_repository import ChatRepository
from repositories.account_repository import AccountRepository
from repositories.transaction_repository import TransactionRepository
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

generation_config = {
    "max_output_tokens": 200,
    "temperature": 0.2
}

class ChatService:
    def __init__(self, db: Session):
        self.chat_repo = ChatRepository(db)
        self.account_repo = AccountRepository(db)
        self.transaction_repo = TransactionRepository(db)
        
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Initialize Gemini client
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            genai.configure(api_key=gemini_key) 
        self.gemini_model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config=generation_config,
            system_instruction=SYSTEM_PROMPT
        )

    def _build_user_context(self, user: User) -> str:
        """
        Build a concise financial context for the logged-in user to be injected into the AI prompt.
        """
        try:
            accounts = self.account_repo.get_by_user_id(user.id)
            total_balance = sum(acc.balance for acc in accounts)
            
            recent_transactions = self.transaction_repo.get_recent_by_user_id(user.id, limit=5)
            
            # Summary of accounts
            account_summary = ", ".join([f"{acc.name}: IDR {acc.balance}" for acc in accounts])
            
            # Format transactions
            tx_list = ""
            for tx in recent_transactions:
                tx_list += f"- {tx.date.strftime('%Y-%m-%d')} | {tx.description} | {tx.type.value}: IDR {tx.amount}\n"
            
            if not tx_list:
                tx_list = "- Tidak ada transaksi terbaru.\n"

            context = f"""
=== BEGIN USER FINANCIAL CONTEXT ===
Name: {user.username}
Total Balance: IDR {total_balance}
Accounts: {account_summary}
Monthly Income: IDR {user.monthly_income or 0}
Max Spending: IDR {user.max_spending or 0}

Recent Transactions (last 5):
{tx_list}=== END USER FINANCIAL CONTEXT ===

PERINGATAN KERAS (ANTI-HALLUCINATION): 
- Sebagai AI, kamu HANYA boleh merujuk pada data di dalam kotak 'USER FINANCIAL CONTEXT' di atas untuk menjawab detail keuangan user.
- JIKA DATA TIDAK ADA ATAU TIDAK CUKUP DI DALAM CONTEXT TERSEBUT, JANGAN PERNAH MENGARANG, MENGHITUNG SENDIRI, ATAU MENEBAK. LANGSUNG JAWAB: "Saya tidak memiliki akses ke data tersebut saat ini."
"""
            logger.debug(f"Assembled context for user {user.username}")
            return context
        except Exception as e:
            logger.error(f"Error building user context: {str(e)}")
            return "\n[SYSTEM ERROR: Gagal mengambil data keuangan user. Jawab bahwa Anda tidak memiliki akses saat ini.]\n"

    def get_chat_response(self, request: ChatRequest, user: User):
        provider = request.provider.lower() if request.provider else "openai"
        
        # Build context
        context = self._build_user_context(user)
        
        # 1. Handle session
        session_id = request.session_id
        if not session_id:
            session = ChatSession(user_id=user.id, title=request.message[:30])
            session = self.chat_repo.create_session(session)
            session_id = session.id
        
        # 2. Save user message
        user_msg = ChatMessage(session_id=session_id, role=ChatRole.User, content=request.message)
        self.chat_repo.create_message(user_msg)
        
        # 3. Get AI response
        if provider == "gemini":
            ai_response = self._get_gemini_response(request, context)
        else:
            ai_response = self._get_openai_response(request, context)
        
        ai_message = ai_response.response
        
        # 4. Save AI message
        ai_msg = ChatMessage(session_id=session_id, role=ChatRole.Assistant, content=ai_message)
        self.chat_repo.create_message(ai_msg)
        
        return ChatResponse(response=ai_message, session_id=session_id)

    def get_user_sessions(self, user: User):
        return self.chat_repo.get_sessions_by_user_id(user.id)

    def get_session_messages(self, session_id: int, user: User):
        session = self.chat_repo.get_session_by_id(session_id)
        if not session or session.user_id != user.id:
            raise HTTPException(status_code=404, detail="Session not found")
        return self.chat_repo.get_messages_by_session_id(session_id)

    def _get_openai_response(self, request: ChatRequest, context: str):
        try:
            full_system_prompt = f"{SYSTEM_PROMPT}\n\n{context}"
            logger.debug("Injecting context into OpenAI system prompt")
            
            messages = []
            messages.append({
                "role": "system", 
                "content": full_system_prompt
            })
            
            if request.history:
                for msg in request.history:
                    messages.append({"role": msg.role, "content": msg.content})
            
            messages.append({"role": "user", "content": request.message})
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=300
            )
            
            ai_message = response.choices[0].message.content
            return ChatResponse(response=ai_message)
        except Exception as e:
            logger.error(f"OpenAI API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")
        
    def _get_gemini_response(self, request: ChatRequest, context: str):
        try:
            full_system_prompt = f"{SYSTEM_PROMPT}\n\n{context}"
            logger.debug("Injecting context into Gemini system instruction")
            
            # Using a local model instance with updated system instruction is the 
            # cleanest way to handle dynamic system prompts in Gemini Python SDK 
            # without polluting global state.
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                generation_config=generation_config,
                system_instruction=full_system_prompt
            )
            
            history = []
            if request.history:
                for msg in request.history:
                    role = "user" if msg.role == "user" else "model"
                    history.append({"role": role, "parts": [msg.content]})
            
            chat_session = model.start_chat(history=history)
            response = chat_session.send_message(request.message)
            
            return ChatResponse(response=response.text)
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from Gemini")
