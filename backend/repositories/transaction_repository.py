from sqlalchemy.orm import Session
from models import Transaction

class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int):
        return self.db.query(Transaction).filter(Transaction.user_id == user_id).all()

    def get_recent_by_user_id(self, user_id: int, limit: int = 10):
        return self.db.query(Transaction).filter(
            Transaction.user_id == user_id
        ).order_by(Transaction.date.desc()).limit(limit).all()

    def create(self, transaction: Transaction):
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def get_by_id_and_user_id(self, transaction_id: int, user_id: int):
        return self.db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == user_id).first()

    def update(self, transaction: Transaction):
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def delete(self, transaction: Transaction):
        self.db.delete(transaction)
        self.db.commit()
