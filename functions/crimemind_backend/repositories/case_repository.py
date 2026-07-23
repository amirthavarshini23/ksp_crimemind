from typing import List, Dict, Any, Optional
from repositories.base_repository import BaseRepository
import repositories.mock_data as mock
from datetime import datetime

class CaseRepository(BaseRepository):

    def get_all_cases(self) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('CaseFolder')
                rows = table.get_all_rows()
                return [dict(row) for row in rows]
            except Exception:
                pass
        return mock.MOCK_CASE_FOLDERS

    def get_case_by_id(self, case_id: int) -> Optional[Dict[str, Any]]:
        cases = self.get_all_cases()
        for c in cases:
            if int(c.get("rowid") or c.get("ROWID") or 0) == int(case_id):
                return c
        return None

    def get_firs_by_case_id(self, case_id: int) -> List[int]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('CaseFolder_FIR_Mapping')
                rows = table.get_all_rows()
                return [int(row.get('fir_id') or 0) for row in rows if int(row.get('case_folder_id') or 0) == int(case_id)]
            except Exception:
                pass
        return [int(m.get("fir_id") or 0) for m in mock.MOCK_CASE_FOLDER_FIR_MAPPINGS if int(m.get("case_folder_id") or 0) == int(case_id)]

    def get_notes_by_case_id(self, case_id: int) -> List[Dict[str, Any]]:
        notes_list = []
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('OfficerNotes')
                rows = table.get_all_rows()
                notes_list = [dict(row) for row in rows if int(row.get('case_folder_id') or 0) == int(case_id)]
            except Exception:
                pass
        else:
            notes_list = [n for n in mock.MOCK_OFFICER_NOTES if int(n.get("case_folder_id") or 0) == int(case_id)]
        
        # Enrich notes with username
        for note in notes_list:
            user_id = int(note.get("user_id") or 0)
            username = "Unknown Officer"
            for user in mock.MOCK_USERS:
                if user["rowid"] == user_id:
                    username = user["username"]
                    break
            note["username"] = username
            if isinstance(note.get("created_time"), datetime):
                note["created_time"] = note["created_time"].strftime("%Y-%m-%d %H:%M:%S")
        return notes_list

    def add_note_to_case(self, case_id: int, user_id: int, note_content: str) -> Dict[str, Any]:
        new_note = {
            "rowid": len(mock.MOCK_OFFICER_NOTES) + 1,
            "case_folder_id": case_id,
            "user_id": user_id,
            "note_content": note_content,
            "created_time": datetime.now()
        }
        
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('OfficerNotes')
                inserted = table.insert_row({
                    "case_folder_id": case_id,
                    "user_id": user_id,
                    "note_content": note_content,
                    "created_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                new_note["rowid"] = inserted.get("ROWID") or inserted.get("rowid") or new_note["rowid"]
            except Exception:
                pass
        
        # Keep mock sync
        mock.MOCK_OFFICER_NOTES.append(new_note)
        
        # Enrich user details
        username = "Unknown Officer"
        for user in mock.MOCK_USERS:
            if user["rowid"] == user_id:
                username = user["username"]
                break
        
        return {
            "rowid": new_note["rowid"],
            "case_folder_id": case_id,
            "user_id": user_id,
            "username": username,
            "note_content": note_content,
            "created_time": new_note["created_time"].strftime("%Y-%m-%d %H:%M:%S") if isinstance(new_note["created_time"], datetime) else str(new_note["created_time"])
        }

    def get_tasks_by_case_id(self, case_id: int) -> List[Dict[str, Any]]:
        # In Zoho Catalyst, this would fetch from a Tasks table
        # We fall back to mock.MOCK_TASKS for simplicity
        return [t for t in mock.MOCK_TASKS if int(t.get("case_folder_id") or 0) == int(case_id)]

    def add_task(self, case_id: int, task_name: str) -> Dict[str, Any]:
        new_task = {
            "rowid": len(mock.MOCK_TASKS) + 1,
            "case_folder_id": case_id,
            "task": task_name,
            "completed": False
        }
        mock.MOCK_TASKS.append(new_task)
        return new_task

    def toggle_task_completion(self, task_id: int) -> Optional[Dict[str, Any]]:
        for t in mock.MOCK_TASKS:
            if int(t.get("rowid") or 0) == int(task_id):
                t["completed"] = not t["completed"]
                return t
        return None
