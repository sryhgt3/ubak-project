import asyncio
from database import SessionLocal
from services.chat_service import ChatService
from schemas import ChatRequest, ChatMessage
from models import User
import sys
import logging

logging.getLogger('httpx').setLevel(logging.WARNING)

db = SessionLocal()
# get vip user
user = db.query(User).filter(User.username == "vip_user").first()
if not user:
    print("vip_user not found in DB! run seed_db.py first")
    sys.exit(1)

chat_service = ChatService(db)

# 1. Ask to record a transaction with incomplete data
request1 = ChatRequest(
    message="catat pengeluaran hari ini 50000",
    provider="gemini",
    history=[]
)
print("--- USER: catat pengeluaran hari ini 50000")
res1 = chat_service.get_chat_response(request1, user)
print("--- AI:", res1.response)

# 2. Provide missing data
history = [
    ChatMessage(role="user", content="catat pengeluaran hari ini 50000"),
    ChatMessage(role="model", content=res1.response)
]
request2 = ChatRequest(
    message="buat beli makan siang (Food)",
    provider="gemini",
    history=history
)
print("\n--- USER: buat beli makan siang (Food)")
res2 = chat_service.get_chat_response(request2, user)
print("--- AI:", res2.response)

