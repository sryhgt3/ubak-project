from models import Transaction, User
from schemas import TransactionCreate, TransactionUpdate
from fastapi import HTTPException
from repositories.transaction_repository import TransactionRepository

class TransactionService:
    def __init__(self, transaction_repo: TransactionRepository):
        self.transaction_repo = transaction_repo

    def create_transaction(self, transaction: TransactionCreate, user: User):
        db_transaction = Transaction(**transaction.model_dump(), user_id=user.id)
        return self.transaction_repo.create(db_transaction)

    def get_user_transactions(self, user: User):
        return self.transaction_repo.get_by_user_id(user.id)

    def update_transaction(self, transaction_id: int, transaction_update: TransactionUpdate, user: User):
        db_transaction = self.transaction_repo.get_by_id_and_user_id(transaction_id, user.id)
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        update_data = transaction_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                setattr(db_transaction, key, value)
        
        return self.transaction_repo.update(db_transaction)

    def delete_transaction(self, transaction_id: int, user: User):
        db_transaction = self.transaction_repo.get_by_id_and_user_id(transaction_id, user.id)
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        self.transaction_repo.delete(db_transaction)
        return {"message": "Transaction deleted successfully"}
