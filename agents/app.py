from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict

# ============================================================
# AGENTS 1 - 5
# ============================================================

from agents.task_generator import generate_task
from agents.submission_evaluator import evaluate_submission
from agents.reasoning_agent import evaluate_reasoning
from agents.verification_agent import verify_skill
from agents.coordinator_agent import coordinate


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI Skill Verifier",
    description="AI-powered practical skill verification system",
    version="5-AGENT-SKILL-SUMMARY"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

class TaskRequest(BaseModel):
    skill: str = "Python"
    difficulty: str = "medium"


class EvaluateRequest(BaseModel):
    task: Dict[str, Any]
    code: str
    explanation: str
    attempt: int = 1


# ============================================================
# SKILL SUMMARY GENERATOR
# This is NOT Agent 6.
# It is a simple rule-based function.
# ============================================================

def create_skill_summary(
    code_result: Dict[str, Any],
    reasoning_result: Dict[str, Any],
    verification_result: Dict[str, Any]
):

    code_score = code_result.get("score", 0)
    reasoning_score = reasoning_result.get("score", 0)

    tests_passed = code_result.get("passed", 0)
    total_tests = code_result.get("total", 0)

    understanding = reasoning_result.get(
        "understanding",
        "WEAK"
    )

    status = verification_result.get(
        "status",
        "UNKNOWN"
    )

    # --------------------------------------------------------
    # SKILL LEVEL
    # --------------------------------------------------------

    if status == "VERIFIED":
        skill_level = "PROFICIENT"

    elif status == "RETEST":
        skill_level = "DEVELOPING"

    else:
        skill_level = "NEEDS IMPROVEMENT"

    # --------------------------------------------------------
    # TEST PERCENTAGE
    # --------------------------------------------------------

    if total_tests > 0:
        test_percentage = round(
            (tests_passed / total_tests) * 100
        )
    else:
        test_percentage = 0

    # --------------------------------------------------------
    # STRENGTHS
    # --------------------------------------------------------

    strengths = []

    if code_score >= 80:
        strengths.append(
            "Strong coding performance"
        )

    if reasoning_score >= 70:
        strengths.append(
            "Good problem-solving reasoning"
        )

    if understanding == "STRONG":
        strengths.append(
            "Strong understanding of the solution"
        )

    if (
        total_tests > 0
        and tests_passed == total_tests
    ):
        strengths.append(
            "All test cases passed"
        )

    if not strengths:
        strengths.append(
            "Basic understanding demonstrated"
        )

    # --------------------------------------------------------
    # AREAS TO IMPROVE
    # --------------------------------------------------------

    improvements = []

    if code_score < 80:
        improvements.append(
            "Improve coding accuracy"
        )

    if reasoning_score < 70:
        improvements.append(
            "Improve explanation and reasoning"
        )

    if understanding != "STRONG":
        improvements.append(
            "Strengthen understanding of the solution"
        )

    if (
        total_tests > 0
        and tests_passed < total_tests
    ):
        improvements.append(
            "Handle more test cases correctly"
        )

    # --------------------------------------------------------
    # FINAL SUMMARY
    # --------------------------------------------------------

    return {
        "skill_level": skill_level,
        "verification_status": status,
        "code_score": code_score,
        "reasoning_score": reasoning_score,
        "tests_passed": tests_passed,
        "total_tests": total_tests,
        "test_percentage": test_percentage,
        "understanding": understanding,
        "strengths": strengths,
        "areas_to_improve": improvements
    }


# ============================================================
# HOME / HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Skill Verifier API is running",
        "version": "5-AGENT-SKILL-SUMMARY",
        "agents": 5,
        "agent1": "Task Generator",
        "agent2": "Submission Evaluator",
        "agent3": "Reasoning Agent",
        "agent4": "Verification",
        "agent5": "Coordinator",
        "skill_summary": "enabled"
    }


# ============================================================
# AGENT 1 - TASK GENERATOR
# ============================================================

@app.post("/generate-task")
def generate_new_task(request: TaskRequest):

    try:

        task = generate_task(
            skill=request.skill,
            level=request.difficulty,
            topic=request.skill
        )

        return {
            "agent": "Agent 1 - Task Generator",
            "task": task
        }

    except Exception as e:

        print("ERROR IN AGENT 1:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Task generation failed: {str(e)}"
        )


# ============================================================
# AGENTS 2 - 5
# COMPLETE EVALUATION
# ============================================================

@app.post("/evaluate")
def evaluate(request: EvaluateRequest):

    try:

        print("\n========================================")
        print("STARTING SKILL EVALUATION")
        print("========================================")


        # ====================================================
        # AGENT 2
        # SUBMISSION EVALUATOR
        # ====================================================

        print("\n[AGENT 2] Evaluating code...")

        code_result = evaluate_submission(
            request.task,
            request.code
        )

        print("[AGENT 2] Result:")
        print(code_result)


        # ====================================================
        # AGENT 3
        # REASONING AGENT
        # ====================================================

        print("\n[AGENT 3] Evaluating reasoning...")

        reasoning_result = evaluate_reasoning(
            request.task,
            request.code,
            request.explanation
        )

        print("[AGENT 3] Result:")
        print(reasoning_result)


        # ====================================================
        # AGENT 4
        # VERIFICATION
        #
        # IMPORTANT:
        # Actual function in verification_agent.py:
        #
        # verify_skill(code_result, reasoning_result)
        # ====================================================

        print("\n[AGENT 4] Verifying skill...")

        verification_result = verify_skill(
            code_result,
            reasoning_result
        )

        print("[AGENT 4] Result:")
        print(verification_result)


        # ====================================================
        # AGENT 5
        # COORDINATOR
        # ====================================================

        print("\n[AGENT 5] Coordinating decision...")

        coordinator_result = coordinate(
            code_result,
            reasoning_result,
            verification_result,
            request.attempt
        )

        print("[AGENT 5] Result:")
        print(coordinator_result)


        # ====================================================
        # NEXT TASK
        # ====================================================

        next_task = None

        verification_status = verification_result.get(
            "status",
            ""
        )

        if verification_status in [
            "RETEST",
            "NEW TASK"
        ]:

            print("\nGenerating next task...")

            try:

                next_task = generate_task(
                    skill=request.task.get("skill", "Python"),
                    level=request.task.get("difficulty", "medium"),
                    topic=request.task.get("skill", "Python")
                )

            except Exception as e:

                print(
                    "NEXT TASK GENERATION ERROR:",
                    str(e)
                )

                next_task = None


        # ====================================================
        # SKILL SUMMARY
        #
        # NOT AN AI AGENT
        # ====================================================

        print("\n[SKILL SUMMARY] Creating summary...")

        skill_summary = create_skill_summary(
            code_result,
            reasoning_result,
            verification_result
        )

        print("[SKILL SUMMARY] Result:")
        print(skill_summary)


        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        print("\n========================================")
        print("EVALUATION COMPLETED")
        print("========================================\n")

        return {

            "code_evaluation": code_result,

            "reasoning_evaluation": reasoning_result,

            "verification": verification_result,

            "coordinator": coordinator_result,

            "next_task": next_task,

            "skill_summary": skill_summary
        }


    except Exception as e:

        print("\n========================================")
        print("EVALUATION ERROR")
        print("========================================")
        print(str(e))
        print("========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Evaluation failed: {str(e)}"
        )


# ============================================================
# RUN DIRECTLY
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )