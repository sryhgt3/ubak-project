from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from dependencies import get_db, get_current_user
from models import User
from schemas import TransactionCreate, TransactionOut
from services.transaction_service import TransactionService
from repositories.transaction_repository import TransactionRepository
from repositories.account_repository import AccountRepository

router = APIRouter(tags=["transactions"])

def get_transaction_repository(db: Session = Depends(get_db)):
    return TransactionRepository(db)

def get_account_repository(db: Session = Depends(get_db)):
    return AccountRepository(db)

def get_transaction_service(
    transaction_repo: TransactionRepository = Depends(get_transaction_repository),
    account_repo: AccountRepository = Depends(get_account_repository)
):
    return TransactionService(transaction_repo, account_repo)

@router.post("/transactions", response_model=TransactionOut)
async def create_transaction(
    transaction: TransactionCreate, 
    current_user: User = Depends(get_current_user), 
    service: TransactionService = Depends(get_transaction_service)
):
    return service.create_transaction(transaction, current_user)

@router.get("/transactions", response_model=List[TransactionOut])
async def get_transactions(
    account_id: Optional[int] = None,
    type: Optional[str] = None,
    current_user: User = Depends(get_current_user), 
    service: TransactionService = Depends(get_transaction_service)
):
    return service.get_user_transactions(current_user, account_id, type)
