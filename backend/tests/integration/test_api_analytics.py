from fastapi.testclient import TestClient
from app.models.models import Asset, Incident

def test_get_overview_empty(client: TestClient):
    """Test overview analytics when DB is empty."""
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_assets"] == 0
    assert data["total_incidents"] == 0
    assert data["compliance_rate"] == 0.0

def test_get_overview_with_data(client: TestClient, db_session):
    """Test overview analytics when DB has data."""
    # Insert mock data
    asset = Asset(id="A-1", name="Test Asset", health_score=80.0)
    db_session.add(asset)
    
    incident = Incident(
        id="I-1", 
        asset_id="A-1", 
        severity="Critical", 
        status="Open",
        title="Test Incident"
    )
    db_session.add(incident)
    db_session.commit()

    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_assets"] == 1
    assert data["total_incidents"] == 1
    assert data["open_incidents"] == 1
    assert data["avg_health_score"] == 80.0
    assert data["critical_alerts"] == 1  # 1 critical open incident
