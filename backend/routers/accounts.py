from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from dependencies import get_db, get_current_user
from models import User
from schemas import AccountCreate, AccountUpdate, AccountOut
from services.account_service import AccountService
from repositories.account_repository import AccountRepository
from repositories.transaction_repository import TransactionRepository

router = APIRouter(prefix="/api/accounts", tags=["accounts"])

def get_account_repository(db: Session = Depends(get_db)):
    return AccountRepository(db)

def get_transaction_repository(db: Session = Depends(get_db)):
    return TransactionRepository(db)

def get_account_service(
    account_repo: AccountRepository = Depends(get_account_repository),
    transaction_repo: TransactionRepository = Depends(get_transaction_repository)
):
    return AccountService(account_repo, transaction_repo)

@router.get("/", response_model=List[AccountOut])
async def list_accounts(
    current_user: User = Depends(get_current_user), 
    service: AccountService = Depends(get_account_service)
):
    return service.get_user_accounts(current_user)

@router.post("/", response_model=AccountOut)
async def create_account(
    account: AccountCreate, 
    current_user: User = Depends(get_current_user), 
    service: AccountService = Depends(get_account_service)
):
    return service.create_account(account, current_user)

@router.put("/{account_id}", response_model=AccountOut)
async def update_account(
    account_id: int,
    account: AccountUpdate,
    current_user: User = Depends(get_current_user),
    service: AccountService = Depends(get_account_service)
):
    return service.update_account(account_id, account, current_user)

@router.delete("/{account_id}")
async def delete_account(
    account_id: int, 
    current_user: User = Depends(get_current_user), 
    service: AccountService = Depends(get_account_service)
):
    return service.delete_account(account_id, current_user)
