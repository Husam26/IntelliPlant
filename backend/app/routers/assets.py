"""
Assets API — Retrieve industrial equipment data.

Assets are pre-seeded in the database. This router provides
read access for the dashboard and asset detail pages.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Asset, Incident
from app.schemas.schemas import AssetResponse, AssetListResponse, IncidentResponse, AssetCreateRequest, AssetPositionUpdate

router = APIRouter()


@router.get("", response_model=AssetListResponse)
async def list_assets(
    criticality: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all assets with optional filters."""
    query = db.query(Asset)

    if criticality:
        query = query.filter(Asset.criticality == criticality)
    if location:
        query = query.filter(Asset.location == location)

    assets = query.all()

    # Enrich with incident count
    result = []
    for asset in assets:
        incident_count = db.query(Incident).filter(Incident.asset_id == asset.id).count()
        asset_data = AssetResponse.model_validate(asset)
        asset_data.incident_count = incident_count
        result.append(asset_data)

    return AssetListResponse(assets=result, total=len(result))


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: str, db: Session = Depends(get_db)):
    """Get a single asset with its details."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    incident_count = db.query(Incident).filter(Incident.asset_id == asset.id).count()
    asset_data = AssetResponse.model_validate(asset)
    asset_data.incident_count = incident_count
    return asset_data


@router.get("/{asset_id}/incidents")
async def get_asset_incidents(asset_id: str, db: Session = Depends(get_db)):
    """Get all incidents for a specific asset."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    incidents = (
        db.query(Incident)
        .filter(Incident.asset_id == asset_id)
        .order_by(Incident.incident_date.desc())
        .all()
    )

    return {
        "asset_id": asset_id,
        "asset_name": asset.name,
        "incidents": [IncidentResponse.model_validate(inc) for inc in incidents],
        "total": len(incidents),
    }


@router.post("", response_model=AssetResponse)
async def create_asset(data: AssetCreateRequest, db: Session = Depends(get_db)):
    """Create a new asset from the Digital Twin UI."""
    existing = db.query(Asset).filter(Asset.id == data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset '{data.id}' already exists")
    
    asset = Asset(
        id=data.id,
        name=data.name,
        type=data.type,
        location=data.location,
        criticality=data.criticality,
        health_score=data.health_score,
        x_pos=data.x_pos,
        y_pos=data.y_pos,
        connections=data.connections,
        status="Active",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    
    asset_data = AssetResponse.model_validate(asset)
    asset_data.incident_count = 0
    return asset_data


@router.put("/{asset_id}/position")
async def update_asset_position(asset_id: str, data: AssetPositionUpdate, db: Session = Depends(get_db)):
    """Update asset position on the Digital Twin map (called on drag-drop)."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    asset.x_pos = data.x_pos
    asset.y_pos = data.y_pos
    db.commit()
    return {"message": "Position updated", "asset_id": asset_id, "x_pos": data.x_pos, "y_pos": data.y_pos}


@router.put("/{asset_id}/connections")
async def update_asset_connections(asset_id: str, data: dict, db: Session = Depends(get_db)):
    """Update which assets this asset is connected to on the Digital Twin."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    asset.connections = data.get("connections", "")
    db.commit()
    return {"message": "Connections updated", "asset_id": asset_id, "connections": asset.connections}


@router.delete("/{asset_id}")
async def delete_asset(asset_id: str, db: Session = Depends(get_db)):
    """Delete an asset from the plant."""
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    db.delete(asset)
    db.commit()
    return {"message": f"Asset {asset_id} deleted"}

