// ============================================================
// CrimeMind AI — TypeScript Type Definitions
// ============================================================

export interface UserProfile {
  rowid: number;
  email: string;
  username: string;
  role: 'Administrator' | 'Supervisor' | 'Investigator' | 'Analyst' | 'Crime Analyst';
  police_id: string;
  created_time: string;
  rank?: string;
  designation?: string;
  unit_station?: string;
  district?: string;
  kgid?: string;
  phone_number?: string;
  clearance_level?: string;
  active_cases_count?: number;
}

export interface FIR {
  rowid: number;
  fir_number: string;
  district: string;
  police_station: string;
  date_registered: string;
  status: 'Pending' | 'Under Investigation' | 'Solved' | 'Closed';
  crime_type: string;
  description: string;
  modus_operandi: string;
  location_lat: number;
  location_lng: number;
  severity_score: number;
}

export interface Accused {
  rowid: number;
  fir_id: number;
  name: string;
  age: number;
  phone_number: string;
  address: string;
  status: 'Suspect' | 'Arrested' | 'Absconding' | 'Acquitted' | 'Convicted';
  bank_account: string;
  vehicle_plate: string;
  history_repeater: boolean;
}

export interface Victim {
  rowid: number;
  fir_id: number;
  name: string;
  age: number;
  phone_number: string;
  address: string;
  statement: string;
}

export interface Witness {
  rowid: number;
  fir_id: number;
  name: string;
  phone_number: string;
  address: string;
  statement: string;
}

export interface Evidence {
  rowid: number;
  fir_id: number;
  name: string;
  type: string;
  description: string;
  file_store_id: string | null;
  date_found: string;
}

export interface Vehicle {
  rowid: number;
  plate_number: string;
  model: string;
  color: string;
  owner_name: string;
  associated_fir_id: number;
}

export interface Phone {
  rowid: number;
  phone_number: string;
  imei: string;
  owner_name: string;
  associated_fir_id: number;
}

export interface BankAccount {
  rowid: number;
  account_number: string;
  bank_name: string;
  holder_name: string;
  associated_fir_id: number;
}

export interface CaseFolder {
  rowid: number;
  title: string;
  summary: string;
  status: 'Active' | 'Inactive' | 'Solved';
  risk_score: number;
  created_time: string;
}

export interface OfficerNote {
  rowid: number;
  case_folder_id: number;
  user_id: number;
  username: string;
  note_content: string;
  created_time: string;
}

export interface CaseTask {
  rowid: number;
  case_folder_id: number;
  task: string;
  completed: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'FIR' | 'Arrest' | 'Evidence' | 'Investigation' | 'Court';
}

export interface GraphNodeDetails {
  title?: string;
  risk?: string;
  crime_type?: string;
  district?: string;
  status?: string;
  modus_operandi?: string;
  age?: number;
  repeater?: boolean;
  phone?: string;
  bank?: string;
  vehicle?: string;
  owner?: string;
  carrier?: string;
  bank_name?: string;
  statement?: string;
}

export interface GraphNode {
  data: {
    id: string;
    label: string;
    type: 'Folder' | 'FIR' | 'Accused' | 'Phone' | 'BankAccount' | 'Vehicle' | 'Victim' | 'Location';
    details?: GraphNodeDetails;
  };
}

export interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    label: string;
  };
}

export interface KnowledgeGraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface EvidenceUsed {
  fir_id: number;
  fir_number: string;
  description: string;
  type: string;
}

export interface RelatedCaseMatch {
  fir_id: number;
  fir_number: string;
  title: string;
  similarity: number;
  matching_mo: string;
}

export interface CaseFolderDetailResponse {
  rowid: number;
  title: string;
  summary: string;
  status: 'Active' | 'Inactive' | 'Solved';
  risk_score: number;
  created_time: string;
  timeline: TimelineEvent[];
  evidence_timeline: TimelineEvent[];
  victims: Victim[];
  accused: Accused[];
  witnesses: Witness[];
  evidence: Evidence[];
  related_cases: RelatedCaseMatch[];
  graph: KnowledgeGraphResponse;
  notes: OfficerNote[];
  tasks: CaseTask[];
  court_status: string;
  evidence_confidence: number;
}

export interface AnalyticsSummaryResponse {
  total_firs: number;
  pending_firs: number;
  solved_firs: number;
  repeat_offenders_count: number;
  district_distribution: Record<string, number>;
  crime_type_distribution: Record<string, number>;
  monthly_trends: Array<{ month: string; crimes: number; solved: number }>;
  hotspots: Array<{
    fir_id: number;
    fir_number: string;
    district: string;
    crime_type: string;
    station: string;
    lat: number;
    lng: number;
    severity: number;
  }>;
}

export interface IntelligenceCenterResponse {
  today_alerts: Array<{ time: string; alert: string; severity: string }>;
  emerging_patterns: Array<{ pattern_name: string; crimes_count: number; district: string; mo_description: string }>;
  repeat_offenders: Array<{ name: string; cases_linked: number; last_status: string; mo_style: string }>;
  high_risk_districts: Array<{ district: string; risk_level: string; cases_count: number; incident_rate: string }>;
  organized_crime_alerts: Array<{ gang_name: string; active_zone: string; risk_score: number; status: string }>;
  recommendations: string[];
  recent_updates: Array<{ timestamp: string; title: string; details: string }>;
}

export interface ChatQueryResponse {
  session_id: string;
  response: string;
  evidence_used: EvidenceUsed[];
  confidence: number;
  reasoning_path: string[];
  recommendations: string[];
  related_cases: RelatedCaseMatch[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  evidenceUsed?: EvidenceUsed[];
  confidence?: number;
  reasoningPath?: string[];
  recommendations?: string[];
  relatedCases?: RelatedCaseMatch[];
}

export interface WorkspaceMessage {
  rowid: number;
  case_folder_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message_text: string;
  has_attachment: boolean;
  shared_chat_id?: string;
  created_time: string;
}

export interface WorkspaceTask {
  rowid: number;
  case_folder_id: number;
  task_title: string;
  description: string;
  assigned_officer_id?: number;
  assigned_officer_name?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
  created_time: string;
}

export interface TeamMember {
  user_id: number;
  name: string;
  role: string;
  police_id: string;
  status: 'Online' | 'Offline';
}

export interface WorkspaceNotification {
  rowid: number;
  recipient_id: number;
  sender_id?: number;
  sender_name?: string;
  case_folder_id?: number;
  case_title?: string;
  message: string;
  type: string;
  is_read: boolean;
  created_time: string;
}

