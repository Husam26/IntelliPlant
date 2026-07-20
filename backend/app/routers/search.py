"""
Search API — Full-text search across documents.
Placeholder for now — will integrate with ChromaDB semantic search in Phase 2.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Document
from app.schemas.schemas import DocumentResponse

router = APIRouter()


@router.get("")
async def search_documents(
    q: str = Query(..., min_length=1, description="Search query"),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Search across documents by filename and summary.
    Phase 2 will add semantic search via ChromaDB embeddings.
    """
    query = db.query(Document).filter(
        Document.filename.ilike(f"%{q}%") |
        Document.summary.ilike(f"%{q}%")
    )

    if category:
        query = query.filter(Document.doc_category == category)

    results = query.all()

    return {
        "query": q,
        "results": [DocumentResponse.model_validate(doc) for doc in results],
        "total": len(results),
    }
