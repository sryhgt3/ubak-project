import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv('backend/.env')
gemini_key = os.getenv("GEMINI_API_KEY")

if not gemini_key:
    print("No GEMINI_API_KEY found in backend/.env")
else:
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content("Hello")
        print("Gemini API is WORKING! Response:", response.text)
    except Exception as e:
        print("Gemini API Error:", e)
