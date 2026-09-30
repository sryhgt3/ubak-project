from database import SessionLocal
from models import User
from schemas import ChatRequest
from services.chat_service import ChatService

db = SessionLocal()
user = db.query(User).filter(User.username == 'vip_user').first()
svc = ChatService(db)

# 1. Simulate ambiguous input
req = ChatRequest(message="masukkan pengeluaran makan 10k hari ini dan jajan 20k", history=[], provider="gemini")
res = svc.get_chat_response(req, user)
print("USER: masukkan pengeluaran makan 10k hari ini dan jajan 20k")
print(f"AI: {res.response}\n")

