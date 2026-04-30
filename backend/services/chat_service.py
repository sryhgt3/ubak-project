from openai import OpenAI
import os
import google.generativeai as genai
from prompts.chatbotprompt import SYSTEM_PROMPT
from fastapi import HTTPException
from schemas import ChatRequest, ChatResponse

generation_config = {
    "max_output_tokens": 200,
    "temperature": 0.7
}

class ChatService:
    def __init__(self):
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Initialize Gemini client
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            genai.configure(api_key=gemini_key)
        self.gemini_model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config=generation_config,
            system_instruction=SYSTEM_PROMPT

        )

    def get_chat_response(self, request: ChatRequest):
        provider = request.provider.lower() if request.provider else "openai"
        
        if provider == "gemini":
            return self._get_gemini_response(request)
        else:
            return self._get_openai_response(request)

    def _get_openai_response(self, request: ChatRequest):
        try:
            messages = []
            messages.append({
                "role": "system", 
                "content": SYSTEM_PROMPT
            })
            
            if request.history:
                for msg in request.history:
                    messages.append({"role": msg.role, "content": msg.content})
            
            messages.append({"role": "user", "content": request.message})
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=100
            )
            
            ai_message = response.choices[0].message.content
            return ChatResponse(response=ai_message)
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")
        
    def _get_gemini_response(self, request: ChatRequest):
        try:
            # Map history to Gemini format
            # Gemini expects 'user' and 'model' roles
            history = []
            if request.history:
                for msg in request.history:
                    role = "user" if msg.role == "user" else "model"
                    history.append({"role": role, "parts": [msg.content]})
            
            chat_session = self.gemini_model.start_chat(history=history)
            response = chat_session.send_message(request.message)
            
            return ChatResponse(response=response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from Gemini")
