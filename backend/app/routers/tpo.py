from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import require_roles
from app.models.enums import UserRole
from app.schemas.common import APIResponse
from app.services.tpo_service import TPOService

router = APIRouter(prefix="/tpo", tags=["TPO"])


@router.get("/overview", response_model=APIResponse[Dict[str, Any]])
def get_batch_overview(
    user = Depends(require_roles([UserRole.TPO.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    overview = TPOService.get_batch_overview(db)
    return APIResponse(
        success=True,
        data=overview,
        message="Batch intelligence overview retrieved"
    )


@router.get("/students", response_model=APIResponse[Dict[str, Any]])
def get_students(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    min_readiness: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    user = Depends(require_roles([UserRole.TPO.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    table_data = TPOService.get_students_table(
        db, search=search, department=department, min_readiness=min_readiness, page=page, limit=limit
    )
    return APIResponse(
        success=True,
        data=table_data,
        message="Student batch records retrieved"
    )
