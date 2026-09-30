from database import SessionLocal
from models import User
db = SessionLocal()
u = db.query(User).filter(User.username == 'vip_user').first()
print(f"User ID: {u.id}, Current chat_id: {u.telegram_chat_id}")
u.telegram_chat_id = "123456"
db.commit()
db.refresh(u)
print(f"After commit chat_id: {u.telegram_chat_id}")
