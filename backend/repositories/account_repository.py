from sqlalchemy.orm import Session
from models import Account

class AccountRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int):
        return self.db.query(Account).filter(Account.user_id == user_id).all()

    def get_by_id(self, account_id: int):
        return self.db.query(Account).filter(Account.id == account_id).first()

    def get_by_name(self, user_id: int, name: str):
        return self.db.query(Account).filter(Account.user_id == user_id, Account.name == name).first()

    def create(self, account: Account):
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account

    def update(self, account: Account):
        self.db.commit()
        self.db.refresh(account)
        return account

    def delete(self, account: Account):
        self.db.delete(account)
        self.db.commit()
