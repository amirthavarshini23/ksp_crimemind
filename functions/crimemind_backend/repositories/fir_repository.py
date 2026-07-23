from typing import List, Dict, Any, Optional
from repositories.base_repository import BaseRepository
import repositories.mock_data as mock

class FIRRepository(BaseRepository):
    
    def get_all_firs(self) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('FIR')
                rows = table.get_all_rows()
                return [dict(row) for row in rows]
            except Exception as e:
                pass
        return mock.MOCK_FIRS

    def get_fir_by_id(self, fir_id: int) -> Optional[Dict[str, Any]]:
        firs = self.get_all_firs()
        for f in firs:
            if int(f.get("rowid") or f.get("ROWID") or 0) == int(fir_id):
                return f
        return None

    def get_fir_by_number(self, fir_number: str) -> Optional[Dict[str, Any]]:
        firs = self.get_all_firs()
        for f in firs:
            if f.get("fir_number") == fir_number:
                return f
        return None

    def get_accused_by_fir_id(self, fir_id: int) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Accused')
                rows = table.get_all_rows()
                return [dict(row) for row in rows if int(row.get('fir_id') or 0) == int(fir_id)]
            except Exception:
                pass
        return [acc for acc in mock.MOCK_ACCUSED if int(acc.get("fir_id") or 0) == int(fir_id)]

    def get_all_accused(self) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Accused')
                rows = table.get_all_rows()
                return [dict(row) for row in rows]
            except Exception:
                pass
        return mock.MOCK_ACCUSED

    def get_victims_by_fir_id(self, fir_id: int) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Victim')
                rows = table.get_all_rows()
                return [dict(row) for row in rows if int(row.get('fir_id') or 0) == int(fir_id)]
            except Exception:
                pass
        return [vic for vic in mock.MOCK_VICTIMS if int(vic.get("fir_id") or 0) == int(fir_id)]

    def get_witnesses_by_fir_id(self, fir_id: int) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Witness')
                rows = table.get_all_rows()
                return [dict(row) for row in rows if int(row.get('fir_id') or 0) == int(fir_id)]
            except Exception:
                pass
        return [wit for wit in mock.MOCK_WITNESSES if int(wit.get("fir_id") or 0) == int(fir_id)]

    def get_evidence_by_fir_id(self, fir_id: int) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Evidence')
                rows = table.get_all_rows()
                return [dict(row) for row in rows if int(row.get('fir_id') or 0) == int(fir_id)]
            except Exception:
                pass
        return [ev for ev in mock.MOCK_EVIDENCE if int(ev.get("fir_id") or 0) == int(fir_id)]

    def get_vehicles_by_fir_id(self, fir_id: int) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Vehicle')
                rows = table.get_all_rows()
                return [dict(row) for row in rows if int(row.get('associated_fir_id') or 0) == int(fir_id)]
            except Exception:
                pass
        return [veh for veh in mock.MOCK_VEHICLES if int(veh.get("associated_fir_id") or 0) == int(fir_id)]

    def get_all_vehicles(self) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Vehicle')
                rows = table.get_all_rows()
                return [dict(row) for row in rows]
            except Exception:
                pass
        return mock.MOCK_VEHICLES

    def get_phones_by_fir_id(self, fir_id: int) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Phone')
                rows = table.get_all_rows()
                return [dict(row) for row in rows if int(row.get('associated_fir_id') or 0) == int(fir_id)]
            except Exception:
                pass
        return [ph for ph in mock.MOCK_PHONES if int(ph.get("associated_fir_id") or 0) == int(fir_id)]

    def get_all_phones(self) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('Phone')
                rows = table.get_all_rows()
                return [dict(row) for row in rows]
            except Exception:
                pass
        return mock.MOCK_PHONES

    def get_bank_accounts_by_fir_id(self, fir_id: int) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('BankAccount')
                rows = table.get_all_rows()
                return [dict(row) for row in rows if int(row.get('associated_fir_id') or 0) == int(fir_id)]
            except Exception:
                pass
        return [ba for ba in mock.MOCK_BANK_ACCOUNTS if int(ba.get("associated_fir_id") or 0) == int(fir_id)]

    def get_all_bank_accounts(self) -> List[Dict[str, Any]]:
        if self.has_catalyst:
            try:
                ds = self.get_datastore()
                table = ds.table('BankAccount')
                rows = table.get_all_rows()
                return [dict(row) for row in rows]
            except Exception:
                pass
        return mock.MOCK_BANK_ACCOUNTS
