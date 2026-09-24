from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from dependencies import get_db, get_current_user
from models import User
from schemas import TransactionCreate, TransactionOut, TransactionUpdate
from services.transaction_service import TransactionService
from repositories.transaction_repository import TransactionRepository

router = APIRouter(tags=["transactions"])

def get_transaction_repository(db: Session = Depends(get_db)):
    return TransactionRepository(db)

def get_transaction_service(transaction_repo: TransactionRepository = Depends(get_transaction_repository)):
    return TransactionService(transaction_repo)

@router.post("/transactions", response_model=TransactionOut)
async def create_transaction(
    transaction: TransactionCreate, 
    current_user: User = Depends(get_current_user), 
    service: TransactionService = Depends(get_transaction_service)
):
    return service.create_transaction(transaction, current_user)

@router.get("/transactions", response_model=List[TransactionOut])
async def get_transactions(
    current_user: User = Depends(get_current_user), 
    service: TransactionService = Depends(get_transaction_service)
):
    return service.get_user_transactions(current_user)

@router.put("/transactions/{transaction_id}", response_model=TransactionOut)
async def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service)
):
    return service.update_transaction(transaction_id, transaction_update, current_user)

@router.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service)
):
    return service.delete_transaction(transaction_id, current_user)
