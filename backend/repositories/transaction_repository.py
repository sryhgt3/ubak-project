from sqlalchemy.orm import Session
from models import Transaction

class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int):
        return self.db.query(Transaction).filter(Transaction.user_id == user_id).all()

    def get_by_account_id(self, account_id: int):
        return self.db.query(Transaction).filter(Transaction.account_id == account_id).order_by(Transaction.date.desc()).all()

    def get_by_account_id_and_type(self, account_id: int, tx_type: str):
        return self.db.query(Transaction).filter(
            Transaction.account_id == account_id,
            Transaction.type == tx_type
        ).order_by(Transaction.date.desc()).all()

    def get_recent_by_user_id(self, user_id: int, limit: int = 10):
        return self.db.query(Transaction).filter(
            Transaction.user_id == user_id
        ).order_by(Transaction.date.desc()).limit(limit).all()

    def create(self, transaction: Transaction):
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction
