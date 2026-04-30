from models import Transaction, User
from schemas import TransactionCreate
from repositories.transaction_repository import TransactionRepository

class TransactionService:
    def __init__(self, transaction_repo: TransactionRepository):
        self.transaction_repo = transaction_repo

    def create_transaction(self, transaction: TransactionCreate, user: User):
        db_transaction = Transaction(**transaction.model_dump(), user_id=user.id)
        return self.transaction_repo.create(db_transaction)

    def get_user_transactions(self, user: User):
        return self.transaction_repo.get_by_user_id(user.id)
