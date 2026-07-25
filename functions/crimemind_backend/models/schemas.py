from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str
    role: str # Administrator, Supervisor, Investigator, Crime Analyst

class UserProfile(BaseModel):
    rowid: int
    email: str
    username: str
    role: str # Administrator, Supervisor, Investigator, Analyst
    police_id: str
    created_time: datetime

# Collaboration & Workspace Schemas
class WorkspaceMessageCreate(BaseModel):
    message_text: str
    shared_chat_id: Optional[str] = None

class WorkspaceMessageResponse(BaseModel):
    rowid: int
    case_folder_id: int
    sender_id: int
    sender_name: str
    sender_role: str
    message_text: str
    has_attachment: bool
    shared_chat_id: Optional[str] = None
    created_time: datetime

class WorkspaceAttachmentResponse(BaseModel):
    rowid: int
    message_id: int
    file_name: str
    file_type: str
    file_store_id: str
    created_time: datetime

class WorkspaceTaskCreate(BaseModel):
    task_title: str
    description: str
    assigned_officer_id: Optional[int] = None
    priority: str # High, Medium, Low
    due_date: str # ISO string

class WorkspaceTaskResponse(BaseModel):
    rowid: int
    case_folder_id: int
    task_title: str
    description: str
    assigned_officer_id: Optional[int] = None
    assigned_officer_name: Optional[str] = None
    priority: str
    status: str # Pending, In Progress, Completed
    due_date: datetime
    created_time: datetime

class TeamMemberResponse(BaseModel):
    user_id: int
    name: str
    role: str
    police_id: str
    status: str # Online, Offline

class NotificationResponse(BaseModel):
    rowid: int
    recipient_id: int
    sender_id: Optional[int] = None
    sender_name: Optional[str] = None
    case_folder_id: Optional[int] = None
    case_title: Optional[str] = None
    message: str
    type: str
    is_read: bool
    created_time: datetime

# Chat & Copilot Schemas
class ChatQueryRequest(BaseModel):
    session_id: Optional[str] = None
    query: str
    language: str = "en" # "en" or "kn"
    voice_input: bool = False

class EvidenceUsed(BaseModel):
    fir_id: int
    fir_number: str
    description: str
    type: str

class RelatedCaseMatch(BaseModel):
    fir_id: int
    fir_number: str
    title: str
    similarity: float
    matching_mo: str

class ChatQueryResponse(BaseModel):
    session_id: str
    response: str
    evidence_used: List[EvidenceUsed]
    confidence: float
    reasoning_path: List[str]
    recommendations: List[str] # AI-generated suggestions
    related_cases: List[RelatedCaseMatch]

# Case Folder & Timeline Schemas
class TimelineEvent(BaseModel):
    id: str
    date: str
    title: str
    description: str
    type: str # FIR, Arrest, Evidence, Investigation, Court

class NodeData(BaseModel):
    id: str
    label: str
    type: str # Accused, Victim, Witness, Vehicle, Phone, BankAccount, Location, FIR
    details: Optional[Dict[str, Any]] = None

class EdgeData(BaseModel):
    id: str
    source: str
    target: str
    label: str # Owns, Visited, Connected, Related, Appeared In, Witnessed, Defrauded

class CytoscapeElement(BaseModel):
    data: Dict[str, Any]

class KnowledgeGraphResponse(BaseModel):
    nodes: List[CytoscapeElement]
    edges: List[CytoscapeElement]

class CaseFolderDetailResponse(BaseModel):
    rowid: int
    title: str
    summary: str
    status: str
    risk_score: int
    created_time: str
    timeline: List[TimelineEvent]
    evidence_timeline: List[TimelineEvent]
    victims: List[Dict[str, Any]]
    accused: List[Dict[str, Any]]
    witnesses: List[Dict[str, Any]]
    evidence: List[Dict[str, Any]]
    related_cases: List[RelatedCaseMatch]
    graph: KnowledgeGraphResponse
    notes: List[Dict[str, Any]]
    tasks: List[Dict[str, Any]]
    court_status: str
    evidence_confidence: float

# Analytics Schemas
class AnalyticsSummaryResponse(BaseModel):
    total_firs: int
    pending_firs: int
    solved_firs: int
    repeat_offenders_count: int
    district_distribution: Dict[str, int]
    crime_type_distribution: Dict[str, int]
    monthly_trends: List[Dict[str, Any]]
    hotspots: List[Dict[str, Any]]

# Note Schemas
class NoteCreateRequest(BaseModel):
    note_content: str

class NoteResponse(BaseModel):
    rowid: int
    case_folder_id: int
    user_id: int
    username: str
    note_content: str
    created_time: str

# Intelligence Center Schemas
class IntelligenceCenterResponse(BaseModel):
    today_alerts: List[Dict[str, Any]]
    emerging_patterns: List[Dict[str, Any]]
    repeat_offenders: List[Dict[str, Any]]
    high_risk_districts: List[Dict[str, Any]]
    organized_crime_alerts: List[Dict[str, Any]]
    recommendations: List[str]
    recent_updates: List[Dict[str, Any]]
