"""
Seed Data — Pre-populates the database with industrial assets.

These 8 equipment items are used consistently across all synthetic
documents, incidents, and compliance records. This ensures our demo
data tells a coherent story.
"""

from datetime import date
from app.database import SessionLocal
from app.models.models import Asset, Compliance, Incident


def seed_assets():
    """Insert default assets if the table is empty."""
    db = SessionLocal()
    try:
        # Only seed if no assets exist
        if db.query(Asset).count() > 0:
            return

        assets = [
            Asset(
                id="P-101",
                name="Centrifugal Pump P-101",
                type="Centrifugal Pump",
                location="Unit A",
                criticality="High",
                health_score=62.0,
                last_maintenance=date(2026, 5, 15),
                next_scheduled=date(2026, 7, 15),
                status="Operational",
                install_date=date(2020, 3, 10),
                manufacturer="Sulzer Pumps"
            ),
            Asset(
                id="P-102",
                name="Centrifugal Pump P-102",
                type="Centrifugal Pump",
                location="Unit A",
                criticality="Medium",
                health_score=88.0,
                last_maintenance=date(2026, 6, 1),
                next_scheduled=date(2026, 9, 1),
                status="Operational",
                install_date=date(2021, 6, 20),
                manufacturer="Sulzer Pumps"
            ),
            Asset(
                id="C-401",
                name="Air Compressor C-401",
                type="Air Compressor",
                location="Utility Block",
                criticality="High",
                health_score=71.0,
                last_maintenance=date(2026, 4, 20),
                next_scheduled=date(2026, 7, 20),
                status="Operational",
                install_date=date(2019, 1, 15),
                manufacturer="Atlas Copco"
            ),
            Asset(
                id="V-201",
                name="Pressure Vessel V-201",
                type="Pressure Vessel",
                location="Unit B",
                criticality="Critical",
                health_score=55.0,
                last_maintenance=date(2026, 3, 10),
                next_scheduled=date(2026, 6, 30),
                status="Under Maintenance",
                install_date=date(2018, 8, 5),
                manufacturer="Bharat Heavy Electricals"
            ),
            Asset(
                id="HX-301",
                name="Heat Exchanger HX-301",
                type="Heat Exchanger",
                location="Unit C",
                criticality="Medium",
                health_score=79.0,
                last_maintenance=date(2026, 5, 25),
                next_scheduled=date(2026, 8, 25),
                status="Operational",
                install_date=date(2021, 2, 14),
                manufacturer="Alfa Laval"
            ),
            Asset(
                id="T-501",
                name="Storage Tank T-501",
                type="Storage Tank",
                location="Tank Farm",
                criticality="Low",
                health_score=92.0,
                last_maintenance=date(2026, 6, 10),
                next_scheduled=date(2026, 12, 10),
                status="Operational",
                install_date=date(2022, 4, 30),
                manufacturer="Tata Projects"
            ),
            Asset(
                id="MOV-101",
                name="Motor Operated Valve MOV-101",
                type="Motor Operated Valve",
                location="Unit A",
                criticality="High",
                health_score=75.0,
                last_maintenance=date(2026, 5, 5),
                next_scheduled=date(2026, 8, 5),
                status="Operational",
                install_date=date(2020, 11, 22),
                manufacturer="Emerson"
            ),
            Asset(
                id="GT-001",
                name="Gas Turbine GT-001",
                type="Gas Turbine",
                location="Power Block",
                criticality="Critical",
                health_score=68.0,
                last_maintenance=date(2026, 4, 1),
                next_scheduled=date(2026, 7, 1),
                status="Operational",
                install_date=date(2017, 7, 18),
                manufacturer="Siemens Energy"
            ),
        ]

        db.add_all(assets)
        db.commit()
        print(f"[OK] Seeded {len(assets)} assets")

        # Seed some compliance records
        _seed_compliance(db)

        # Seed some incidents
        _seed_incidents(db)

    finally:
        db.close()


def _seed_compliance(db):
    """Seed compliance records for assets."""
    records = [
        Compliance(
            asset_id="P-101",
            requirement="Monthly vibration analysis",
            sop_reference="SOP-2024-017",
            status="Overdue",
            last_checked=date(2026, 4, 15),
            next_due=date(2026, 5, 15),
            risk_level="High"
        ),
        Compliance(
            asset_id="P-101",
            requirement="Quarterly seal inspection",
            sop_reference="SOP-2024-012",
            status="Due Soon",
            last_checked=date(2026, 4, 1),
            next_due=date(2026, 7, 1),
            risk_level="Medium"
        ),
        Compliance(
            asset_id="C-401",
            requirement="Monthly bearing temperature check",
            sop_reference="SOP-2024-022",
            status="Compliant",
            last_checked=date(2026, 6, 20),
            next_due=date(2026, 7, 20),
            risk_level="Low"
        ),
        Compliance(
            asset_id="V-201",
            requirement="Annual pressure test (ASME)",
            sop_reference="SOP-2024-005",
            status="Non-Compliant",
            last_checked=date(2025, 12, 10),
            next_due=date(2026, 6, 10),
            risk_level="Critical",
            notes="Overdue by 19 days — regulatory violation risk"
        ),
        Compliance(
            asset_id="V-201",
            requirement="Bi-annual corrosion mapping",
            sop_reference="SOP-2024-008",
            status="Overdue",
            last_checked=date(2025, 11, 1),
            next_due=date(2026, 5, 1),
            risk_level="High"
        ),
        Compliance(
            asset_id="GT-001",
            requirement="500-hour turbine blade inspection",
            sop_reference="SOP-2024-031",
            status="Due Soon",
            last_checked=date(2026, 5, 1),
            next_due=date(2026, 7, 5),
            risk_level="High"
        ),
        Compliance(
            asset_id="HX-301",
            requirement="Quarterly tube fouling check",
            sop_reference="SOP-2024-019",
            status="Compliant",
            last_checked=date(2026, 6, 1),
            next_due=date(2026, 9, 1),
            risk_level="Low"
        ),
        Compliance(
            asset_id="MOV-101",
            requirement="Monthly actuator stroke test",
            sop_reference="SOP-2024-025",
            status="Overdue",
            last_checked=date(2026, 4, 5),
            next_due=date(2026, 5, 5),
            risk_level="High"
        ),
    ]

    db.add_all(records)
    db.commit()
    print(f"[OK] Seeded {len(records)} compliance records")


def _seed_incidents(db):
    """Seed incident history to make the dashboard interesting."""
    incidents = [
        Incident(
            asset_id="P-101",
            incident_date=date(2026, 1, 15),
            severity="High",
            category="Equipment Failure",
            title="Mechanical Seal Failure — P-101",
            description="Mechanical seal on Pump P-101 failed during operation, causing process fluid leakage. Pump shut down immediately.",
            root_cause="Seal wear due to misalignment and contaminated flush fluid. Supplier batch quality suspected.",
            corrective_action="Replaced mechanical seal (SKF-6205). Realigned pump shaft. Flushed seal lines.",
            status="Closed",
            downtime_hours=18
        ),
        Incident(
            asset_id="P-101",
            incident_date=date(2026, 3, 22),
            severity="High",
            category="Equipment Failure",
            title="Recurring Seal Failure — P-101",
            description="Second mechanical seal failure in 3 months. Significant process fluid leakage detected by operator during routine rounds.",
            root_cause="Same seal type failure — root cause traced to supplier quality issue with batch #SL-2025-447.",
            corrective_action="Replaced seal. Escalated to procurement for supplier investigation. Requested alternative seal vendor evaluation.",
            status="Closed",
            downtime_hours=24
        ),
        Incident(
            asset_id="P-101",
            incident_date=date(2026, 5, 8),
            severity="Medium",
            category="Equipment Failure",
            title="Third Seal Failure — P-101 (Pattern Confirmed)",
            description="Third mechanical seal failure in 5 months. Pattern now confirmed — this is a recurring failure.",
            root_cause="Confirmed: Supplier batch quality issue. All seals from batch #SL-2025-447 are defective.",
            corrective_action="Replaced with seal from alternate vendor (Eagle Burgmann). Issued supplier non-conformance report.",
            status="Closed",
            downtime_hours=12
        ),
        Incident(
            asset_id="C-401",
            incident_date=date(2026, 2, 10),
            severity="Medium",
            category="Equipment Failure",
            title="Bearing Overheating — C-401",
            description="Bearing temperature on Compressor C-401 exceeded alarm threshold (95°C). Compressor tripped on high temperature.",
            root_cause="Insufficient lubrication due to blocked oil filter. Ambient temperature spike contributed.",
            corrective_action="Replaced oil filter. Topped up lubricant. Installed temperature trend monitoring.",
            status="Closed",
            downtime_hours=8
        ),
        Incident(
            asset_id="C-401",
            incident_date=date(2026, 5, 28),
            severity="High",
            category="Equipment Failure",
            title="Bearing Failure — C-401",
            description="Drive-end bearing on C-401 failed catastrophically. Loud noise and vibration detected before auto-shutdown.",
            root_cause="Bearing fatigue accelerated by previous overheating event. Temperature correlation confirmed.",
            corrective_action="Replaced both bearings. Upgraded to ceramic hybrid bearings. Enhanced vibration monitoring schedule.",
            status="Closed",
            downtime_hours=36
        ),
        Incident(
            asset_id="V-201",
            incident_date=date(2026, 4, 5),
            severity="Critical",
            category="Safety",
            title="Corrosion-Induced Wall Thinning — V-201",
            description="Ultrasonic thickness measurement revealed wall thinning below minimum design thickness in two locations on Pressure Vessel V-201.",
            root_cause="Accelerated internal corrosion due to chemical exposure (H2S traces in feed stream). Corrosion inhibitor dosing was insufficient.",
            corrective_action="Vessel taken offline for weld overlay repair. Increased corrosion inhibitor dosing. Scheduled monthly UT inspections.",
            status="In Progress",
            downtime_hours=120
        ),
        Incident(
            asset_id="HX-301",
            incident_date=date(2026, 3, 15),
            severity="Low",
            category="Process",
            title="Reduced Heat Transfer Efficiency — HX-301",
            description="Heat exchanger HX-301 showing 15% reduction in heat transfer coefficient. Outlet temperature deviating from design.",
            root_cause="Seasonal fouling buildup on tube side. Expected during monsoon season due to cooling water quality.",
            corrective_action="Chemical cleaning scheduled. Anti-fouling treatment applied.",
            status="Closed",
            downtime_hours=6
        ),
        Incident(
            asset_id="GT-001",
            incident_date=date(2026, 6, 1),
            severity="High",
            category="Equipment Failure",
            title="Turbine Blade Erosion Detected — GT-001",
            description="Borescope inspection revealed erosion on 3 first-stage turbine blades. Performance degradation of 5% noted.",
            root_cause="Particulate ingestion from air intake filter degradation. Filter replacement was overdue.",
            corrective_action="Replaced degraded air intake filters. Blade refurbishment scheduled for next planned outage.",
            status="Open",
            downtime_hours=0
        ),
        Incident(
            asset_id="MOV-101",
            incident_date=date(2026, 5, 20),
            severity="Medium",
            category="Safety",
            title="Valve Actuator Stuck — MOV-101",
            description="Motor Operated Valve MOV-101 failed to close during emergency shutdown test. Actuator seized mid-stroke.",
            root_cause="Actuator gearbox lubrication degraded. Last actuator maintenance was overdue by 15 days.",
            corrective_action="Disassembled and re-lubricated gearbox. Replaced limit switches. Tested 5x successful cycles.",
            status="Closed",
            downtime_hours=4
        ),
    ]

    db.add_all(incidents)
    db.commit()
    print(f"[OK] Seeded {len(incidents)} incidents")
