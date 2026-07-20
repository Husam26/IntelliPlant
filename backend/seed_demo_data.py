import os
import sys

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from datetime import datetime, timedelta
import uuid

from app.database import SessionLocal, Base, engine
from app.models.models import Asset, Incident, Compliance, Document, Entity

def seed_database():
    print("Clearing existing tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    print("Seeding Demo Assets...")
    assets = [
        Asset(id="P-101", name="Centrifugal Pump 101", type="Pump", location="Unit A", criticality="Critical", health_score=78.5, status="Active"),
        Asset(id="C-401", name="Gas Compressor 401", type="Compressor", location="Unit B", criticality="Critical", health_score=62.0, status="Warning"),
        Asset(id="HX-205", name="Heat Exchanger 205", type="Exchanger", location="Unit A", criticality="Medium", health_score=92.0, status="Active"),
        Asset(id="T-901", name="Storage Tank 901", type="Tank", location="Tank Farm", criticality="Low", health_score=98.0, status="Active"),
        Asset(id="V-302", name="Control Valve 302", type="Valve", location="Unit C", criticality="High", health_score=85.0, status="Active"),
        Asset(id="M-505", name="Conveyor Motor 505", type="Motor", location="Packaging", criticality="Medium", health_score=45.0, status="Critical"),
        Asset(id="P-102", name="Centrifugal Pump 102", type="Pump", location="Unit A", criticality="High", health_score=88.0, status="Active"),
    ]
    db.add_all(assets)
    
    print("Seeding Demo Incidents...")
    incidents = [
        Incident(id=str(uuid.uuid4()), asset_id="C-401", title="High Vibration Detected", description="Compressor C-401 experienced high vibration on bearing #2.", category="Vibration", severity="High", status="Open", incident_date=datetime.utcnow() - timedelta(days=2)),
        Incident(id=str(uuid.uuid4()), asset_id="M-505", title="Motor Overheating", description="Motor M-505 exceeded 85C operating temperature.", category="Thermal", severity="Critical", status="In Progress", incident_date=datetime.utcnow() - timedelta(hours=5)),
        Incident(id=str(uuid.uuid4()), asset_id="P-101", title="Seal Leakage", description="Minor leak detected on mechanical seal.", category="Leak", severity="Medium", status="Closed", incident_date=datetime.utcnow() - timedelta(days=10)),
        Incident(id=str(uuid.uuid4()), asset_id="P-101", title="Seal Replacement Needed", description="Seal performance degrading.", category="Leak", severity="High", status="Open", incident_date=datetime.utcnow() - timedelta(days=1)),
    ]
    db.add_all(incidents)
    
    print("Seeding Demo Compliance Records...")
    compliance = [
        Compliance(id=str(uuid.uuid4()), asset_id="C-401", requirement="EPA Emissions Check", status="Non-Compliant", next_due=datetime.utcnow() - timedelta(days=5)),
        Compliance(id=str(uuid.uuid4()), asset_id="T-901", requirement="API 653 Inspection", status="Compliant", next_due=datetime.utcnow() + timedelta(days=180)),
        Compliance(id=str(uuid.uuid4()), asset_id="P-101", requirement="OSHA Safety Guard Check", status="Compliant", next_due=datetime.utcnow() + timedelta(days=30)),
        Compliance(id=str(uuid.uuid4()), asset_id="M-505", requirement="Electrical Insulation Test", status="Overdue", next_due=datetime.utcnow() - timedelta(days=1)),
    ]
    db.add_all(compliance)
    
    db.commit()
    print("Database seeded successfully with rich demo data!")

if __name__ == "__main__":
    seed_database()
