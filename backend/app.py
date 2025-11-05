# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.ai_engine import generate_ai_response

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (allow frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str

# Root endpoint (test route)
@app.get("/")
def read_root():
    return {"message": "Developer Chatbot API is running!"}

# Chat endpoint (main AI logic)
@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    response = generate_ai_response(request.message)
    return {"reply": response}