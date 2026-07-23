from fastapi import APIRouter, HTTPException, Depends
from models.schemas import LoginRequest, UserProfile
import repositories.mock_data as mock
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=UserProfile)
def login(req: LoginRequest):
    # Search for user by email
    for user in mock.MOCK_USERS:
        if user["email"] == req.email:
            return UserProfile(
                rowid=user["rowid"],
                email=user["email"],
                username=user["username"],
                role=user["role"],
                police_id=user["police_id"],
                created_time=user["created_time"]
            )
    
    # Simple default fallback login for demo if email doesn't match mock
    return UserProfile(
        rowid=4,
        email=req.email,
        username=req.email.split("@")[0].capitalize(),
        role="Investigator",
        police_id="KSP-2026-GEN-101",
        created_time=datetime.now()
    )

@router.get("/me", response_model=UserProfile)
def me():
    # Return default logged in user (Investigator)
    user = mock.MOCK_USERS[0]
    return UserProfile(
        rowid=user["rowid"],
        email=user["email"],
        username=user["username"],
        role=user["role"],
        police_id=user["police_id"],
        created_time=user["created_time"]
    )
