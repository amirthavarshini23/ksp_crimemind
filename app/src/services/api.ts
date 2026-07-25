import { 
  CaseFolder, 
  CaseFolderDetailResponse, 
  ChatQueryResponse, 
  AnalyticsSummaryResponse, 
  IntelligenceCenterResponse,
  OfficerNote,
  WorkspaceMessage,
  WorkspaceTask,
  TeamMember,
  WorkspaceNotification
} from '../types.ts';
const getBackendUrl = () => {
  return localStorage.getItem('ksp_crimemind_backend_url') || import.meta.env.VITE_API_URL || 'http://localhost:8000';
};

const getHeaders = () => {

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const key = localStorage.getItem('ksp_gemini_api_key');
  if (key) {
    headers['X-Gemini-Key'] = key;
  }
  const savedUser = localStorage.getItem('ksp_crimemind_user');
  if (savedUser) {
    try {
      const u = JSON.parse(savedUser);
      headers['X-User-Id'] = String(u.rowid);
    } catch (e) {}
  }
  return headers;
};

export const api = {
  // Workspace Messages
  async getWorkspaceMessages(caseId: number): Promise<WorkspaceMessage[]> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/messages`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      // Offline fallback
      return [
        {
          rowid: 1,
          case_folder_id: caseId,
          sender_id: 1,
          sender_name: "Inspector Rajkumar",
          sender_role: "Investigator",
          message_text: "I have reviewed the CCTV footage from Devaraja Mohalla. The getaway motorcycle is definitely a black Pulsar 150. Let's dispatch a team to trace the registered owner.",
          has_attachment: false,
          created_time: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          rowid: 2,
          case_folder_id: caseId,
          sender_id: 3,
          sender_name: "Swati Deshpande",
          sender_role: "Crime Analyst",
          message_text: "Completed the tower dump analysis. Suspect Basavaraj's phone +91 9774012569 was active near the jewellery shop during the robbery timeframe.",
          has_attachment: false,
          created_time: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          rowid: 3,
          case_folder_id: caseId,
          sender_id: 2,
          sender_name: "ACP Patil",
          sender_role: "Supervisor",
          message_text: "@Inspector Rajkumar, please prioritize the coordinate search on the outer ring road toll gates. We need that Pulsar tracked down immediately.",
          has_attachment: false,
          created_time: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
    }
  },

  async postWorkspaceMessage(caseId: number, text: string, sharedChatId?: string): Promise<WorkspaceMessage> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message_text: text, shared_chat_id: sharedChatId })
      });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      const savedUser = localStorage.getItem('ksp_crimemind_user');
      const u = savedUser ? JSON.parse(savedUser) : { rowid: 1, username: "Inspector Rajkumar", role: "Investigator" };
      return {
        rowid: Math.floor(Math.random() * 1000) + 10,
        case_folder_id: caseId,
        sender_id: u.rowid,
        sender_name: u.username,
        sender_role: u.role,
        message_text: text,
        has_attachment: false,
        shared_chat_id: sharedChatId,
        created_time: new Date().toISOString()
      };
    }
  },

  // Workspace Tasks
  async getWorkspaceTasks(caseId: number): Promise<WorkspaceTask[]> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/tasks`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return [
        {
          rowid: 1,
          case_folder_id: caseId,
          task_title: "Trace Bajaj Pulsar KA-11-H-8092",
          description: "Crosscheck license plates with highway toll ANPR database to determine escape coordinates.",
          assigned_officer_id: 1,
          assigned_officer_name: "Inspector Rajkumar",
          priority: "High",
          status: "In Progress",
          due_date: new Date(Date.now() + 3600000 * 48).toISOString(),
          created_time: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          rowid: 2,
          case_folder_id: caseId,
          task_title: "Obtain search warrants for bannimantap house",
          description: "Draft petition for magistrate to search the bannimantap residence associated with Mohammad Rizwan.",
          assigned_officer_id: 2,
          assigned_officer_name: "ACP Patil",
          priority: "Medium",
          status: "Pending",
          due_date: new Date(Date.now() + 3600000 * 120).toISOString(),
          created_time: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          rowid: 3,
          case_folder_id: caseId,
          task_title: "Conduct forensic finger-printing",
          description: "Seize broken glass counters from jewellery shop and dispatch to FSL Bengaluru.",
          assigned_officer_id: 1,
          assigned_officer_name: "Inspector Rajkumar",
          priority: "Low",
          status: "Completed",
          due_date: new Date(Date.now() - 3600000 * 24).toISOString(),
          created_time: new Date(Date.now() - 3600000 * 72).toISOString()
        }
      ];
    }
  },

  async addWorkspaceTask(caseId: number, task: { task_title: string; description: string; assigned_officer_id?: number; priority: string; due_date: string }): Promise<WorkspaceTask> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(task)
      });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      let assignedName = undefined;
      if (task.assigned_officer_id) {
        if (task.assigned_officer_id === 1) assignedName = "Inspector Rajkumar";
        else if (task.assigned_officer_id === 2) assignedName = "ACP Patil";
        else if (task.assigned_officer_id === 3) assignedName = "Swati Deshpande";
      }
      return {
        rowid: Math.floor(Math.random() * 1000) + 10,
        case_folder_id: caseId,
        task_title: task.task_title,
        description: task.description,
        assigned_officer_id: task.assigned_officer_id,
        assigned_officer_name: assignedName,
        priority: task.priority as any,
        status: "Pending",
        due_date: task.due_date,
        created_time: new Date().toISOString()
      };
    }
  },

  async updateWorkspaceTask(caseId: number, taskId: number, status: string, priority?: string): Promise<WorkspaceTask> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status, priority })
      });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return {
        rowid: taskId,
        case_folder_id: caseId,
        task_title: "Updated Task",
        description: "Task details updated offline.",
        priority: (priority || "High") as any,
        status: status as any,
        due_date: new Date().toISOString(),
        created_time: new Date().toISOString()
      };
    }
  },

  // Workspace Members
  async getWorkspaceMembers(caseId: number): Promise<TeamMember[]> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/members`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return [
        { user_id: 1, name: "Inspector Rajkumar", role: "Investigator", police_id: "KSP-2015-BLR-884", status: "Online" },
        { user_id: 2, name: "ACP Patil", role: "Supervisor", police_id: "KSP-2008-MYS-012", status: "Offline" },
        { user_id: 3, name: "Swati Deshpande", role: "Crime Analyst", police_id: "KSP-2021-ANA-553", status: "Online" }
      ];
    }
  },

  async recordPresence(caseId: number): Promise<void> {
    try {
      await fetch(`${getBackendUrl()}/api/workspace/${caseId}/presence`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (e) {}
  },

  // Workspace Activity Feed
  async getWorkspaceFeed(caseId: number): Promise<any[]> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/feed`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return [
        { rowid: 1, case_folder_id: caseId, user_name: "ACP Patil", activity_type: "CASE_ASSIGNED", description: "Case folder assigned to Inspector Rajkumar.", created_time: new Date(Date.now() - 3600000 * 24 * 4).toISOString() },
        { rowid: 2, case_folder_id: caseId, user_name: "Inspector Rajkumar", activity_type: "EVIDENCE_UPLOAD", description: "Uploaded 'cctv_pulsar_capture.jpg'.", created_time: new Date(Date.now() - 3600000 * 5).toISOString() },
        { rowid: 3, case_folder_id: caseId, user_name: "Swati Deshpande", activity_type: "NOTE_ADDED", description: "Added cell tower logs summary.", created_time: new Date(Date.now() - 3600000 * 3).toISOString() }
      ];
    }
  },

  // Attachments Uploader
  async uploadWorkspaceAttachment(caseId: number, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${getBackendUrl()}/api/workspace/${caseId}/upload`, {
        method: 'POST',
        headers: {
          'X-Gemini-Key': localStorage.getItem('ksp_gemini_api_key') || '',
          'X-User-Id': String(JSON.parse(localStorage.getItem('ksp_crimemind_user') || '{}').rowid || 1)
        },
        body: formData
      });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return {
        status: "success",
        file_name: file.name,
        file_type: file.type,
        message_id: Math.floor(Math.random() * 100)
      };
    }
  },

  // Notifications
  async getNotifications(): Promise<WorkspaceNotification[]> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/notifications`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return [
        {
          rowid: 1,
          recipient_id: 1,
          sender_id: 2,
          sender_name: "ACP Patil",
          case_folder_id: 1,
          case_title: "Mysuru Gold Robbery Pulsar Gang",
          message: "ACP Patil mentioned you in case team discussion: '@Inspector Rajkumar, please prioritize the coordinate search...'",
          type: "MENTION",
          is_read: false,
          created_time: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ];
    }
  },

  async markNotificationRead(notificationId: number): Promise<void> {
    try {
      await fetch(`${getBackendUrl()}/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (e) {}
  },

  async chatQuery(query: string, sessionId: string | null, language: string): Promise<ChatQueryResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/chat/query`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ query, session_id: sessionId, language, voice_input: false }),
      });
      if (!res.ok) throw new Error('Query error');
      return await res.json();
    } catch (e) {
      // Fallback offline mock answer
      console.warn("API offline, utilizing client-side vishing/pulsar responses.");
      const isCyber = query.toLowerCase().includes('cyber') || query.toLowerCase().includes('phish') || query.toLowerCase().includes('invest') || query.toLowerCase().includes('money');
      
      if (isCyber) {
        return {
          session_id: sessionId || "session_offline",
          response: "Based on local client intelligence, a phishing operation (Cybercrime) is active under **FIR/2026/BLR/CYB/041** in Bengaluru City. Suspect **Karthik Gowda** was identified using SBI dummy bank account SBI-3304128490. He has a recurring history (+1 repeat offense link).",
          evidence_used: [
            { fir_id: 1, fir_number: "FIR/2026/BLR/CYB/041", description: "SBI KYC Phishing transfer of INR 4,50,000.", type: "FIR" },
            { fir_id: 1, fir_number: "FIR/2026/BLR/CYB/041", description: "Recording of scam call with suspect voice profile.", type: "Audio" }
          ],
          confidence: 0.94,
          reasoning_path: [
            "Parsed query for cyber terms",
            "Matched target suspect bank details against SBI-3304128490",
            "Isolated repeat offender records for Karthik Gowda"
          ],
          recommendations: [
            "AI-generated investigative suggestion: Immediately freeze bank account SBI-3304128490 via SBI Nodal Officer hotline.",
            "AI-generated investigative suggestion: Retrieve IP login coordinates for RT Nagar routers matching suspect access timestamps."
          ],
          related_cases: [
            { fir_id: 6, fir_number: "FIR/2026/BLR/CYB/059", title: "Investment Scam in Bengaluru", similarity: 0.85, matching_mo: "Stock Trading scams via WhatsApp group" }
          ]
        };
      } else {
        return {
          session_id: sessionId || "session_offline",
          response: "Based on offline database indices, I identified a robbery pattern (**FIR/2026/MYS/DEB/102**) in Mysuru City involving gold loot of INR 18,00,000. Suspect **Basavaraj 'Basya'** is currently absconding, and the escape motorcycle is a black Bajaj Pulsar.",
          evidence_used: [
            { fir_id: 2, fir_number: "FIR/2026/MYS/DEB/102", description: "Armed robbery at jewellery shop in Devaraja Mohalla.", type: "FIR" },
            { fir_id: 2, fir_number: "FIR/2026/MYS/DEB/102", description: "CCTV frames showing wrist scar on suspect Basavaraj.", type: "Digital" }
          ],
          confidence: 0.88,
          reasoning_path: [
            "Mapped robbery intent",
            "Identified Bajaj Pulsar motorcycle escape route patterns",
            "Matched suspect cell tower coordinates active during offence times"
          ],
          recommendations: [
            "AI-generated investigative suggestion: Check highway ANPR cameras for Bajaj Pulsar plate KA-11-H-8092.",
            "AI-generated investigative suggestion: Request Mandya cell tower pings matching Basavaraj's phone +91 9774012569."
          ],
          related_cases: [
            { fir_id: 4, fir_number: "FIR/2026/BLR/MTH/089", title: "Malleswaram Chain Snatching", similarity: 0.76, matching_mo: "Snatching on black sporty bike (Pulsar/Apache)" }
          ]
        };
      }
    }
  },

  async getCases(): Promise<CaseFolder[]> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/cases`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return [
        { rowid: 1, title: "Mysuru Gold Robbery & Highway Pulsar Syndicate", summary: "Investigation into armed robbery at Devaraja jewellery shop and related chain snatching incidents using black Pulsar motorcycles.", status: "Active", risk_score: 88, created_time: "2026-05-21 10:00:00" },
        { rowid: 2, title: "RT Nagar Cybercrime & Banking Vishing Ring", summary: "Covers vishing fraud cases targeting elder citizens in Bengaluru City, where victims transfer funds to SBI accounts.", status: "Active", risk_score: 82, created_time: "2026-05-14 09:30:00" },
        { rowid: 3, title: "Karavali Coastal Narcotics & Smuggling Syndicate", summary: "Multi-district investigation into MDMA and drug distribution across Mangaluru and Udupi coastal belt.", status: "Active", risk_score: 94, created_time: "2025-11-10 14:00:00" },
        { rowid: 4, title: "Deccan Land Grabbing, Extortion & Riot Gang", summary: "Organized crime module in Hubballi-Dharwad and Belagavi involved in land encroachments and extortion.", status: "Active", risk_score: 79, created_time: "2026-06-03 11:15:00" },
        { rowid: 5, title: "Bengaluru Commercial Crime & Crypto Fraud Module", summary: "Fake mobile trading app and crypto wallet scams operating out of Indiranagar.", status: "Active", risk_score: 75, created_time: "2026-07-06 09:00:00" },
        { rowid: 6, title: "Belagavi-Kalaburagi Inter-District Extortion Network", summary: "Extortion module targeting builders using firearms and forged land titles.", status: "Solved", risk_score: 65, created_time: "2024-04-20 16:00:00" }
      ];
    }
  },

  async getCaseDetail(id: number): Promise<CaseFolderDetailResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/cases/${id}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      // Return a complete mock case folder detail for offline validation
      return {
        rowid: id,
        title: id === 1 ? "Mysuru Gold Robbery & Highway Pulsar Syndicate" : id === 2 ? "RT Nagar Cybercrime & Banking Vishing Ring" : "Karavali Coastal Narcotics Syndicate",
        summary: id === 1 ? "Robbery and snatching patterns in Mysuru/Malleswaram linked by MO and suspect cell numbers." : "Vishing calls impersonating bank managers transferring money to a centralized SBI account.",
        status: "Active",
        risk_score: id === 1 ? 88 : id === 2 ? 82 : 94,
        created_time: id === 1 ? "2026-05-21 10:00:00" : "2026-05-14 09:30:00",
        timeline: [
          { id: "e1", date: "2026-05-20", title: "Armed Robbery registered", description: "Loot at Devaraja Jewellery store, gold worth 18L stolen.", type: "FIR" },
          { id: "e2", date: "2026-05-20", title: "CCTV seized", description: "CCTV seized from shop showing helmeted suspects.", type: "Evidence" },
          { id: "e3", date: "2026-05-20", title: "Suspect Rizwan Arrested", description: "Rizwan intercepted at Outer Ring Road checkpoint.", type: "Arrest" }
        ],
        evidence_timeline: [
          { id: "ev1", date: "2026-05-20", title: "Seized CCTV footage", description: "Digital frames of robbery.", type: "Evidence" }
        ],
        victims: [
          { rowid: 1, fir_id: 2, name: "Devadas Shetty", age: 52, phone_number: "+91 9845012359", address: "Devaraja Mohalla, Mysuru", statement: "Cashier pointed at gunpoint by helmeted boys." }
        ],
        accused: [
          { rowid: 2, fir_id: 2, name: "Basavaraj 'Basya'", age: 34, phone_number: "+91 9774012569", address: "KSRTC Colony, Mandya", status: "Absconding", bank_account: "HDFC-0412004821", vehicle_plate: "KA-11-H-8092", history_repeater: true },
          { rowid: 3, fir_id: 2, name: "Mohammad Rizwan", age: 29, phone_number: "+91 8894120359", address: "Bannimantap, Mysuru", status: "Arrested", bank_account: "ICICI-55410982", vehicle_plate: "KA-09-EF-2015", history_repeater: false }
        ],
        witnesses: [
          { rowid: 1, fir_id: 2, name: "Nagesh Rao", phone_number: "+91 9900213045", address: "Next shop vendor", statement: "Saw two men run out with gold bags." }
        ],
        evidence: [
          { rowid: 3, fir_id: 2, name: "CCTV Footage Devaraja shop", type: "Digital", description: "Showing tattoo details.", file_store_id: "cctv.mp4", date_found: "2026-05-20" }
        ],
        related_cases: [
          { fir_id: 4, fir_number: "FIR/2026/BLR/MTH/089", title: "Chain Snatching Malleswaram", similarity: 0.86, matching_mo: "Escaping on black sporty motorcycle" }
        ],
        graph: {
          nodes: [
            { data: { id: "cf_1", label: "Pulsar Syndicate", type: "Folder" } },
            { data: { id: "fir_2", label: "FIR 102/2026", type: "FIR" } },
            { data: { id: "acc_basya", label: "Basavaraj 'Basya'", type: "Accused" } },
            { data: { id: "ph_977", label: "+91 9774012569", type: "Phone" } },
            { data: { id: "v_pulsar", label: "KA-11-H-8092", type: "Vehicle" } }
          ],
          edges: [
            { data: { id: "e1", source: "acc_basya", target: "fir_2", label: "Appeared In" } },
            { data: { id: "e2", source: "acc_basya", target: "ph_977", label: "Uses" } },
            { data: { id: "e3", source: "acc_basya", target: "v_pulsar", label: "Owns" } }
          ]
        },
        notes: [
          { rowid: 1, case_folder_id: id, user_id: 1, username: "Inspector Rajkumar", note_content: "Suspect phone was active near the circle around 3:10 PM.", created_time: "2026-05-22 14:20:00" }
        ],
        tasks: [
          { rowid: 1, case_folder_id: id, task: "Arrest absconding suspect Basavaraj", completed: false },
          { rowid: 2, case_folder_id: id, task: "Verify license plate details on pulsar", completed: true }
        ],
        court_status: "Rizwan remains in judicial custody. Search warrants issued for Basavaraj.",
        evidence_confidence: 0.88
      };
    }
  },

  async addCaseNote(id: number, content: string): Promise<OfficerNote> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/cases/${id}/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ note_content: content }),
      });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return {
        rowid: Math.floor(Math.random() * 1000),
        case_folder_id: id,
        user_id: 1,
        username: "Inspector Rajkumar",
        note_content: content,
        created_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
    }
  },

  async toggleCaseTask(id: number, taskId: number): Promise<any> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/cases/${id}/tasks/${taskId}/toggle`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await res.json();
    } catch (e) {
      return { rowid: taskId, completed: true };
    }
  },

  async getAnalytics(): Promise<AnalyticsSummaryResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/analytics/dashboard`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return {
        total_firs: 12,
        pending_firs: 2,
        solved_firs: 3,
        repeat_offenders_count: 5,
        district_distribution: { "Bengaluru City": 4, "Mysuru City": 3, "Hubballi-Dharwad": 1, "Mangaluru City": 2, "Belagavi": 1, "Udupi": 1 },
        crime_type_distribution: { "Cybercrime": 3, "Robbery": 4, "Assault": 1, "Theft": 2, "Narcotics": 1, "Extortion": 1 },
        monthly_trends: [
          { month: "Jan", crimes: 12, solved: 8 },
          { month: "Feb", crimes: 19, solved: 11 },
          { month: "Mar", crimes: 15, solved: 10 },
          { month: "Apr", crimes: 22, solved: 14 },
          { month: "May", crimes: 12, solved: 3 }
        ],
        hotspots: [
          { fir_id: 1, fir_number: "FIR/2026/BLR/CYB/041", district: "Bengaluru City", crime_type: "Cybercrime", station: "Cyber Crime PS", lat: 12.9716, lng: 77.5946, severity: 75 },
          { fir_id: 2, fir_number: "FIR/2026/MYS/DEB/102", district: "Mysuru City", crime_type: "Robbery", station: "Devaraja PS", lat: 12.3086, lng: 76.6548, severity: 85 },
          { fir_id: 3, fir_number: "FIR/2026/HUB/KESH/154", district: "Hubballi-Dharwad", crime_type: "Assault", station: "Keshwapur PS", lat: 15.3647, lng: 75.1242, severity: 60 },
          { fir_id: 4, fir_number: "FIR/2026/BLR/MTH/089", district: "Bengaluru City", crime_type: "Robbery", station: "Malleswaram PS", lat: 12.9961, lng: 77.5714, severity: 50 },
          { fir_id: 5, fir_number: "FIR/2026/MYS/VVN/077", district: "Mysuru City", crime_type: "Theft", station: "V V Puram PS", lat: 12.3283, lng: 76.6341, severity: 68 },
          { fir_id: 6, fir_number: "FIR/2026/BLR/CYB/059", district: "Bengaluru City", crime_type: "Cybercrime", station: "Cyber Crime PS", lat: 12.9784, lng: 77.6408, severity: 80 },
          { fir_id: 8, fir_number: "FIR/2025/MNG/KAD/204", district: "Mangaluru City", crime_type: "Narcotics", station: "Kadri PS", lat: 12.8702, lng: 74.8427, severity: 92 },
          { fir_id: 9, fir_number: "FIR/2024/BEL/SHA/130", district: "Belagavi", crime_type: "Extortion", station: "Shahapur PS", lat: 15.8497, lng: 74.4977, severity: 88 }
        ]
      };
    }
  },

  async getIntelligenceCenter(): Promise<IntelligenceCenterResponse> {
    try {
      const res = await fetch(`${getBackendUrl()}/api/reports/morning-brief`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Error');
      return await res.json();
    } catch (e) {
      return {
        today_alerts: [
          { time: "08:15 AM", alert: "Spike in vishing scam calls targeting RT Nagar seniors. SBI account blocks initiated.", severity: "Medium" },
          { time: "09:30 AM", alert: "Black Pulsar motorcycle reported near Mandya. Border checkpoints alerted.", severity: "High" },
          { time: "11:00 AM", alert: "Seizure of commercial MDMA at Kadri checkpost. Airport Look-Out Circular active.", severity: "High" }
        ],
        emerging_patterns: [
          { pattern_name: "OTP / Bank Impersonation Ring", crimes_count: 3, district: "Bengaluru City", mo_description: "Suspect calls pretending to be SBI officials updating KYC, targets citizens, immediately transfers to online wallets." },
          { pattern_name: "Two-Wheeler Grab & Run Group", crimes_count: 4, district: "Mysuru / Malleswaram", mo_description: "Uses black Pulsar bikes without license plates, snatches chains/valuables in afternoon hours, escapes via highways." },
          { pattern_name: "Karavali Coastal Drug Smuggling", crimes_count: 2, district: "Mangaluru / Udupi", mo_description: "Inter-state drug trafficking hidden in modified vehicle door panels." }
        ],
        repeat_offenders: [
          { name: "Karthik Gowda", cases_linked: 3, last_status: "Suspect", mo_style: "Vishing / Phishing Call" },
          { name: "Basavaraj 'Basya'", cases_linked: 4, last_status: "Absconding", mo_style: "Armed Robbery / Snatching" },
          { name: "Suresh Poojary 'Don'", cases_linked: 2, last_status: "Absconding", mo_style: "Narcotics / Extortion" }
        ],
        high_risk_districts: [
          { district: "Bengaluru City", risk_level: "High", cases_count: 4, incident_rate: "+14%" },
          { district: "Mangaluru City", risk_level: "High", cases_count: 2, incident_rate: "+18%" },
          { district: "Mysuru City", risk_level: "Medium", cases_count: 3, incident_rate: "+6%" }
        ],
        organized_crime_alerts: [
          { gang_name: "Pulsar Snatchers Syndicate", active_zone: "Bengaluru / Mysuru highway", risk_score: 88, status: "Under surveillance" },
          { gang_name: "Karavali Smuggling Syndicate", active_zone: "Mangaluru / Udupi coastline", risk_score: 94, status: "LOC Issued" }
        ],
        recommendations: [
          "AI-generated investigative suggestion: Deploy police patrols in Malleswaram and V V Puram residential streets between 1:00 PM and 4:00 PM to counter active snatching hours.",
          "AI-generated investigative suggestion: Broadcast regional warnings to senior citizens in RT Nagar regarding KYC expiration calls.",
          "AI-generated investigative suggestion: Synchronize ANPR logs at Mandya toll gates to identify black Pulsar plate KA-11-H-8092 crossing registers.",
          "AI-generated investigative suggestion: Freeze beneficiary account SBI-3304128490 and subpoena IP logs from Internet Service Providers."
        ],
        recent_updates: [
          { timestamp: "2 mins ago", title: "Suspect Somesh Patil Arrested", details: "Arrested by Keshwapur PS in connection with assault case." },
          { timestamp: "1 hr ago", title: "Bank Account Frozen", details: "SBI-3304128490 frozen by Cyber Crime PS order." },
          { timestamp: "3 hrs ago", title: "MDMA Contraband Seized", details: "15kg MDMA seized at Kadri Checkpost by Mangaluru Police." }
        ]
      };
    }
  }
};
