import sys
from schemas import ChatRequest, ChatMessage
from models import User
from services.chat_service import ChatService
import logging

logging.getLogger('httpx').setLevel(logging.WARNING)

class MockDB:
    def add(self, t):
        print(f"MockDB add: {t.amount} {t.type} {t.category} {t.description}")
    def commit(self):
        print("MockDB commit")

# Mock User
user = User(id=1, username="vip_user", savings_goal="Beli Rumah", dream_item="Mobil Baru", max_spending=5000000)

chat_service = ChatService(MockDB())

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
