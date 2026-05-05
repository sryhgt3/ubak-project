from fastapi import HTTPException
from models import Transaction, User, TransactionType
from schemas import TransactionCreate
from repositories.transaction_repository import TransactionRepository
from repositories.account_repository import AccountRepository

class TransactionService:
    def __init__(self, transaction_repo: TransactionRepository, account_repo: AccountRepository):
        self.transaction_repo = transaction_repo
        self.account_repo = account_repo

    def create_transaction(self, transaction: TransactionCreate, user: User):
        # 1. Verify account exists and belongs to user
        account = self.account_repo.get_by_id(transaction.account_id)
        if not account or account.user_id != user.id:
            raise HTTPException(status_code=404, detail="Account not found")
        
        # 2. Update account balance
        if transaction.type == TransactionType.Income:
            account.balance += transaction.amount
        else:
            account.balance -= transaction.amount
        
        self.account_repo.update(account)
        
        # 3. Create transaction
        db_transaction = Transaction(**transaction.model_dump(), user_id=user.id)
        return self.transaction_repo.create(db_transaction)

    def get_user_transactions(self, user: User, account_id: int = None, tx_type: str = None):
        if account_id:
            if tx_type:
                return self.transaction_repo.get_by_account_id_and_type(account_id, tx_type)
            return self.transaction_repo.get_by_account_id(account_id)
        
        txs = self.transaction_repo.get_by_user_id(user.id)
        if tx_type:
            return [t for t in txs if t.type == tx_type]
        return txs
