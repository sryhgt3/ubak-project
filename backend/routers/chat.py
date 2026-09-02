from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import ChatRequest, ChatResponse
from services.chat_service import ChatService
from dependencies import get_current_vip_user, get_db
from models import User

router = APIRouter(prefix="/api/chat", tags=["chat"])

def get_chat_service(db: Session = Depends(get_db)):
    return ChatService(db)

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, service: ChatService = Depends(get_chat_service), current_user: User = Depends(get_current_vip_user)):
    return service.get_chat_response(request, current_user)
