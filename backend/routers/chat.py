from fastapi import APIRouter, Depends
from schemas import ChatRequest, ChatResponse
from services.chat_service import ChatService

router = APIRouter(prefix="/api/chat", tags=["chat"])

def get_chat_service():
    return ChatService()

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, service: ChatService = Depends(get_chat_service)):
    return service.get_chat_response(request)
