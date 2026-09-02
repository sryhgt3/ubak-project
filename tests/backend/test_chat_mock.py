import sys
import os
sys.path.append(os.path.abspath('/home/vory/Kerjaan/ubak-project/backend'))
from schemas import ChatRequest, ChatMessage
from models import User, Transaction, TransactionType
from services.chat_service import ChatService
import logging

logging.getLogger('httpx').setLevel(logging.WARNING)

class MockDB:
    def add(self, t):
        print(f"MockDB add: {t.amount} {t.type} {t.category} {t.description}")
    def commit(self):
        print("MockDB commit")

# Mock User and Transactions
t1 = Transaction(amount=1000000, type=TransactionType.Income, category="Salary", description="Gaji")
t2 = Transaction(amount=300000, type=TransactionType.Expense, category="Food", description="Makan")

user = User(id=1, username="vip_user", monthly_income=500000, savings_goal="Beli Rumah", dream_item="Mobil Baru", max_spending=5000000)
user.transactions = [t1, t2] 
# Saldo should be: 500,000 + 1,000,000 - 300,000 = 1,200,000

chat_service = ChatService(MockDB())

# Ask about balance
request = ChatRequest(
    message="berapakah sisa saldo saya sekarang?",
    provider="gemini",
    history=[]
)
print("--- USER: berapakah sisa saldo saya sekarang?")
res = chat_service.get_chat_response(request, user)
print("--- AI:", res.response)

