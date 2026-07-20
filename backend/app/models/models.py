"""
SQLAlchemy ORM Models — Maps Python classes to database tables.

Each class here represents one table. SQLAlchemy handles:
- Creating the table SQL (CREATE TABLE)
- Converting Python objects to/from database rows
- Managing relationships between tables (foreign keys)

Think of it as: Python Class = Database Table, Class Instance = Row
"""

import uuid
from datetime import datetime, date

from sqlalchemy import (
    Column, String, Text, Float, Integer, Boolean,
    DateTime, Date, ForeignKey, JSON
)
from sqlalchemy.orm import relationship

from app.database import Base


def generate_uuid() -> str:
    """Generate a random UUID string for primary keys."""
    return str(uuid.uuid4())


class Document(Base):
    """
    Stores metadata about uploaded documents.
    
    When a user uploads a PDF/DOCX/etc., we create one row here.
    The actual file is stored on disk; this table tracks metadata.
    
    Lifecycle: Upload → Processing → Ready (or Failed)
    """
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    filename = Column(String, nullable=False)              # Original filename
    file_path = Column(String, nullable=False)             # Path on disk
    file_type = Column(String)                             # pdf, docx, xlsx, txt
    file_size = Column(Integer)                            # Size in bytes
    doc_category = Column(String)                          # SOP, Incident, Maintenance, Compliance, Manual
    upload_date = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)             # Has text been extracted?
    processing_status = Column(String, default="pending")  # pending, processing, ready, failed
    summary = Column(Text)                                 # AI-generated summary
    page_count = Column(Integer, default=0)
    chunk_count = Column(Integer, default=0)               # Number of chunks in vector DB
    
    # Relationships — one document can have many entities and incidents
    entities = relationship("Entity", back_populates="document", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="document", cascade="all, delete-orphan")


class Asset(Base):
    """
    Industrial equipment/assets tracked by the plant.
    
    These are pre-seeded (P-101, C-401, etc.) and referenced
    by incidents and compliance records. Each asset has a
    health_score (0-100) computed from its incident history.
    """
    __tablename__ = "assets"

    id = Column(String, primary_key=True)                  # P-101, C-401, etc.
    name = Column(String, nullable=False)                  # Human-readable name
    type = Column(String)                                  # Centrifugal Pump, Compressor, etc.
    location = Column(String)                              # Unit A, Unit B, etc.
    criticality = Column(String)                           # Critical, High, Medium, Low
    health_score = Column(Float, default=85.0)             # 0-100 health score
    last_maintenance = Column(Date)
    next_scheduled = Column(Date)
    status = Column(String, default="Operational")         # Operational, Under Maintenance, Offline
    install_date = Column(Date)
    manufacturer = Column(String)
    
    # Relationships
    incidents = relationship("Incident", back_populates="asset")
    compliance_records = relationship("Compliance", back_populates="asset")


class Entity(Base):
    """
    Extracted entities from documents via NER (Named Entity Recognition).
    
    When the AI reads a document, it extracts structured entities like:
    - Equipment names (P-101, C-401)
    - Failure types (seal wear, bearing failure)
    - Part numbers (SKF-6205, etc.)
    - Dates, people, chemicals
    
    Each entity links back to its source document for traceability.
    """
    __tablename__ = "entities"

    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    entity_type = Column(String)                           # equipment, failure, part, person, date, chemical
    entity_value = Column(String)                          # The actual extracted value
    confidence = Column(Float, default=1.0)                # How confident the AI is (0-1)
    context = Column(Text)                                 # Surrounding text for reference
    
    # Relationship back to document
    document = relationship("Document", back_populates="entities")


class Incident(Base):
    """
    Safety/equipment incidents extracted from incident reports.
    
    These power the analytics dashboard — timeline, patterns,
    root cause analysis, etc. Each incident links to a document
    (source) and an asset (what was affected).
    """
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("documents.id"))
    asset_id = Column(String, ForeignKey("assets.id"))
    incident_date = Column(Date)
    severity = Column(String)                              # Critical, High, Medium, Low
    category = Column(String)                              # Safety, Equipment Failure, Environmental, Process
    title = Column(String)
    description = Column(Text)
    root_cause = Column(Text)
    corrective_action = Column(Text)
    status = Column(String, default="Open")                # Open, Closed, In Progress
    downtime_hours = Column(Float, default=0)
    
    # Relationships
    document = relationship("Document", back_populates="incidents")
    asset = relationship("Asset", back_populates="incidents")


class Compliance(Base):
    """
    Compliance tracking — maps regulatory requirements to assets.
    
    Tracks whether each asset meets its required inspections,
    maintenance schedules, and safety standards. Used to generate
    the compliance gap analysis and risk scores.
    """
    __tablename__ = "compliance"

    id = Column(String, primary_key=True, default=generate_uuid)
    asset_id = Column(String, ForeignKey("assets.id"))
    requirement = Column(Text)                             # What needs to be done
    sop_reference = Column(String)                         # Which SOP defines this
    status = Column(String, default="Compliant")           # Compliant, Non-Compliant, Overdue, Due Soon
    last_checked = Column(Date)
    next_due = Column(Date)
    risk_level = Column(String, default="Low")             # Critical, High, Medium, Low
    notes = Column(Text)
    
    # Relationship
    asset = relationship("Asset", back_populates="compliance_records")


class ChatMessage(Base):
    """
    Chat history for the AI Copilot.
    
    Stores both user questions and AI responses, including
    the citations (source documents) the AI referenced.
    Used to maintain conversation context and show chat history.
    """
    __tablename__ = "chat_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    session_id = Column(String, nullable=False)            # Groups messages into conversations
    role = Column(String, nullable=False)                  # "user" or "assistant"
    message = Column(Text, nullable=False)
    citations = Column(JSON)                               # [{doc_id, doc_name, page, excerpt}]
    timestamp = Column(DateTime, default=datetime.utcnow)
