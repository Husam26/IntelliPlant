"""
AI Copilot Chat API — Placeholder for Phase 2 (RAG pipeline).

For now, provides a basic echo endpoint. The real RAG pipeline
(LangChain + ChromaDB + Gemini) will be wired in Week 2.
"""

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import ChatMessage
from app.schemas.schemas import ChatRequest, ChatResponse, ChatMessageResponse

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Send a question to the AI Copilot.
    
    Phase 1: Returns a placeholder response.
    Phase 2: Will connect to RAG pipeline for real answers with citations.
    """
    session_id = request.session_id or str(uuid.uuid4())

    # Save user message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        message=request.message,
    )
    db.add(user_msg)

    # Call the RAG pipeline
    from app.services.llm_service import generate_rag_answer
    rag_result = generate_rag_answer(request.message, session_id)
    
    answer = rag_result["answer"]
    citations = rag_result["citations"]

    # Save assistant response
    assistant_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        message=answer,
        citations=citations,
    )
    db.add(assistant_msg)
    db.commit()

    return ChatResponse(
        answer=answer,
        citations=citations,
        session_id=session_id,
    )


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """Get chat history for a session."""
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.timestamp.asc())
        .all()
    )

    return {
        "session_id": session_id,
        "messages": [ChatMessageResponse.model_validate(msg) for msg in messages],
        "total": len(messages),
    }
