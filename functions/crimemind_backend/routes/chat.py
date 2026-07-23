from fastapi import APIRouter, Header, Depends
from models.schemas import ChatQueryRequest, ChatQueryResponse
from services.search_service import SearchService
from services.gemini_service import GeminiService
from repositories.fir_repository import FIRRepository
from repositories.case_repository import CaseRepository
import os

router = APIRouter(prefix="/chat", tags=["AI Chat"])

# Helper to load API key
def get_api_key(api_key: str = Header(None, alias="X-Gemini-Key")) -> str:
    # Use header or environment variable
    return api_key or os.environ.get("GEMINI_API_KEY", "")

@router.post("/query", response_model=ChatQueryResponse)
def query_copilot(req: ChatQueryRequest, api_key: str = Depends(get_api_key)):
    # Initialize repositories
    fir_repo = FIRRepository()
    case_repo = CaseRepository()
    
    # Initialize services
    search_service = SearchService(api_key=api_key)
    gemini_service = GeminiService(api_key=api_key)
    
    # Execute workflow
    result = gemini_service.query_agent_workflow(
        query=req.query,
        session_id=req.session_id,
        language=req.language,
        fir_repo=fir_repo,
        case_repo=case_repo,
        search_service=search_service
    )
    
    return ChatQueryResponse(**result)
