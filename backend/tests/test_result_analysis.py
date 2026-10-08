import pytest
from app.services.result_analyzer_service import ResultAnalyzerService
from app.schemas.result_analysis import ResultAnalysisRequest


def test_result_analysis_dsa_and_concurrency():
    req = ResultAnalysisRequest(
        company_name="Nexus Innovations",
        tech_field="Backend Developer",
        stage="Technical Interview Round 1",
        verdict="REJECTED / BORDERLINE",
        questions_faced="They asked me to solve a Binary Tree Lowest Common Ancestor with DP, and then asked how to make a cache thread-safe with locks. I got confused about time complexity and race conditions.",
        struggle_areas="Struggled to explain thread locks and could not reduce tree traversal time complexity.",
    )
    result = ResultAnalyzerService.analyze_result(req)
    assert result.company_name == "Nexus Innovations"
    assert result.overall_gap_severity in ["HIGH", "MODERATE"]
    assert len(result.lacking_skills) >= 2
    
    # Check that Algorithmic and Concurrency skills are detected
    skill_names = [s.skill_name for s in result.lacking_skills]
    assert any("Algorithmic" in s or "Complexity" in s for s in skill_names)
    assert any("Concurrency" in s or "Thread" in s for s in skill_names)
    assert len(result.recovery_roadmap) == 4
