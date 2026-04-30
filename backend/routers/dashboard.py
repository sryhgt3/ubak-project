from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models import User
from schemas import DashboardData
from services.dashboard_service import DashboardService
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository

router = APIRouter(tags=["dashboard"])

def get_user_repository(db: Session = Depends(get_db)):
    return UserRepository(db)

def get_transaction_repository(db: Session = Depends(get_db)):
    return TransactionRepository(db)

def get_dashboard_service(
    user_repo: UserRepository = Depends(get_user_repository),
    transaction_repo: TransactionRepository = Depends(get_transaction_repository)
):
    return DashboardService(user_repo, transaction_repo)

@router.get("/dashboard", response_model=DashboardData)
async def read_dashboard(
    current_user: User = Depends(get_current_user), 
    service: DashboardService = Depends(get_dashboard_service)
):
    return service.get_dashboard_data(current_user)
