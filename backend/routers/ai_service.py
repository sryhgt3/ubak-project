from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_current_user
from models import User, UserRole
from schemas import ChatRequest, ChatResponse
from services.ai_service import AIService
from services.dashboard_service import DashboardService
from repositories.user_repository import UserRepository
from repositories.transaction_repository import TransactionRepository
from sqlalchemy.orm import Session
from dependencies import get_db

router = APIRouter(prefix="/ai", tags=["ai-service"])

def get_ai_service():
    return AIService()

def get_dashboard_service(db: Session = Depends(get_db)):
    return DashboardService(UserRepository(db), TransactionRepository(db))

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest, 
    current_user: User = Depends(get_current_user),
    service: AIService = Depends(get_ai_service)
):
    if current_user.role not in [UserRole.VIP, UserRole.Admin]:
        raise HTTPException(status_code=403, detail="AI Chatbot hanya tersedia untuk pengguna VIP.")
    return service.get_chat_response(request)

@router.get("/advice", response_model=ChatResponse)
async def get_advice(
    current_user: User = Depends(get_current_user),
    ai_service: AIService = Depends(get_ai_service),
    dash_service: DashboardService = Depends(get_dashboard_service)
):
    if current_user.role not in [UserRole.VIP, UserRole.Admin]:
        raise HTTPException(status_code=403, detail="Financial Advice hanya tersedia untuk pengguna VIP.")
    
    user_data = dash_service.get_dashboard_data(current_user)
    return ai_service.generate_financial_advice(user_data)
