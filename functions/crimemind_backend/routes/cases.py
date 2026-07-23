from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from models.schemas import CaseFolderDetailResponse, NoteCreateRequest, NoteResponse, KnowledgeGraphResponse, RelatedCaseMatch
from repositories.fir_repository import FIRRepository
from repositories.case_repository import CaseRepository
from services.search_service import SearchService
import os

router = APIRouter(tags=["Case Folders"])

def get_api_key():
    return os.environ.get("GEMINI_API_KEY", "")

@router.get("/cases")
def list_cases():
    repo = CaseRepository()
    return repo.get_all_cases()

@router.get("/cases/{id}", response_model=CaseFolderDetailResponse)
def get_case_detail(id: int, api_key: str = Depends(get_api_key)):
    case_repo = CaseRepository()
    fir_repo = FIRRepository()
    search_service = SearchService(api_key=api_key)

    case = case_repo.get_case_by_id(id)
    if not case:
        raise HTTPException(status_code=404, detail="Case folder not found")

    # Get linked FIR IDs
    fir_ids = case_repo.get_firs_by_case_id(id)
    firs = [fir_repo.get_fir_by_id(fid) for fid in fir_ids if fir_repo.get_fir_by_id(fid)]

    # 1. Timeline & Evidence Timeline
    timeline = []
    evidence_timeline = []
    
    # Base case registration event
    timeline.append({
        "id": f"cf_{id}_reg",
        "date": case["created_time"].strftime("%Y-%m-%d") if hasattr(case["created_time"], 'strftime') else str(case["created_time"])[:10],
        "title": "Investigation Folder Created",
        "description": f"AI Command Center generated central folder: '{case['title']}'",
        "type": "Investigation"
    })

    # Add events from individual FIRs
    for fir in firs:
        fid = int(fir.get("rowid") or fir.get("ROWID") or 0)
        fir_date = fir["date_registered"].strftime("%Y-%m-%d") if hasattr(fir["date_registered"], 'strftime') else str(fir["date_registered"])[:10]
        
        timeline.append({
            "id": f"fir_{fid}_reg",
            "date": fir_date,
            "title": f"FIR Registered: {fir['fir_number']}",
            "description": f"Crime registered at {fir['police_station']} under {fir['crime_type']}. Details: {fir['description'][:100]}...",
            "type": "FIR"
        })

        # Suspects arrests timeline
        accused = fir_repo.get_accused_by_fir_id(fid)
        for acc in accused:
            if acc["status"] == "Arrested":
                timeline.append({
                    "id": f"acc_{acc['rowid']}_arr",
                    "date": fir_date, # approximate
                    "title": f"Suspect Arrested: {acc['name']}",
                    "description": f"Arrest completed for {acc['name']} ({acc['age']} years). Status: In Custody.",
                    "type": "Arrest"
                })

        # Evidences
        evidences = fir_repo.get_evidence_by_fir_id(fid)
        for ev in evidences:
            ev_date = ev["date_found"].strftime("%Y-%m-%d") if hasattr(ev["date_found"], 'strftime') else str(ev["date_found"])[:10]
            
            # Put in evidence timeline
            evidence_timeline.append({
                "id": f"ev_{ev['rowid']}_found",
                "date": ev_date,
                "title": f"Evidence Found: {ev['name']}",
                "description": f"Type: {ev['type']}. Description: {ev['description']}",
                "type": "Evidence"
            })

    # Sort timelines by date
    timeline.sort(key=lambda x: x["date"])
    evidence_timeline.sort(key=lambda x: x["date"])

    # 2. Gather entities
    victims = []
    accused = []
    witnesses = []
    evidence = []

    for fid in fir_ids:
        victims.extend(fir_repo.get_victims_by_fir_id(fid))
        accused.extend(fir_repo.get_accused_by_fir_id(fid))
        witnesses.extend(fir_repo.get_witnesses_by_fir_id(fid))
        evidence.extend(fir_repo.get_evidence_by_fir_id(fid))

    # De-duplicate lists
    victims = list({v.get("rowid") or v.get("ROWID"): v for v in victims}.values())
    accused = list({a.get("rowid") or a.get("ROWID"): a for a in accused}.values())
    witnesses = list({w.get("rowid") or w.get("ROWID"): w for w in witnesses}.values())
    evidence = list({e.get("rowid") or e.get("ROWID"): e for e in evidence}.values())

    # 3. Similar cases RAG lookup
    related_cases = []
    if firs:
        primary_fir = firs[0]
        similar_matches = search_service.find_similar_cases(primary_fir, fir_repo, limit=2)
        for sim in similar_matches:
            related_cases.append(RelatedCaseMatch(
                fir_id=sim["fir_id"],
                fir_number=sim["fir_number"],
                title=sim["title"],
                similarity=sim["similarity"],
                matching_mo=sim["matching_mo"]
            ))

    # 4. Resolve Knowledge Graph Response
    graph = get_graph_for_case(id)

    # 5. Notes & Tasks
    notes_list = case_repo.get_notes_by_case_id(id)
    tasks_list = case_repo.get_tasks_by_case_id(id)

    # Build final model
    return CaseFolderDetailResponse(
        rowid=int(case.get("rowid") or case.get("ROWID") or 0),
        title=case["title"],
        summary=case["summary"],
        status=case["status"],
        risk_score=case["risk_score"],
        created_time=case["created_time"].strftime("%Y-%m-%d %H:%M:%S") if hasattr(case["created_time"], 'strftime') else str(case["created_time"]),
        timeline=timeline,
        evidence_timeline=evidence_timeline,
        victims=victims,
        accused=accused,
        witnesses=witnesses,
        evidence=evidence,
        related_cases=related_cases,
        graph=graph,
        notes=notes_list,
        tasks=tasks_list,
        court_status=case.get("court_status", "Pending Investigation"),
        evidence_confidence=case.get("evidence_confidence", 0.85)
    )

@router.post("/cases/{id}/notes", response_model=NoteResponse)
def add_case_note(id: int, req: NoteCreateRequest):
    case_repo = CaseRepository()
    # Defaulting user to investigator (rowid=1)
    new_note = case_repo.add_note_to_case(case_id=id, user_id=1, note_content=req.note_content)
    return NoteResponse(**new_note)

@router.post("/cases/{id}/tasks/{task_id}/toggle")
def toggle_case_task(id: int, task_id: int):
    case_repo = CaseRepository()
    updated = case_repo.toggle_task_completion(task_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

# Interactive Knowledge Graph resolver for Cytoscape.js
@router.get("/graph/{case_folder_id}", response_model=KnowledgeGraphResponse)
def get_graph_for_case(case_folder_id: int):
    case_repo = CaseRepository()
    fir_repo = FIRRepository()

    fir_ids = case_repo.get_firs_by_case_id(case_folder_id)
    
    nodes = []
    edges = []
    added_nodes = set()

    # Case Folder Node
    nodes.append({
        "data": {
            "id": f"cf_{case_folder_id}",
            "label": "Case File Hub",
            "type": "Folder",
            "details": {"title": "Main Case Folder", "risk": "High"}
        }
    })

    for fid in fir_ids:
        fir = fir_repo.get_fir_by_id(fid)
        if not fir:
            continue
        
        fir_lbl = fir["fir_number"]
        fir_node_id = f"fir_{fid}"

        # Add FIR Node
        if fir_node_id not in added_nodes:
            nodes.append({
                "data": {
                    "id": fir_node_id, 
                    "label": fir_lbl, 
                    "type": "FIR",
                    "details": {
                        "crime_type": fir["crime_type"],
                        "district": fir["district"],
                        "status": fir["status"],
                        "modus_operandi": fir["modus_operandi"]
                    }
                }
            })
            added_nodes.add(fir_node_id)
        
        # Link FIR to Case Folder
        edges.append({"data": {"id": f"e_cf_fir_{fid}", "source": f"cf_{case_folder_id}", "target": fir_node_id, "label": "Groups"}})

        # Add Suspects
        accused = fir_repo.get_accused_by_fir_id(fid)
        for acc in accused:
            acc_name = acc["name"]
            acc_node_id = f"acc_{acc_name.replace(' ', '_').lower()}"
            
            if acc_node_id not in added_nodes:
                nodes.append({
                    "data": {
                        "id": acc_node_id,
                        "label": acc_name,
                        "type": "Accused",
                        "details": {
                            "age": acc["age"],
                            "status": acc["status"],
                            "repeater": acc["history_repeater"],
                            "phone": acc["phone_number"],
                            "bank": acc["bank_account"],
                            "vehicle": acc["vehicle_plate"]
                        }
                    }
                })
                added_nodes.add(acc_node_id)
            
            # Link Accused to FIR
            edges.append({"data": {"id": f"e_acc_fir_{fid}_{acc_name}", "source": acc_node_id, "target": fir_node_id, "label": "Appeared In"}})

            # Add Phone Nodes
            if acc.get("phone_number"):
                ph = acc["phone_number"]
                ph_node_id = f"ph_{ph.replace(' ', '').replace('+', '')}"
                if ph_node_id not in added_nodes:
                    nodes.append({
                        "data": {
                            "id": ph_node_id,
                            "label": ph,
                            "type": "Phone",
                            "details": {"owner": acc_name, "carrier": "BMS / Jio"}
                        }
                    })
                    added_nodes.add(ph_node_id)
                edges.append({"data": {"id": f"e_acc_ph_{acc_name}", "source": acc_node_id, "target": ph_node_id, "label": "Uses"}})

            # Add Bank Nodes
            if acc.get("bank_account"):
                ba = acc["bank_account"]
                ba_node_id = f"ba_{ba.replace('-', '').lower()}"
                if ba_node_id not in added_nodes:
                    nodes.append({
                        "data": {
                            "id": ba_node_id,
                            "label": ba,
                            "type": "BankAccount",
                            "details": {"owner": acc_name, "bank": "SBI / HDFC"}
                        }
                    })
                    added_nodes.add(ba_node_id)
                edges.append({"data": {"id": f"e_acc_ba_{acc_name}", "source": acc_node_id, "target": ba_node_id, "label": "Financial Link"}})

            # Add Vehicle Nodes
            if acc.get("vehicle_plate"):
                vpl = acc["vehicle_plate"]
                v_node_id = f"v_{vpl.replace('-', '').lower()}"
                if v_node_id not in added_nodes:
                    nodes.append({
                        "data": {
                            "id": v_node_id,
                            "label": vpl,
                            "type": "Vehicle",
                            "details": {"owner": acc_name, "type": "Bajaj Pulsar"}
                        }
                    })
                    added_nodes.add(v_node_id)
                edges.append({"data": {"id": f"e_acc_v_{acc_name}", "source": acc_node_id, "target": v_node_id, "label": "Owns"}})

        # Add Victims
        victims = fir_repo.get_victims_by_fir_id(fid)
        for vic in victims:
            vic_name = vic["name"]
            vic_node_id = f"vic_{vic_name.replace(' ', '_').lower()}"
            if vic_node_id not in added_nodes:
                nodes.append({
                    "data": {
                        "id": vic_node_id,
                        "label": vic_name,
                        "type": "Victim",
                        "details": {"age": vic["age"], "statement": vic["statement"]}
                    }
                })
                added_nodes.add(vic_node_id)
            edges.append({"data": {"id": f"e_vic_fir_{fid}", "source": vic_node_id, "target": fir_node_id, "label": "Defrauded In"}})

    return KnowledgeGraphResponse(nodes=nodes, edges=edges)
