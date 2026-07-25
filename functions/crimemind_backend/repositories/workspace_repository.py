from typing import List, Dict, Any, Optional
from repositories.base_repository import BaseRepository
import repositories.mock_data as mock
from datetime import datetime, timedelta

# In-memory store for messages, tasks, notifications, and activity logs
# initialized with realistic seed data to support offline and development mode.
WORKSPACE_MESSAGES = [
    # Case 1 (Robbery)
    {
        "rowid": 1,
        "case_folder_id": 1,
        "sender_id": 1, # Inspector Rajkumar
        "sender_name": "Inspector Rajkumar",
        "sender_role": "Investigator",
        "message_text": "I have reviewed the CCTV footage from Devaraja Mohalla. The getaway motorcycle is definitely a black Pulsar 150. Let's dispatch a team to trace the registered owner.",
        "has_attachment": False,
        "shared_chat_id": None,
        "created_time": datetime.now() - timedelta(hours=5)
    },
    {
        "rowid": 2,
        "case_folder_id": 1,
        "sender_id": 3, # Swati Deshpande (Analyst)
        "sender_name": "Swati Deshpande",
        "sender_role": "Crime Analyst",
        "message_text": "Completed the tower dump analysis. Suspect Basavaraj's phone +91 9774012569 was active near the jewellery shop during the robbery timeframe. Details shared in the case graph.",
        "has_attachment": False,
        "shared_chat_id": None,
        "created_time": datetime.now() - timedelta(hours=3)
    },
    {
        "rowid": 3,
        "case_folder_id": 1,
        "sender_id": 2, # ACP Patil (Supervisor)
        "sender_name": "ACP Patil",
        "sender_role": "Supervisor",
        "message_text": "@Inspector Rajkumar, please prioritize the coordinate search on the outer ring road toll gates. We need that Pulsar tracked down immediately.",
        "has_attachment": False,
        "shared_chat_id": None,
        "created_time": datetime.now() - timedelta(hours=2)
    },
    # Case 2 (Cybercrime)
    {
        "rowid": 4,
        "case_folder_id": 2,
        "sender_id": 1, # Inspector Rajkumar
        "sender_name": "Inspector Rajkumar",
        "sender_role": "Investigator",
        "message_text": "We just sent a formal freeze request to SBI Nodal officer for account SBI-3304128490.",
        "has_attachment": False,
        "shared_chat_id": None,
        "created_time": datetime.now() - timedelta(hours=10)
    }
]

WORKSPACE_ATTACHMENTS = [
    {
        "rowid": 1,
        "message_id": 1,
        "file_name": "cctv_pulsar_capture.jpg",
        "file_type": "image/jpeg",
        "file_store_id": "cctv_frame_robbery",
        "created_time": datetime.now() - timedelta(hours=5)
    }
]

WORKSPACE_TASKS = [
    # Case 1
    {
        "rowid": 1,
        "case_folder_id": 1,
        "task_title": "Trace Bajaj Pulsar KA-11-H-8092",
        "description": "Crosscheck license plates with highway toll ANPR database to determine escape coordinates.",
        "assigned_officer_id": 1,
        "assigned_officer_name": "Inspector Rajkumar",
        "priority": "High",
        "status": "In Progress",
        "due_date": datetime.now() + timedelta(days=2),
        "created_time": datetime.now() - timedelta(days=1)
    },
    {
        "rowid": 2,
        "case_folder_id": 1,
        "task_title": "Obtain search warrants for bannimantap house",
        "description": "Draft petition for magistrate to search the bannimantap residence associated with Mohammad Rizwan.",
        "assigned_officer_id": 2,
        "assigned_officer_name": "ACP Patil",
        "priority": "Medium",
        "status": "Pending",
        "due_date": datetime.now() + timedelta(days=5),
        "created_time": datetime.now() - timedelta(days=1)
    },
    {
        "rowid": 3,
        "case_folder_id": 1,
        "task_title": "Conduct forensic finger-printing",
        "description": "Seize broken glass counters from jewellery shop and dispatch to FSL Bengaluru.",
        "assigned_officer_id": 1,
        "assigned_officer_name": "Inspector Rajkumar",
        "priority": "Low",
        "status": "Completed",
        "due_date": datetime.now() - timedelta(days=1),
        "created_time": datetime.now() - timedelta(days=3)
    },
    # Case 2
    {
        "rowid": 4,
        "case_folder_id": 2,
        "task_title": "Retrieve KYC records from SBI RT Nagar branch",
        "description": "Collect ID proofs and verification logs used to activate beneficiary account SBI-3304128490.",
        "assigned_officer_id": 3,
        "assigned_officer_name": "Swati Deshpande",
        "priority": "High",
        "status": "Pending",
        "due_date": datetime.now() + timedelta(days=1),
        "created_time": datetime.now() - timedelta(days=2)
    }
]

WORKSPACE_ACTIVITY_LOGS = [
    {
        "rowid": 1,
        "case_folder_id": 1,
        "user_id": 1,
        "user_name": "Inspector Rajkumar",
        "activity_type": "CASE_ASSIGNED",
        "description": "Case folder assigned to Inspector Rajkumar by ACP Patil.",
        "created_time": datetime.now() - timedelta(days=4)
    },
    {
        "rowid": 2,
        "case_folder_id": 1,
        "user_id": 1,
        "user_name": "Inspector Rajkumar",
        "activity_type": "EVIDENCE_UPLOAD",
        "description": "Seized CCTV clip showing suspect scar marks added to folder.",
        "created_time": datetime.now() - timedelta(hours=5)
    },
    {
        "rowid": 3,
        "case_folder_id": 1,
        "user_id": 3,
        "user_name": "Swati Deshpande",
        "activity_type": "NOTE_ADDED",
        "description": "Tower log coordinates added to Case Folder.",
        "created_time": datetime.now() - timedelta(hours=3)
    }
]

NOTIFICATIONS = [
    {
        "rowid": 1,
        "recipient_id": 1, # Rajkumar
        "sender_id": 2, # Patil
        "sender_name": "ACP Patil",
        "case_folder_id": 1,
        "case_title": "Mysuru Gold Robbery Pulsar Gang",
        "message": "ACP Patil mentioned you in case team discussion: '@Inspector Rajkumar, please prioritize the coordinate search...'",
        "type": "MENTION",
        "is_read": False,
        "created_time": datetime.now() - timedelta(hours=2)
    }
]

# Simple dynamic tracking of active users (presence heartbeats)
ACTIVE_PRESENCE = {} # user_id -> {"case_id": int, "last_active": datetime}

class WorkspaceRepository(BaseRepository):
    
    def get_messages(self, case_id: int) -> List[Dict[str, Any]]:
        # In Zoho Catalyst, we would query the WorkspaceMessages table
        # We fall back to the in-memory array
        return [msg for msg in WORKSPACE_MESSAGES if msg["case_folder_id"] == case_id]

    def add_message(self, case_id: int, sender_id: int, message_text: str, shared_chat_id: Optional[str] = None) -> Dict[str, Any]:
        sender_name = "Unknown Officer"
        sender_role = "Investigator"
        for u in mock.MOCK_USERS:
            if u["rowid"] == sender_id:
                sender_name = u["username"]
                sender_role = u["role"]
                break

        new_msg = {
            "rowid": len(WORKSPACE_MESSAGES) + 1,
            "case_folder_id": case_id,
            "sender_id": sender_id,
            "sender_name": sender_name,
            "sender_role": sender_role,
            "message_text": message_text,
            "has_attachment": False,
            "shared_chat_id": shared_chat_id,
            "created_time": datetime.now()
        }
        WORKSPACE_MESSAGES.append(new_msg)

        # Log Activity
        self.add_activity_log(case_id, sender_id, "MESSAGE_POSTED", f"{sender_name} posted a message: '{message_text[:30]}...'")

        # Parse Mentions
        # Mentions format: @Name or @Role
        for u in mock.MOCK_USERS:
            # Check username (case insensitive)
            clean_username = u["username"].replace(" ", "").lower()
            mention_token = f"@{clean_username}"
            mention_friendly = f"@{u['username'].lower()}"
            if mention_token in message_text.replace(" ", "").lower() or mention_friendly in message_text.lower():
                self.create_notification(
                    recipient_id=u["rowid"],
                    sender_id=sender_id,
                    case_folder_id=case_id,
                    message=f"{sender_name} mentioned you in case team discussion: '{message_text[:60]}...'",
                    notif_type="MENTION"
                )

        return new_msg

    def get_tasks(self, case_id: int) -> List[Dict[str, Any]]:
        return [t for t in WORKSPACE_TASKS if t["case_folder_id"] == case_id]

    def add_task(self, case_id: int, creator_id: int, task_title: str, description: str, assigned_officer_id: Optional[int], priority: str, due_date: datetime) -> Dict[str, Any]:
        assigned_name = None
        if assigned_officer_id:
            for u in mock.MOCK_USERS:
                if u["rowid"] == assigned_officer_id:
                    assigned_name = u["username"]
                    break

        new_task = {
            "rowid": len(WORKSPACE_TASKS) + 1,
            "case_folder_id": case_id,
            "task_title": task_title,
            "description": description,
            "assigned_officer_id": assigned_officer_id,
            "assigned_officer_name": assigned_name,
            "priority": priority,
            "status": "Pending",
            "due_date": due_date,
            "created_time": datetime.now()
        }
        WORKSPACE_TASKS.append(new_task)

        # Log activity
        creator_name = "System"
        for u in mock.MOCK_USERS:
            if u["rowid"] == creator_id:
                creator_name = u["username"]
                break

        self.add_activity_log(case_id, creator_id, "TASK_CREATED", f"{creator_name} created task: '{task_title}' (Assigned: {assigned_name or 'Unassigned'})")

        # Generate notification for assigned officer
        if assigned_officer_id and assigned_officer_id != creator_id:
            self.create_notification(
                recipient_id=assigned_officer_id,
                sender_id=creator_id,
                case_folder_id=case_id,
                message=f"New task assigned to you by {creator_name}: '{task_title}'",
                notif_type="TASK_ASSIGNED"
            )

        return new_task

    def update_task_status(self, task_id: int, updater_id: int, status: str, priority: Optional[str] = None) -> Optional[Dict[str, Any]]:
        for t in WORKSPACE_TASKS:
            if t["rowid"] == task_id:
                old_status = t["status"]
                t["status"] = status
                if priority:
                    t["priority"] = priority
                
                # Log activity
                updater_name = "Officer"
                for u in mock.MOCK_USERS:
                    if u["rowid"] == updater_id:
                        updater_name = u["username"]
                        break
                
                self.add_activity_log(t["case_folder_id"], updater_id, "TASK_UPDATED", f"{updater_name} updated task status for '{t['task_title']}' to '{status}'")
                
                # Notify assignee if updated by someone else
                if t["assigned_officer_id"] and t["assigned_officer_id"] != updater_id:
                    self.create_notification(
                        recipient_id=t["assigned_officer_id"],
                        sender_id=updater_id,
                        case_folder_id=t["case_folder_id"],
                        message=f"Task '{t['task_title']}' updated to '{status}' by {updater_name}",
                        notif_type="TASK_UPDATED"
                    )
                return t
        return None

    def get_team_members(self, case_id: int) -> List[Dict[str, Any]]:
        # Enriches the mock users as active members of this case team
        members = []
        for u in mock.MOCK_USERS:
            # Check presence status
            presence = ACTIVE_PRESENCE.get(u["rowid"])
            status = "Offline"
            if presence and presence["case_id"] == case_id:
                if datetime.now() - presence["last_active"] < timedelta(minutes=5):
                    status = "Online"
            
            members.append({
                "user_id": u["rowid"],
                "name": u["username"],
                "role": u["role"],
                "police_id": u["police_id"],
                "status": status
            })
        return members

    def record_presence(self, user_id: int, case_id: int):
        ACTIVE_PRESENCE[user_id] = {
            "case_id": case_id,
            "last_active": datetime.now()
        }

    def get_activity_feed(self, case_id: int) -> List[Dict[str, Any]]:
        feed = [log for log in WORKSPACE_ACTIVITY_LOGS if log["case_folder_id"] == case_id]
        feed.sort(key=lambda x: x["created_time"], reverse=True)
        return feed

    def add_activity_log(self, case_id: int, user_id: int, activity_type: str, description: str):
        user_name = "System"
        for u in mock.MOCK_USERS:
            if u["rowid"] == user_id:
                user_name = u["username"]
                break

        new_log = {
            "rowid": len(WORKSPACE_ACTIVITY_LOGS) + 1,
            "case_folder_id": case_id,
            "user_id": user_id,
            "user_name": user_name,
            "activity_type": activity_type,
            "description": description,
            "created_time": datetime.now()
        }
        WORKSPACE_ACTIVITY_LOGS.append(new_log)

    def get_notifications(self, user_id: int) -> List[Dict[str, Any]]:
        notifs = [n for n in NOTIFICATIONS if n["recipient_id"] == user_id]
        notifs.sort(key=lambda x: x["created_time"], reverse=True)
        return notifs

    def create_notification(self, recipient_id: int, sender_id: int, case_folder_id: Optional[int], message: str, notif_type: str):
        sender_name = "System"
        for u in mock.MOCK_USERS:
            if u["rowid"] == sender_id:
                sender_name = u["username"]
                break

        case_title = None
        if case_folder_id:
            for c in mock.MOCK_CASE_FOLDERS:
                if c["rowid"] == case_folder_id:
                    case_title = c["title"]
                    break

        new_notif = {
            "rowid": len(NOTIFICATIONS) + 1,
            "recipient_id": recipient_id,
            "sender_id": sender_id,
            "sender_name": sender_name,
            "case_folder_id": case_folder_id,
            "case_title": case_title,
            "message": message,
            "type": notif_type,
            "is_read": False,
            "created_time": datetime.now()
        }
        NOTIFICATIONS.append(new_notif)

    def mark_notification_read(self, notif_id: int, user_id: int) -> bool:
        for n in NOTIFICATIONS:
            if n["rowid"] == notif_id and n["recipient_id"] == user_id:
                n["is_read"] = True
                return True
        return False
