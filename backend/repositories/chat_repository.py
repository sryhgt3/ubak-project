from sqlalchemy.orm import Session
from models import ChatSession, ChatMessage

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_sessions_by_user_id(self, user_id: int):
        return self.db.query(ChatSession).filter(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc()).all()

    def get_session_by_id(self, session_id: int):
        return self.db.query(ChatSession).filter(ChatSession.id == session_id).first()

    def get_messages_by_session_id(self, session_id: int):
        return self.db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.timestamp.asc()).all()

    def create_session(self, session: ChatSession):
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def create_message(self, message: ChatMessage):
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message
