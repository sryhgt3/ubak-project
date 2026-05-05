from fastapi import HTTPException
from models import User, Account
from schemas import AccountCreate, AccountUpdate
from repositories.account_repository import AccountRepository

class AccountService:
    def __init__(self, account_repo: AccountRepository):
        self.account_repo = account_repo

    def get_user_accounts(self, user: User):
        return self.account_repo.get_by_user_id(user.id)

    def create_account(self, account_data: AccountCreate, user: User):
        existing = self.account_repo.get_by_name(user.id, account_data.name)
        if existing:
            raise HTTPException(status_code=400, detail=f"Account with name '{account_data.name}' already exists")
            
        new_account = Account(
            user_id=user.id,
            name=account_data.name,
            type=account_data.type,
            balance=account_data.balance,
            max_spending=account_data.max_spending
        )
        return self.account_repo.create(new_account)

    def update_account(self, account_id: int, account_data: AccountUpdate, user: User):
        account = self.get_account_by_id(account_id, user)
        
        if account_data.name:
            # Check if name already exists for this user (and it's not the current account)
            existing = self.account_repo.get_by_name(user.id, account_data.name)
            if existing and existing.id != account_id:
                raise HTTPException(status_code=400, detail=f"Account with name '{account_data.name}' already exists")
            account.name = account_data.name
            
        if account_data.type:
            account.type = account_data.type
            
        if account_data.balance is not None:
            account.balance = account_data.balance
            
        if account_data.max_spending is not None:
            account.max_spending = account_data.max_spending
            
        return self.account_repo.update(account)

    def get_account_by_id(self, account_id: int, user: User):
        account = self.account_repo.get_by_id(account_id)
        if not account or account.user_id != user.id:
            raise HTTPException(status_code=404, detail="Account not found")
        return account

    def delete_account(self, account_id: int, user: User):
        account = self.get_account_by_id(account_id, user)
        self.account_repo.delete(account)
        return {"message": "Account deleted successfully"}
