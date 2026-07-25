from fastapi import APIRouter, HTTPException, Depends
from models.schemas import LoginRequest, UserProfile
import repositories.mock_data as mock
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=UserProfile)
def login(req: LoginRequest):
    # For demo validation, accept password "password123"
    if req.password != "password123" and req.password != "admin":
        raise HTTPException(status_code=401, detail="Invalid officer password")

    # Search for user by email
    for user in mock.MOCK_USERS:
        if user["email"].lower() == req.email.lower():
            # Override database/mock role with the user's selected role for dynamic testing
            role_to_use = req.role if req.role else user["role"]
            return UserProfile(
                rowid=user["rowid"],
                email=user["email"],
                username=user["username"],
                role=role_to_use,
                police_id=user["police_id"],
                created_time=user["created_time"]
            )
    
    # Custom fallback login for testing roles
    role_to_use = req.role if req.role else "Investigator"
    username = req.email.split("@")[0].replace(".", " ").title()
    return UserProfile(
        rowid=99,
        email=req.email,
        username=username,
        role=role_to_use,
        police_id=f"KSP-2026-EXT-{req.role[:3].upper()}",
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
