from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import get_current_user
from app.models.entities import User, Notification
from app.schemas.common import APIResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=APIResponse[List[Dict[str, Any]]])
def get_notifications(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifs = [
        {
            "id": 1,
            "title": "Readiness Milestone Achieved",
            "message": "Your placement readiness is at 68%. You are just 7 points away from reaching Placement Ready status (75%).",
            "type": "READINESS",
            "is_read": False,
            "created_at": "10 minutes ago"
        },
        {
            "id": 2,
            "title": "New Job Match: Backend Engineer",
            "message": "Nexus Innovations posted a Backend Software Engineer role matching 84% of your verified skills.",
            "type": "JOB_MATCH",
            "is_read": False,
            "created_at": "2 hours ago"
        },
        {
            "id": 3,
            "title": "DSA Assessment Recommended",
            "message": "Strengthening Data Structures & Algorithms has been identified as your biggest high-leverage growth area.",
            "type": "ASSESSMENT",
            "is_read": True,
            "created_at": "Yesterday"
        }
    ]
    return APIResponse(success=True, data=notifs, message="Notifications retrieved")


@router.put("/mark-all-read", response_model=APIResponse[Dict[str, Any]])
def mark_all_read(user: User = Depends(get_current_user)):
    return APIResponse(success=True, data={"all_read": True}, message="All notifications marked as read")
