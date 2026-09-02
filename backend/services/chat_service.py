from sqlalchemy.orm import Session
from openai import OpenAI
import os
import json
import google.generativeai as genai
import logging
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
        return f"{SYSTEM_PROMPT}\nData User: Nama:{user.username}, Goal:{user.savings_goal or '-'}, Dream:{user.dream_item or '-'}, Limit:{user.max_spending or '-'}."

    def get_chat_response(self, request: ChatRequest, user: User):
        provider = request.provider.lower() if request.provider else "openai"
        if provider == "gemini":
            return self._get_gemini_response(request, user)
        else:
            return self._get_openai_response(request, user)

    def _get_openai_response(self, request: ChatRequest, user: User):
        try:
            messages = [{"role": "system", "content": self._build_system_prompt(user)}]
            if request.history:
                for msg in request.history:
                    messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": request.message})
            
            tools = [{
                "type": "function",
                "function": {
                    "name": "record_transaction",
                    "description": "Catat transaksi pengguna",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "amount": {"type": "number"},
                            "type": {"type": "string", "enum": ["Income", "Expense"]},
                            "category": {"type": "string"},
                            "description": {"type": "string"}
                        },
                        "required": ["amount", "type", "category", "description"]
                    }
                }
            }]

            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=tools,
                max_tokens=256
            )
            message = response.choices[0].message
            
            if message.tool_calls:
                messages.append(message)
                for tool_call in message.tool_calls:
                    if tool_call.function.name == "record_transaction":
                        args = json.loads(tool_call.function.arguments)
                        t = Transaction(
                            user_id=user.id,
                            amount=args["amount"],
                            type=TransactionType(args["type"]),
                            category=args["category"],
                            description=args["description"]
                        )
                        self.db.add(t)
                        self.db.commit()
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": json.dumps({"status": "success"})
                        })
                
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    max_tokens=256
                )
                message = response.choices[0].message

            return ChatResponse(response=message.content)
        except Exception as e:
            logger.error(f"OpenAI API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")

    def _get_gemini_response(self, request: ChatRequest, user: User):
        try:
            def record_transaction(amount: float, type: str, category: str, description: str):
                """Catat transaksi (pengeluaran/pemasukan)"""
                t = Transaction(
                    user_id=user.id,
                    amount=amount,
                    type=TransactionType(type),
                    category=category,
                    description=description
                )
                self.db.add(t)
                self.db.commit()
                return {"status": "success", "message": "Berhasil"}

            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                generation_config=generation_config,
                system_instruction=self._build_system_prompt(user),
                tools=[record_transaction]
            )

            history = []
            if request.history:
                for msg in request.history:
                    history.append({"role": "user" if msg.role == "user" else "model", "parts": [msg.content]})
            
            chat = model.start_chat(history=history, enable_automatic_function_calling=True)
            response = chat.send_message(request.message)
            return ChatResponse(response=response.text)
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from Gemini")
