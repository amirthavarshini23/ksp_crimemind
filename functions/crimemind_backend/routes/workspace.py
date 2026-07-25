from fastapi import APIRouter, HTTPException, Depends, Header, UploadFile, File, Form
from typing import List, Dict, Any, Optional
from models.schemas import (
    WorkspaceMessageResponse, WorkspaceMessageCreate, 
    WorkspaceTaskResponse, WorkspaceTaskCreate,
    TeamMemberResponse, NotificationResponse
)
from repositories.workspace_repository import WorkspaceRepository
from datetime import datetime
import os

router = APIRouter(tags=["Workspace Collaboration"])

def get_current_user_id(x_user_id: Optional[str] = Header(None)) -> int:
    # Default to 1 (Inspector Rajkumar) if header is missing
    if not x_user_id:
        return 1
    try:
        return int(x_user_id)
    except ValueError:
        return 1

@router.get("/workspace/{case_id}/messages", response_model=List[WorkspaceMessageResponse])
def get_workspace_messages(case_id: int):
    repo = WorkspaceRepository()
    messages = repo.get_messages(case_id)
    # Ensure correct datetime formats are mapped
    res = []
    for m in messages:
        res.append(WorkspaceMessageResponse(
            rowid=m["rowid"],
            case_folder_id=m["case_folder_id"],
            sender_id=m["sender_id"],
            sender_name=m["sender_name"],
            sender_role=m["sender_role"],
            message_text=m["message_text"],
            has_attachment=m["has_attachment"],
            shared_chat_id=m["shared_chat_id"],
            created_time=m["created_time"]
        ))
    return res

@router.post("/workspace/{case_id}/messages", response_model=WorkspaceMessageResponse)
def post_workspace_message(case_id: int, req: WorkspaceMessageCreate, user_id: int = Depends(get_current_user_id)):
    repo = WorkspaceRepository()
    msg = repo.add_message(
        case_id=case_id,
        sender_id=user_id,
        message_text=req.message_text,
        shared_chat_id=req.shared_chat_id
    )
    return WorkspaceMessageResponse(
        rowid=msg["rowid"],
        case_folder_id=msg["case_folder_id"],
        sender_id=msg["sender_id"],
        sender_name=msg["sender_name"],
        sender_role=msg["sender_role"],
        message_text=msg["message_text"],
        has_attachment=msg["has_attachment"],
        shared_chat_id=msg["shared_chat_id"],
        created_time=msg["created_time"]
    )

@router.get("/workspace/{case_id}/tasks", response_model=List[WorkspaceTaskResponse])
def get_workspace_tasks(case_id: int):
    repo = WorkspaceRepository()
    tasks = repo.get_tasks(case_id)
    res = []
    for t in tasks:
        res.append(WorkspaceTaskResponse(
            rowid=t["rowid"],
            case_folder_id=t["case_folder_id"],
            task_title=t["task_title"],
            description=t["description"],
            assigned_officer_id=t["assigned_officer_id"],
            assigned_officer_name=t["assigned_officer_name"],
            priority=t["priority"],
            status=t["status"],
            due_date=t["due_date"],
            created_time=t["created_time"]
        ))
    return res

@router.post("/workspace/{case_id}/tasks", response_model=WorkspaceTaskResponse)
def create_workspace_task(case_id: int, req: WorkspaceTaskCreate, user_id: int = Depends(get_current_user_id)):
    repo = WorkspaceRepository()
    try:
        due_dt = datetime.fromisoformat(req.due_date.replace("Z", "+00:00"))
    except Exception:
        due_dt = datetime.now()
    
    t = repo.add_task(
        case_id=case_id,
        creator_id=user_id,
        task_title=req.task_title,
        description=req.description,
        assigned_officer_id=req.assigned_officer_id,
        priority=req.priority,
        due_date=due_dt
    )
    return WorkspaceTaskResponse(
        rowid=t["rowid"],
        case_folder_id=t["case_folder_id"],
        task_title=t["task_title"],
        description=t["description"],
        assigned_officer_id=t["assigned_officer_id"],
        assigned_officer_name=t["assigned_officer_name"],
        priority=t["priority"],
        status=t["status"],
        due_date=t["due_date"],
        created_time=t["created_time"]
    )

@router.put("/workspace/{case_id}/tasks/{task_id}", response_model=WorkspaceTaskResponse)
def update_task(case_id: int, task_id: int, req: Dict[str, Any], user_id: int = Depends(get_current_user_id)):
    repo = WorkspaceRepository()
    status = req.get("status", "Pending")
    priority = req.get("priority")
    t = repo.update_task_status(task_id=task_id, updater_id=user_id, status=status, priority=priority)
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return WorkspaceTaskResponse(
        rowid=t["rowid"],
        case_folder_id=t["case_folder_id"],
        task_title=t["task_title"],
        description=t["description"],
        assigned_officer_id=t["assigned_officer_id"],
        assigned_officer_name=t["assigned_officer_name"],
        priority=t["priority"],
        status=t["status"],
        due_date=t["due_date"],
        created_time=t["created_time"]
    )

@router.get("/workspace/{case_id}/members", response_model=List[TeamMemberResponse])
def get_workspace_team(case_id: int):
    repo = WorkspaceRepository()
    members = repo.get_team_members(case_id)
    return [TeamMemberResponse(**m) for m in members]

@router.post("/workspace/{case_id}/presence")
def update_presence(case_id: int, user_id: int = Depends(get_current_user_id)):
    repo = WorkspaceRepository()
    repo.record_presence(user_id, case_id)
    return {"status": "success"}

@router.get("/workspace/{case_id}/feed")
def get_activity_feed(case_id: int):
    repo = WorkspaceRepository()
    feed = repo.get_activity_feed(case_id)
    res = []
    for f in feed:
        res.append({
            "rowid": f["rowid"],
            "case_folder_id": f["case_folder_id"],
            "user_id": f["user_id"],
            "user_name": f["user_name"],
            "activity_type": f["activity_type"],
            "description": f["description"],
            "created_time": f["created_time"].strftime("%Y-%m-%d %H:%M:%S")
        })
    return res

@router.post("/workspace/{case_id}/upload")
async def upload_attachment(case_id: int, file: UploadFile = File(...), user_id: int = Depends(get_current_user_id)):
    # Emulates uploading to Catalyst File Store
    # We create a placeholder chat message showing the attachment.
    repo = WorkspaceRepository()
    
    sender_name = "Officer"
    for u in mock.MOCK_USERS:
        if u["rowid"] == user_id:
            sender_name = u["username"]
            break

    message_text = f"Uploaded attachment: {file.filename} ({file.content_type})"
    
    # Store message with attachment flag
    msg = repo.add_message(case_id=case_id, sender_id=user_id, message_text=message_text)
    
    # Log activity
    repo.add_activity_log(case_id, user_id, "EVIDENCE_UPLOAD", f"{sender_name} uploaded file attachment: '{file.filename}'")
    
    # Notify team members
    for u in mock.MOCK_USERS:
        if u["rowid"] != user_id:
            repo.create_notification(
                recipient_id=u["rowid"],
                sender_id=user_id,
                case_folder_id=case_id,
                message=f"{sender_name} uploaded file '{file.filename}' to Case Workspace",
                notif_type="ATTACHMENT_UPLOAD"
            )

    return {
        "status": "success",
        "file_name": file.filename,
        "file_type": file.content_type,
        "message_id": msg["rowid"]
    }

@router.get("/notifications", response_model=List[NotificationResponse])
def get_user_notifications(user_id: int = Depends(get_current_user_id)):
    repo = WorkspaceRepository()
    notifs = repo.get_notifications(user_id)
    return [NotificationResponse(**n) for n in notifs]

@router.post("/notifications/{notification_id}/read")
def read_notification(notification_id: int, user_id: int = Depends(get_current_user_id)):
    repo = WorkspaceRepository()
    success = repo.mark_notification_read(notification_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}
