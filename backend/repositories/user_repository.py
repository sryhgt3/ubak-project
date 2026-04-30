from sqlalchemy.orm import Session
from models import User

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username_exclude_id(self, username: str, user_id: int):
        return self.db.query(User).filter(User.username == username, User.id != user_id).first()

    def get_by_email_exclude_id(self, email: str, user_id: int):
        return self.db.query(User).filter(User.email == email, User.id != user_id).first()

    def get_all(self):
        return self.db.query(User).all()

    def create(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def commit_changes(self):
        self.db.commit()
