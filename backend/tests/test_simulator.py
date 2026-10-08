import pytest
from app.core.database import SessionLocal
from app.services.simulator_service import SimulatorService
from app.schemas.simulator import SimulatorRequest


def test_what_if_simulation():
    db = SessionLocal()
    try:
        req = SimulatorRequest(
            role_category="Backend Developer",
            intervention_skill="Data Structures & Algorithms",
            expected_skill_improvement=15.0
        )
        res = SimulatorService.run_simulation(db, req)
        assert res.potential_increase > 0
        assert res.projected_eligible_count > res.current_eligible_count
        assert res.projected_average_readiness > res.current_average_readiness
        assert "SIMULATION" in res.simulation_label
    finally:
        db.close()
