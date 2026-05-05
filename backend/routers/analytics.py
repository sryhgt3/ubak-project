from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models import User, UserRole
from services.analytics_service import AnalyticsService
from repositories.transaction_repository import TransactionRepository

router = APIRouter(prefix="/analytics", tags=["analytics"])

def get_analytics_service(db: Session = Depends(get_db)):
    return AnalyticsService(TransactionRepository(db))

@router.get("/trends")
async def get_trends(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    service: AnalyticsService = Depends(get_analytics_service)
):
    if current_user.role not in [UserRole.VIP, UserRole.Admin]:
        raise HTTPException(status_code=403, detail="Analitik tren hanya tersedia untuk pengguna VIP.")
    return service.get_spending_trends(current_user.id, days)

@router.get("/categories")
async def get_categories(
    current_user: User = Depends(get_current_user),
    service: AnalyticsService = Depends(get_analytics_service)
):
    if current_user.role not in [UserRole.VIP, UserRole.Admin]:
        raise HTTPException(status_code=403, detail="Breakdown kategori mendalam hanya tersedia untuk pengguna VIP.")
    return service.get_category_breakdown(current_user.id)
