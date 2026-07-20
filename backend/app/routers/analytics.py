"""
Analytics API — Dashboard statistics, patterns, compliance, and risk scores.

Aggregates data from multiple tables to power the analytics dashboard.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.models import Document, Asset, Incident, Compliance
from app.schemas.schemas import AnalyticsOverview, PatternResponse, ComplianceResponse

router = APIRouter()


@router.get("/overview", response_model=AnalyticsOverview)
async def get_overview(db: Session = Depends(get_db)):
    """
    Dashboard summary — single API call returns all key metrics.
    
    This powers the top stat cards on the dashboard:
    - Total documents, assets, incidents
    - Compliance rate
    - Average health score
    - Critical alerts count
    """
    total_documents = db.query(Document).count()
    documents_processed = db.query(Document).filter(Document.processed == True).count()
    total_assets = db.query(Asset).count()
    total_incidents = db.query(Incident).count()
    open_incidents = db.query(Incident).filter(Incident.status != "Closed").count()

    # Average health score across all assets
    avg_health = db.query(func.avg(Asset.health_score)).scalar() or 0.0

    # Compliance rate: compliant / total
    total_compliance = db.query(Compliance).count()
    compliant_count = db.query(Compliance).filter(Compliance.status == "Compliant").count()
    compliance_rate = (compliant_count / total_compliance * 100) if total_compliance > 0 else 0

    # Critical alerts: non-compliant + overdue + critical incidents
    critical_alerts = (
        db.query(Compliance)
        .filter(Compliance.status.in_(["Non-Compliant", "Overdue"]))
        .count()
    )
    critical_alerts += (
        db.query(Incident)
        .filter(Incident.severity == "Critical", Incident.status != "Closed")
        .count()
    )

    return AnalyticsOverview(
        total_documents=total_documents,
        total_assets=total_assets,
        total_incidents=total_incidents,
        open_incidents=open_incidents,
        compliance_rate=round(compliance_rate, 1),
        avg_health_score=round(avg_health, 1),
        documents_processed=documents_processed,
        critical_alerts=critical_alerts,
    )


@router.get("/patterns")
async def get_patterns(db: Session = Depends(get_db)):
    """
    Detect recurring failure patterns from incident history.
    
    Logic: Group incidents by asset, look for assets with 2+ incidents
    of the same category. These are "patterns" that indicate systemic issues.
    """
    # Get all incidents grouped by asset
    assets = db.query(Asset).all()
    patterns = []

    for asset in assets:
        incidents = (
            db.query(Incident)
            .filter(Incident.asset_id == asset.id)
            .all()
        )

        if len(incidents) >= 2:
            # Count by category
            categories = {}
            for inc in incidents:
                cat = inc.category or "Unknown"
                categories[cat] = categories.get(cat, 0) + 1

            for cat, count in categories.items():
                if count >= 2:
                    patterns.append(PatternResponse(
                        asset_id=asset.id,
                        asset_name=asset.name,
                        pattern_type="Recurring Failure",
                        description=f"{count} incidents of type '{cat}' detected for {asset.name}",
                        occurrence_count=count,
                        severity="High" if count >= 3 else "Medium",
                        recommendation=f"Investigate root cause of recurring {cat.lower()} for {asset.id}. Consider preventive maintenance schedule revision."
                    ))

    return {"patterns": patterns, "total": len(patterns)}


@router.get("/compliance")
async def get_compliance(db: Session = Depends(get_db)):
    """Get all compliance records with asset names."""
    records = db.query(Compliance).all()
    result = []
    for rec in records:
        asset = db.query(Asset).filter(Asset.id == rec.asset_id).first()
        data = ComplianceResponse.model_validate(rec)
        data.asset_name = asset.name if asset else "Unknown"
        result.append(data)

    # Summary stats
    total = len(result)
    compliant = sum(1 for r in result if r.status == "Compliant")
    non_compliant = sum(1 for r in result if r.status in ("Non-Compliant", "Overdue"))

    return {
        "records": result,
        "total": total,
        "compliant": compliant,
        "non_compliant": non_compliant,
        "compliance_rate": round(compliant / total * 100, 1) if total > 0 else 0,
    }


@router.get("/risk-scores")
async def get_risk_scores(db: Session = Depends(get_db)):
    """
    Calculate risk score per asset based on:
    - Number of incidents
    - Severity of incidents
    - Compliance status
    - Health score
    """
    assets = db.query(Asset).all()
    scores = []

    for asset in assets:
        incident_count = db.query(Incident).filter(Incident.asset_id == asset.id).count()
        critical_incidents = db.query(Incident).filter(
            Incident.asset_id == asset.id,
            Incident.severity.in_(["Critical", "High"])
        ).count()
        overdue_compliance = db.query(Compliance).filter(
            Compliance.asset_id == asset.id,
            Compliance.status.in_(["Non-Compliant", "Overdue"])
        ).count()

        # Risk formula: higher = more risky
        risk = (
            incident_count * 10 +
            critical_incidents * 20 +
            overdue_compliance * 25 +
            max(0, 100 - asset.health_score)
        )

        scores.append({
            "asset_id": asset.id,
            "asset_name": asset.name,
            "criticality": asset.criticality,
            "health_score": asset.health_score,
            "incident_count": incident_count,
            "overdue_compliance": overdue_compliance,
            "risk_score": min(100, risk),  # Cap at 100
            "risk_level": "Critical" if risk >= 80 else "High" if risk >= 50 else "Medium" if risk >= 25 else "Low"
        })

    # Sort by risk score descending
    scores.sort(key=lambda x: x["risk_score"], reverse=True)

    return {"risk_scores": scores, "total": len(scores)}


@router.get("/timeline")
async def get_timeline(db: Session = Depends(get_db)):
    """Get incident timeline data for visualization."""
    incidents = (
        db.query(Incident)
        .order_by(Incident.incident_date.asc())
        .all()
    )

    timeline = []
    for inc in incidents:
        asset = db.query(Asset).filter(Asset.id == inc.asset_id).first()
        timeline.append({
            "id": inc.id,
            "date": inc.incident_date.isoformat() if inc.incident_date else None,
            "asset_id": inc.asset_id,
            "asset_name": asset.name if asset else "Unknown",
            "title": inc.title,
            "severity": inc.severity,
            "category": inc.category,
            "status": inc.status,
            "downtime_hours": inc.downtime_hours,
        })

    return {"timeline": timeline, "total": len(timeline)}
