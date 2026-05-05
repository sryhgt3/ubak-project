from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
from models import User, UserRole
from services.admin_service import AdminService
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository

router = APIRouter(prefix="/admin", tags=["admin"])

def get_admin_service(db: Session = Depends(get_db)):
    return AdminService(UserRepository(db), TransactionRepository(db))

@router.get("/users")
async def get_users(
    current_user: User = Depends(get_current_user),
    service: AdminService = Depends(get_admin_service)
):
    if current_user.role != UserRole.Admin:
        raise HTTPException(status_code=403, detail="Akses Admin diperlukan.")
    return service.get_all_users()

@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_user),
    service: AdminService = Depends(get_admin_service)
):
    if current_user.role != UserRole.Admin:
        raise HTTPException(status_code=403, detail="Akses Admin diperlukan.")
    return service.get_system_stats()
