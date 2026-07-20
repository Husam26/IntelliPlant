"""
Document Management API — Upload, list, retrieve, and delete documents.

This is the most critical router for Phase 1. It handles:
1. File upload (saves to disk + creates DB record)
2. Triggers async document processing (text extraction → chunking → embeddings)
3. CRUD operations for the document library
"""

import os
import shutil
import uuid
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.models.models import Document
from app.schemas.schemas import DocumentResponse, DocumentListResponse, DocumentUploadResponse
from app.services.document_processor import process_document

router = APIRouter()

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".xlsx", ".xls", ".txt", ".csv"}


def _get_file_extension(filename: str) -> str:
    """Extract and validate file extension."""
    _, ext = os.path.splitext(filename.lower())
    return ext


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a document for processing.
    
    Flow:
    1. Validate file type
    2. Save file to disk (data/uploads/)
    3. Create a record in the documents table
    4. Kick off background processing (text extraction + chunking + embeddings)
    5. Return immediately — processing happens in background
    
    The frontend can poll GET /api/documents/{id} to check processing_status.
    """
    # 1. Validate file type
    ext = _get_file_extension(file.filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 2. Generate unique filename and save to disk
    doc_id = str(uuid.uuid4())
    safe_filename = f"{doc_id}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Get file size
    file_size = os.path.getsize(file_path)

    # 3. Create database record
    document = Document(
        id=doc_id,
        filename=file.filename,
        file_path=file_path,
        file_type=ext.lstrip("."),
        file_size=file_size,
        processing_status="pending",
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # 4. Trigger background processing
    background_tasks.add_task(process_document, doc_id)

    # 5. Return immediately
    return DocumentUploadResponse(
        id=doc_id,
        filename=file.filename,
        message="Document uploaded successfully. Processing started.",
        processing_status="pending",
    )


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by processing status"),
    search: Optional[str] = Query(None, description="Search in filename"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    List all documents with optional filters.
    
    Supports filtering by:
    - category: SOP, Incident, Maintenance, Compliance, Manual
    - status: pending, processing, ready, failed
    - search: text search in filename
    """
    query = db.query(Document)

    if category:
        query = query.filter(Document.doc_category == category)
    if status:
        query = query.filter(Document.processing_status == status)
    if search:
        query = query.filter(Document.filename.ilike(f"%{search}%"))

    total = query.count()
    documents = query.order_by(Document.upload_date.desc()).offset(skip).limit(limit).all()

    return DocumentListResponse(
        documents=[DocumentResponse.model_validate(doc) for doc in documents],
        total=total,
    )


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str, db: Session = Depends(get_db)):
    """Get a single document by ID."""
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse.model_validate(document)


@router.delete("/{doc_id}")
async def delete_document(doc_id: str, db: Session = Depends(get_db)):
    """
    Delete a document — removes DB record AND file from disk.
    Also removes chunks from ChromaDB.
    """
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete file from disk
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete from ChromaDB (best effort)
    try:
        from app.services.document_processor import delete_document_chunks
        delete_document_chunks(doc_id)
    except Exception:
        pass  # ChromaDB might not be initialized yet

    # Delete from database (cascades to entities and incidents)
    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully", "id": doc_id}
