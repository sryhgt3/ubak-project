from openai import OpenAI
import os
import google.generativeai as genai
from prompts.chatbotprompt import SYSTEM_PROMPT
from fastapi import HTTPException
from schemas import ChatRequest, ChatResponse, UserOut
import json

generation_config = {
    "max_output_tokens": 500,
    "temperature": 0.7
}

class AIService:
    def __init__(self):
        self.openai_client = None
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            self.openai_client = OpenAI(api_key=openai_key)
        
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            genai.configure(api_key=gemini_key)
        
        self.gemini_model = None
        try:
            self.gemini_model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config=generation_config,
                system_instruction=SYSTEM_PROMPT
            )
        except Exception as e:
            print(f"Gemini init error: {e}")

    def get_chat_response(self, request: ChatRequest):
        provider = request.provider.lower() if request.provider else "openai"
        
        if provider == "gemini" and self.gemini_model:
            return self._get_gemini_response(request)
        elif self.openai_client:
            return self._get_openai_response(request)
        else:
            raise HTTPException(status_code=503, detail="AI Service unavailable")

    def _get_openai_response(self, request: ChatRequest):
        try:
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            if request.history:
                for msg in request.history:
                    messages.append({"role": msg.role, "content": msg.content})
            messages.append({"role": "user", "content": request.message})
            
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=300
            )
            return ChatResponse(response=response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")
        
    def _get_gemini_response(self, request: ChatRequest):
        try:
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

    def generate_financial_advice(self, user_data: dict):
        prompt = f"""
        Sebagai konsultan keuangan pribadi UBAK, berikan nasihat keuangan singkat dan praktis berdasarkan data berikut:
        User: {user_data['username']}
        Pemasukan Bulanan: IDR {user_data.get('monthly_income', 0)}
        Total Pemasukan Tercatat: IDR {user_data.get('total_income', 0)}
        Total Pengeluaran Tercatat: IDR {user_data.get('total_expenses', 0)}
        Saldo Saat Ini: IDR {user_data.get('total_balance', 0)}
        Batas Pengeluaran: IDR {user_data.get('max_spending', 0)}
        Target Tabungan: {user_data.get('savings_goal', 'Tidak ada')}
        Barang Impian: {user_data.get('dream_item', 'Tidak ada')}

        Berikan 3 poin utama:
        1. Analisis kondisi saat ini.
        2. Saran penghematan atau alokasi.
        3. Estimasi pencapaian target tabungan/barang impian.
        """
        
        try:
            if self.gemini_model:
                response = self.gemini_model.generate_content(prompt)
                return ChatResponse(response=response.text)
            elif self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=500
                )
                return ChatResponse(response=response.choices[0].message.content)
            else:
                return ChatResponse(response="AI Service tidak tersedia saat ini. Silakan coba lagi nanti.")
        except Exception as e:
            print(f"AI Advice Error: {str(e)}")
            return ChatResponse(response="Maaf, saya tidak dapat memberikan saran saat ini karena gangguan teknis.")
