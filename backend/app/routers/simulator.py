from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.deps import require_roles
from app.models.enums import UserRole
from app.schemas.simulator import SimulatorRequest, SimulatorResponse
from app.schemas.common import APIResponse
from app.services.simulator_service import SimulatorService

router = APIRouter(prefix="/simulator", tags=["What-If Simulator"])


@router.post("/simulate", response_model=APIResponse[SimulatorResponse])
def run_simulation(
    req: SimulatorRequest,
    user = Depends(require_roles([UserRole.TPO.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    result = SimulatorService.run_simulation(db, req)
    return APIResponse(
        success=True,
        data=result,
        message="Simulation projected successfully (Estimates only, not a guarantee)"
    )
