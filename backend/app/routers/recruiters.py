from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import require_roles
from app.models.enums import UserRole
from app.schemas.common import APIResponse
from app.services.recruiter_service import RecruiterService

router = APIRouter(prefix="/recruiters", tags=["Recruiters"])


@router.get("/overview", response_model=APIResponse[Dict[str, Any]])
def get_recruiter_overview(
    user = Depends(require_roles([UserRole.RECRUITER.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    overview = RecruiterService.get_recruiter_overview(db)
    return APIResponse(
        success=True,
        data=overview,
        message="Recruiter pipeline retrieved"
    )


@router.get("/candidates", response_model=APIResponse[List[Dict[str, Any]]])
def get_matched_candidates(
    job_id: Optional[int] = Query(None),
    user = Depends(require_roles([UserRole.RECRUITER.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    candidates = RecruiterService.get_matched_candidates(db, job_id=job_id)
    return APIResponse(
        success=True,
        data=candidates,
        message="Evidence-verified candidate matches retrieved"
    )
