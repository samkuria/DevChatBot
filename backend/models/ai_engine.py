# backend/models/ai_engine.py
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_ai_response(prompt: str) -> str:
    try:
        headers = {
            "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
            "HTTP-Referer": "http://localhost:3000",  # required by OpenRouter for tracking
            "X-Title": "DevChatbot"  # optional
        }

        data = {
            "model": "openrouter/auto",  # auto-selects a free available model
            "messages": [
                {"role": "system", "content": "You are a helpful AI assistant for developers."},
                {"role": "user", "content": prompt}
            ]
        }

        # Send request to OpenRouter
        response = requests.post(
            f"{os.getenv('OPENAI_API_BASE')}/chat/completions",
            headers=headers,
            json=data
        )

        result = response.json()

        if "error" in result:
            return f"Error: {result['error']['message']}"

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        return f"Error: {str(e)}"