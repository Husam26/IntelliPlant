import pytest
from pydantic import ValidationError
from app.schemas.schemas import AssetResponse, ChatRequest

def test_asset_response_schema():
    """Ensure AssetResponse schema rejects invalid data."""
    # Valid data
    valid_data = {
        "id": "P-101",
        "name": "Pump",
        "health_score": 85.5,
        "criticality": "High",
        "incident_count": 2
    }
    asset = AssetResponse(**valid_data)
    assert asset.id == "P-101"

    # Invalid data (missing required field 'name')
    invalid_data = {
        "id": "P-101",
        "health_score": 85.5
    }
    with pytest.raises(ValidationError):
        AssetResponse(**invalid_data)

def test_chat_request_schema():
    """Ensure ChatRequest requires message field."""
    with pytest.raises(ValidationError):
        ChatRequest(session_id="123")  # Missing required 'message'
