"""
Pydantic Schemas — Define the shape of API request/response data.

These are NOT database models. They define:
1. What data the API accepts (request schemas)
2. What data the API returns (response schemas)
3. Validation rules (types, required fields, defaults)

FastAPI uses these to auto-generate Swagger docs and validate requests.
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


# ========================
# Document Schemas
# ========================

class DocumentResponse(BaseModel):
    """What the API returns when you ask for a document."""
    id: str
    filename: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    doc_category: Optional[str] = None
    upload_date: Optional[datetime] = None
    processed: bool = False
    processing_status: str = "pending"
    summary: Optional[str] = None
    page_count: int = 0
    chunk_count: int = 0

    class Config:
        from_attributes = True  # Allows creating from SQLAlchemy model


class DocumentListResponse(BaseModel):
    """Paginated list of documents."""
    documents: List[DocumentResponse]
    total: int


class DocumentUploadResponse(BaseModel):
    """Response after uploading a document."""
    id: str
    filename: str
    message: str
    processing_status: str


# ========================
# Asset Schemas
# ========================

class AssetResponse(BaseModel):
    """Equipment/asset data returned by the API."""
    id: str
    name: str
    type: Optional[str] = None
    location: Optional[str] = None
    criticality: Optional[str] = None
    health_score: float = 85.0
    last_maintenance: Optional[date] = None
    next_scheduled: Optional[date] = None
    status: str = "Operational"
    install_date: Optional[date] = None
    manufacturer: Optional[str] = None
    incident_count: int = 0

    class Config:
        from_attributes = True


class AssetListResponse(BaseModel):
    """List of assets."""
    assets: List[AssetResponse]
    total: int


# ========================
# Chat Schemas
# ========================

class ChatRequest(BaseModel):
    """What the user sends when asking a question."""
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None  # For conversation continuity


class Citation(BaseModel):
    """A source reference in an AI answer."""
    document_id: str
    document_name: str
    page: Optional[int] = None
    excerpt: str


class ChatResponse(BaseModel):
    """AI answer with citations."""
    answer: str
    citations: List[Citation] = []
    session_id: str


class ChatMessageResponse(BaseModel):
    """A single message in chat history."""
    id: str
    role: str
    message: str
    citations: Optional[List[Citation]] = None
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True


# ========================
# Incident Schemas
# ========================

class IncidentResponse(BaseModel):
    """An incident record."""
    id: str
    asset_id: Optional[str] = None
    incident_date: Optional[date] = None
    severity: Optional[str] = None
    category: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    status: str = "Open"
    downtime_hours: float = 0

    class Config:
        from_attributes = True


# ========================
# Analytics Schemas
# ========================

class AnalyticsOverview(BaseModel):
    """Dashboard summary statistics."""
    total_documents: int = 0
    total_assets: int = 0
    total_incidents: int = 0
    open_incidents: int = 0
    compliance_rate: float = 0.0
    avg_health_score: float = 0.0
    documents_processed: int = 0
    critical_alerts: int = 0


class PatternResponse(BaseModel):
    """A detected failure pattern."""
    asset_id: str
    asset_name: str
    pattern_type: str
    description: str
    occurrence_count: int
    severity: str
    recommendation: str


class ComplianceResponse(BaseModel):
    """Compliance status for an asset."""
    id: str
    asset_id: str
    asset_name: Optional[str] = None
    requirement: str
    sop_reference: Optional[str] = None
    status: str
    last_checked: Optional[date] = None
    next_due: Optional[date] = None
    risk_level: str = "Low"

    class Config:
        from_attributes = True
