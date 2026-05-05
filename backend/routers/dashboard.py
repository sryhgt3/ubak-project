from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models import User
from schemas import DashboardData
from services.dashboard_service import DashboardService
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository
from repositories.account_repository import AccountRepository

router = APIRouter(tags=["dashboard"])

def get_user_repository(db: Session = Depends(get_db)):
    return UserRepository(db)

def get_transaction_repository(db: Session = Depends(get_db)):
    return TransactionRepository(db)

def get_account_repository(db: Session = Depends(get_db)):
    return AccountRepository(db)

def get_dashboard_service(
    user_repo: UserRepository = Depends(get_user_repository),
    transaction_repo: TransactionRepository = Depends(get_transaction_repository),
    account_repo: AccountRepository = Depends(get_account_repository)
):
    return DashboardService(user_repo, transaction_repo, account_repo)

from typing import Optional
...
@router.get("/dashboard", response_model=DashboardData)
async def read_dashboard(
    account_id: Optional[int] = None,
    current_user: User = Depends(get_current_user), 
    service: DashboardService = Depends(get_dashboard_service)
):
    return service.get_dashboard_data(current_user, account_id)
