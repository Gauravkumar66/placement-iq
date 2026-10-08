from typing import Any, Dict, List
from app.schemas.result_analysis import (
    ResultAnalysisRequest,
    ResultAnalysisResponse,
    LackingSkillDetail,
)


class ResultAnalyzerService:
    @staticmethod
    def analyze_result(req: ResultAnalysisRequest) -> ResultAnalysisResponse:
        q_text = (req.questions_faced + " " + (req.struggle_areas or "") + " " + (req.notes or "")).lower()
        company_lower = req.company_name.lower()
        field_lower = req.tech_field.lower()

        # Company-specific benchmarks
        if any(c in company_lower for c in ["google", "meta", "uber"]):
            bar = "Tier 1 Product: Zero-tolerance for unoptimized Big-O complexity, expect production-ready clean code on complex Graphs & Dynamic Programming."
            severity = "HIGH"
        elif any(c in company_lower for c in ["amazon", "nexus", "microsoft", "flipkart"]):
            bar = "Top Enterprise / Cloud Scale: Heavy emphasis on Data Structures, Concurrency, Clean Code, and explaining trade-offs under real-world constraints."
            severity = "HIGH" if "reject" in req.verdict.lower() else "MODERATE"
        elif any(c in company_lower for c in ["tcs", "infosys", "wipro", "cognizant"]):
            bar = "Mass Tech Recruiter / Digital Track: Core fundamentals in OOP, standard SQL queries, basic DSA (Arrays, Strings, HashMaps), and clear English communication."
            severity = "MODERATE" if "reject" in req.verdict.lower() else "LOW"
        else:
            bar = f"Standard {req.tech_field} Engineering Bar: Evaluates problem decomposition, clean code hygiene, and practical tooling proficiency."
            severity = "HIGH" if "reject" in req.verdict.lower() else "MODERATE"

        lacking_skills: List[LackingSkillDetail] = []
        strengths: List[str] = []

        # 1. DSA & Complexity analysis
        if any(k in q_text for k in ["tree", "graph", "dp", "dynamic programming", "recursion", "complexity", "o(n)", "o(n^2)", "binary search"]):
            lacking_skills.append(LackingSkillDetail(
                skill_name="Algorithmic Optimization & Complexity Analysis",
                severity="CRITICAL_BLOCKER",
                current_demonstrated_level="Intermediate (brute-force or unoptimized recursion)",
                company_benchmark_level="Advanced (optimal time/space bounds with mathematical proof)",
                why_it_matters=f"{req.company_name} evaluates your ability to reduce exponential or quadratic bottlenecks before accepting code.",
                recommended_action="Practice reducing O(N^2) recursive calls using Memoization tables and 2-pointer / window patterns on LeetCode Mediums."
            ))
        else:
            strengths.append("Foundational understanding of core logic structure")

        # 2. Concurrency / Multi-threading
        if any(k in q_text for k in ["thread", "concurren", "sync", "lock", "race condition", "parallel", "deadlock"]):
            lacking_skills.append(LackingSkillDetail(
                skill_name="Concurrency & Thread Safety",
                severity="CRITICAL_BLOCKER",
                current_demonstrated_level="Beginner (theoretical knowledge only)",
                company_benchmark_level="Intermediate-Advanced (understanding thread synchronization, race conditions, atomic operations)",
                why_it_matters=f"High-throughput services at {req.company_name} process concurrent requests; race conditions cause critical data corruption.",
                recommended_action="Implement a thread-safe in-memory cache with reader-writer locks in your backend project to demonstrate practical mastery."
            ))

        # 3. Database & SQL Query Tuning
        if any(k in q_text for k in ["sql", "database", "index", "query", "join", "acid", "postgres", "mysql", "transaction"]):
            lacking_skills.append(LackingSkillDetail(
                skill_name="Database Indexing & Query Optimization",
                severity="MODERATE_GAP",
                current_demonstrated_level="Intermediate (can write CRUD & standard joins)",
                company_benchmark_level="Advanced (B-Tree indexes, execution plans, transaction isolation levels)",
                why_it_matters=f"{req.tech_field} roles require knowing why a query executes a full-table scan and how composite indexes prevent DB lag.",
                recommended_action="Review EXPLAIN ANALYZE on PostgreSQL, understand composite index column ordering, and practice normalization scenarios."
            ))
        else:
            strengths.append("Comfortable with relational data models")

        # 4. System Design / Architecture / Frameworks
        if any(k in q_text for k in ["spring", "api", "rest", "microservice", "cache", "redis", "kafka", "scalab", "system design", "architecture"]):
            lacking_skills.append(LackingSkillDetail(
                skill_name="Distributed System Components & Caching",
                severity="MODERATE_GAP",
                current_demonstrated_level="Intermediate (basic endpoint wiring)",
                company_benchmark_level="Advanced (Cache invalidation strategies, Redis TTL, message queues, stateless token auth)",
                why_it_matters=f"Interviewers want to see how you protect backend databases using cache-aside patterns and asynchronous task queuing.",
                recommended_action="Build a small proof-of-concept integrating Redis caching with automated invalidation on DB updates."
            ))

        # 5. Communication & Problem Clarification
        if any(k in q_text for k in ["nervous", "stuck", "pressure", "explain", "clarify", "communication", "time ran out", "blank"]):
            lacking_skills.append(LackingSkillDetail(
                skill_name="Structured Technical Communication (Thinking Out Loud)",
                severity="MODERATE_GAP",
                current_demonstrated_level="Hesitant when faced with novel constraints",
                company_benchmark_level="Methodical (clarify inputs, state assumptions, walk through test cases before writing code)",
                why_it_matters=f"Interviewers at {req.company_name} score candidate collaboration. Rushing into code without clarifying edge cases leads to silent disqualification.",
                recommended_action="Do 3 timed peer mock interviews practicing the 4-step framework: (1) Clarify Edge Cases (2) State Brute Force (3) Optimize (4) Dry Run."
            ))

        # Default fallback if question text is brief
        if not lacking_skills:
            lacking_skills.append(LackingSkillDetail(
                skill_name=f"{req.tech_field} Core Depth & Edge-Case Handling",
                severity="CRITICAL_BLOCKER",
                current_demonstrated_level="Proficient on standard examples, weak on edge cases",
                company_benchmark_level="Robust handling of nulls, boundary constraints, and memory limits",
                why_it_matters=f"{req.company_name} focuses heavily on edge-case robustness during the {req.stage} evaluation.",
                recommended_action="Conduct targeted problem-solving focusing specifically on boundary conditions and constraint analysis."
            ))
            lacking_skills.append(LackingSkillDetail(
                skill_name="Systematic Time Complexity Trade-Offs",
                severity="MODERATE_GAP",
                current_demonstrated_level="Intermediate",
                company_benchmark_level="Fluent explanation of memory vs CPU trade-offs",
                why_it_matters="Interviewers expect candidates to proactively propose alternate data structures to save memory.",
                recommended_action="Write down Big-O space and time complexities for every function in your portfolio projects."
            ))

        recovery_roadmap = [
            {"day": "Day 1-2", "focus": "Deep-Dive into Missing Topics", "action": f"Re-solve the exact questions faced in the {req.company_name} interview from scratch without looking at solutions."},
            {"day": "Day 3-4", "focus": "Constraint & Edge-Case Drills", "action": "Practice 10 variations focusing on constraints where naive approaches time out."},
            {"day": "Day 5-6", "focus": "Portfolio Evidence Reinforcement", "action": "Update your GitHub project to incorporate the lacking architectural pattern (caching, thread safety, or indexing)."},
            {"day": "Day 7", "focus": "Verification Diagnostic Test", "action": "Take a timed skill assessment on Placement IQ to verify that your confidence has officially crossed the benchmark."},
        ]

        summary = (
            f"Analysis of your {req.company_name} ({req.tech_field} — {req.stage}) performance indicates that while your "
            f"base foundation is solid, you experienced blockers in {len(lacking_skills)} key areas. "
            f"Addressing these high-leverage gaps will transform borderline/rejected evaluations into strong hiring recommendations."
        )

        return ResultAnalysisResponse(
            company_name=req.company_name,
            tech_field=req.tech_field,
            stage=req.stage,
            verdict=req.verdict,
            overall_gap_severity=severity,
            company_hiring_bar_summary=bar,
            analysis_summary=summary,
            lacking_skills=lacking_skills,
            strengths_identified=strengths if strengths else ["Active willingness to diagnose mistakes", "Strong baseline programming language syntax"],
            recovery_roadmap=recovery_roadmap,
            estimated_readiness_impact="+7 to +10 points increase upon completing recovery roadmap"
        )
