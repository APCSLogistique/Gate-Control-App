from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from agents.gemini_agent import GeminiAgent
from tools import get_chat_messages
from models import GenerateRequest, GenerateResponse, ChatMessage
from agents.base import AgentInterface

app = FastAPI(
    title="AI Agent Service",
    description="AI Agent service for port booking system",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = GeminiAgent()

tools = []


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "service": "AI Agent Service"}


@app.post("/api/ai/generate", response_model=GenerateResponse)
async def generate(
    request: GenerateRequest,
):
    """
    Generate AI response for a user message

    Args:
        request: Contains chat_id and message
        agent: Injected AI agent instance
        tools_service: Injected tools service instance

    Returns:
        GenerateResponse with the AI's message
    """
    try:
        # Get chat history
        chat_history: List[ChatMessage] = []
        try:
            chat_history = await get_chat_messages(request.chat_id)
        except Exception as e:
            # If we can't get history, continue with empty history
            print(f"Warning: Could not fetch chat history: {e}")

        # Generate response
        response_message = await agent.generate(
            message=request.message,
            chat_history=chat_history,
            tools=tools,
            user_id=request.user_id,
        )

        return GenerateResponse(message=response_message)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating response: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
