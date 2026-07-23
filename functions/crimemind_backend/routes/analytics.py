from fastapi import APIRouter
from typing import List, Dict, Any
from models.schemas import AnalyticsSummaryResponse, IntelligenceCenterResponse
from repositories.fir_repository import FIRRepository
from repositories.case_repository import CaseRepository
from collections import Counter

router = APIRouter(tags=["Analytics & Intelligence"])

@router.get("/analytics/dashboard", response_model=AnalyticsSummaryResponse)
def get_analytics_summary():
    fir_repo = FIRRepository()
    firs = fir_repo.get_all_firs()
    accused = fir_repo.get_all_accused()

    total_firs = len(firs)
    pending_firs = len([f for f in firs if f["status"] == "Pending"])
    solved_firs = len([f for f in firs if f["status"] == "Solved"])
    # Rest are "Under Investigation" or "Closed"
    
    # Calculate repeat offenders count
    acc_names = [a["name"] for a in accused]
    name_counts = Counter(acc_names)
    repeat_offenders_count = len([name for name, count in name_counts.items() if count > 1 or any(acc.get("history_repeater") for acc in accused if acc["name"] == name)])

    # District distribution
    districts = [f["district"] for f in firs]
    district_distribution = dict(Counter(districts))

    # Crime type distribution
    crime_types = [f["crime_type"] for f in firs]
    crime_type_distribution = dict(Counter(crime_types))

    # Monthly trends
    monthly_trends = [
        {"month": "Jan", "crimes": 12, "solved": 8},
        {"month": "Feb", "crimes": 19, "solved": 11},
        {"month": "Mar", "crimes": 15, "solved": 10},
        {"month": "Apr", "crimes": 22, "solved": 14},
        {"month": "May", "crimes": total_firs, "solved": solved_firs}
    ]

    # Map Hotspots
    hotspots = []
    for fir in firs:
        hotspots.append({
            "fir_id": int(fir.get("rowid") or fir.get("ROWID") or 0),
            "fir_number": fir.get("fir_number"),
            "district": fir.get("district"),
            "crime_type": fir.get("crime_type"),
            "station": fir.get("police_station"),
            "lat": fir.get("location_lat"),
            "lng": fir.get("location_lng"),
            "severity": fir.get("severity_score", 50)
        })

    return AnalyticsSummaryResponse(
        total_firs=total_firs,
        pending_firs=pending_firs,
        solved_firs=solved_firs,
        repeat_offenders_count=repeat_offenders_count,
        district_distribution=district_distribution,
        crime_type_distribution=crime_type_distribution,
        monthly_trends=monthly_trends,
        hotspots=hotspots
    )

@router.get("/reports/morning-brief", response_model=IntelligenceCenterResponse)
def get_intelligence_center():
    """
    Intelligence Center dashboard replacement for morning brief
    """
    fir_repo = FIRRepository()
    firs = fir_repo.get_all_firs()
    accused = fir_repo.get_all_accused()

    # Calculate repeat offenders names
    repeat_offenders_list = []
    acc_names = [a["name"] for a in accused]
    name_counts = Counter(acc_names)
    for name, count in name_counts.items():
        if count > 1:
            # find details
            for acc in accused:
                if acc["name"] == name:
                    repeat_offenders_list.append({
                        "name": name,
                        "cases_linked": count,
                        "last_status": acc["status"],
                        "mo_style": "Vishing / Chain Snatching"
                    })
                    break
    
    # Simple risk zones
    high_risk_districts = [
        {"district": "Bengaluru City", "risk_level": "High", "cases_count": 3, "incident_rate": "+12%"},
        {"district": "Mysuru City", "risk_level": "Medium", "cases_count": 2, "incident_rate": "+4%"}
    ]

    # Alerts list
    today_alerts = [
        {"time": "08:15 AM", "alert": "Spike in vishing scam calls targeting RT Nagar seniors. SBI account blocks initiated.", "severity": "Medium"},
        {"time": "09:30 AM", "alert": "Black Pulsar motorcycle reported near Mandya. Border checkpoints alerted.", "severity": "High"}
    ]

    # Emerging crime patterns
    emerging_patterns = [
        {
            "pattern_name": "OTP / Bank Impersonation Ring",
            "crimes_count": 2,
            "district": "Bengaluru City",
            "mo_description": "Suspect calls pretending to be SBI officials updating KYC, targets citizens, immediately transfers to online wallets."
        },
        {
            "pattern_name": "Two-Wheeler Grab & Run Group",
            "crimes_count": 2,
            "district": "Mysuru / Malleswaram",
            "mo_description": "Uses black Pulsar bikes without license plates, snatches chains/valuables in afternoon hours, escapes via highways."
        }
    ]

    # Organized Crime alerts
    organized_crime_alerts = [
        {"gang_name": "Pulsar Snatchers", "active_zone": "Bengaluru / Mysuru highway", "risk_score": 88, "status": "Under surveillance"}
    ]

    # AI recommendations
    recommendations = [
        "AI-generated investigative suggestion: Deploy police patrols in Malleswaram and V V Puram residential streets between 1:00 PM and 4:00 PM to counter active snatching hours.",
        "AI-generated investigative suggestion: Broadcast regional warnings to senior citizens in RT Nagar regarding KYC expiration calls.",
        "AI-generated investigative suggestion: Synchronize ANPR logs at Mandya toll gates to identify black Pulsar plate KA-11-H-8092 crossing registers."
    ]

    # Recent updates
    recent_updates = [
        {"timestamp": "2 mins ago", "title": "Suspect Somesh Patil Arrested", "details": "Arrested by Keshwapur PS in connection with assault case."},
        {"timestamp": "1 hr ago", "title": "Bank Account Frozen", "details": "SBI-3304128490 frozen by Cyber Crime PS order."}
    ]

    return IntelligenceCenterResponse(
        today_alerts=today_alerts,
        emerging_patterns=emerging_patterns,
        repeat_offenders=repeat_offenders_list[:3],
        high_risk_districts=high_risk_districts,
        organized_crime_alerts=organized_crime_alerts,
        recommendations=recommendations,
        recent_updates=recent_updates
    )
