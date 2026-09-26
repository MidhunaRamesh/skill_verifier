from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict

# ============================================================
# IMPORT AGENTS 1 - 5
# ============================================================

from agents.task_generator import generate_task
from agents.submission_evaluator import evaluate_submission
from agents.reasoning_agent import evaluate_reasoning
from agents.verification_agent import verify_submission
from agents.coordinator_agent import coordinate_decision


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Skill Verifier API",
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

class GenerateTaskRequest(BaseModel):
    skill: str = "Python"
    difficulty: str = "Intermediate"


class EvaluateRequest(BaseModel):
    task: Dict[str, Any]
    code: str
    explanation: str
    attempt: int = 1


# ============================================================
# SIMPLE SKILL SUMMARY GENERATOR
# ============================================================

def create_skill_summary(
    code_result,
    reasoning_result,
    verification_result
):

    # --------------------------------------------------------
    # GET RESULTS
    # --------------------------------------------------------

    code_score = code_result.get(
        "score",
        0
    )

    reasoning_score = reasoning_result.get(
        "score",
        0
    )

    passed = code_result.get(
        "passed",
        0
    )

    total = code_result.get(
        "total",
        0
    )

    verification_status = verification_result.get(
        "status",
        "UNKNOWN"
    )


    # --------------------------------------------------------
    # DETERMINE SKILL LEVEL
    # --------------------------------------------------------

    if (
        code_score >= 80
        and reasoning_score >= 80
        and verification_status == "VERIFIED"
    ):

        skill_level = "Strong"

    elif (
        code_score >= 50
        and reasoning_score >= 50
    ):

        skill_level = "Moderate"

    else:

        skill_level = "Needs Improvement"


    # --------------------------------------------------------
    # DETERMINE PROBLEM SOLVING
    # --------------------------------------------------------

    if code_score >= 80:

        problem_solving = "Strong"

    elif code_score >= 50:

        problem_solving = "Moderate"

    else:

        problem_solving = "Needs Improvement"


    # --------------------------------------------------------
    # DETERMINE REASONING
    # --------------------------------------------------------

    if reasoning_score >= 80:

        reasoning_level = "Strong"

    elif reasoning_score >= 50:

        reasoning_level = "Moderate"

    else:

        reasoning_level = "Needs Improvement"


    # --------------------------------------------------------
    # STRENGTHS
    # --------------------------------------------------------

    strengths = []

    if code_score >= 80:
        strengths.append(
            "Good practical coding ability"
        )

    if reasoning_score >= 80:
        strengths.append(
            "Strong understanding of the solution"
        )

    if passed == total and total > 0:
        strengths.append(
            "Successfully passed all test cases"
        )

    if len(strengths) == 0:
        strengths.append(
            "Completed the practical coding evaluation"
        )


    # --------------------------------------------------------
    # AREAS TO IMPROVE
    # --------------------------------------------------------

    areas_to_improve = []

    if code_score < 80:
        areas_to_improve.append(
            "Improve coding problem-solving skills"
        )

    if reasoning_score < 80:
        areas_to_improve.append(
            "Improve explanation and reasoning"
        )

    if passed < total:
        areas_to_improve.append(
            "Practice more test cases and edge cases"
        )

    if len(areas_to_improve) == 0:
        areas_to_improve.append(
            "Continue practicing advanced programming problems"
        )


    # --------------------------------------------------------
    # SUMMARY
    # --------------------------------------------------------

    if skill_level == "Strong":

        summary = (
            "The candidate demonstrated strong practical "
            "programming and reasoning skills."
        )

    elif skill_level == "Moderate":

        summary = (
            "The candidate demonstrated moderate practical "
            "programming ability with scope for improvement."
        )

    else:

        summary = (
            "The candidate needs more practice in practical "
            "programming and problem solving."
        )


    # --------------------------------------------------------
    # RETURN SKILL SUMMARY
    # --------------------------------------------------------

    return {

        "skill": "Python",

        "code_score": code_score,

        "reasoning_score": reasoning_score,

        "tests_passed": f"{passed}/{total}",

        "verification_status": verification_status,

        "skill_level": skill_level,

        "problem_solving": problem_solving,

        "reasoning": reasoning_level,

        "strengths": strengths,

        "areas_to_improve": areas_to_improve,

        "summary": summary
    }


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {

        "message": "Skill Verifier API is running",

        "version": "5-AGENT-SKILL-SUMMARY",

        "agents": 5,

        "skill_summary": "enabled"
    }


# ============================================================
# AGENT 1 — TASK GENERATOR
# ============================================================

@app.post("/generate-task")
def generate_task_endpoint(
    request: GenerateTaskRequest
):

    try:

        task = generate_task(
            skill=request.skill,
            difficulty=request.difficulty
        )

        return {
            "task": task
        }

    except Exception as error:

        print("\nAGENT 1 ERROR:")
        print(str(error))

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# EVALUATION PIPELINE
# ============================================================

@app.post("/evaluate")
def evaluate_endpoint(
    data: EvaluateRequest
):

    print("\n")
    print("================================================")
    print("STARTING SKILL VERIFICATION PIPELINE")
    print("================================================")


    # ========================================================
    # AGENT 2 — SUBMISSION EVALUATOR
    # ========================================================

    print("\n")
    print("##############################################")
    print("AGENT 2 — SUBMISSION EVALUATOR")
    print("##############################################")

    try:

        code_result = evaluate_submission(
            task=data.task,
            code=data.code
        )

        print("AGENT 2 RESULT:")
        print(code_result)

    except Exception as error:

        print("AGENT 2 ERROR:")
        print(str(error))

        code_result = {

            "score": 0,

            "passed": 0,

            "total": 0,

            "status": "FAILED",

            "message": str(error)
        }


    # ========================================================
    # AGENT 3 — REASONING AGENT
    # ========================================================

    print("\n")
    print("##############################################")
    print("AGENT 3 — REASONING AGENT")
    print("##############################################")

    try:

        reasoning_result = evaluate_reasoning(
            task=data.task,
            code=data.code,
            explanation=data.explanation
        )

        print("AGENT 3 RESULT:")
        print(reasoning_result)

    except Exception as error:

        print("AGENT 3 ERROR:")
        print(str(error))

        reasoning_result = {

            "score": 0,

            "understanding": "WEAK",

            "feedback": str(error)
        }


    # ========================================================
    # AGENT 4 — VERIFICATION AGENT
    # ========================================================

    print("\n")
    print("##############################################")
    print("AGENT 4 — VERIFICATION AGENT")
    print("##############################################")

    try:

        verification_result = verify_submission(
            code_result,
            reasoning_result
        )

        print("AGENT 4 RESULT:")
        print(verification_result)

    except Exception as error:

        print("AGENT 4 ERROR:")
        print(str(error))

        verification_result = {

            "status": "NEW_TASK",

            "reason": str(error)
        }


    # ========================================================
    # AGENT 5 — COORDINATOR
    # ========================================================

    print("\n")
    print("##############################################")
    print("AGENT 5 — COORDINATOR / NEGOTIATOR")
    print("##############################################")

    try:

        coordinator_result = coordinate_decision(
            verification_result=verification_result,
            code_result=code_result,
            reasoning_result=reasoning_result,
            attempt=data.attempt
        )

        print("AGENT 5 RESULT:")
        print(coordinator_result)

    except Exception as error:

        print("AGENT 5 ERROR:")
        print(str(error))

        coordinator_result = {

            "decision": "NEW_TASK",

            "next_action": "Generate a new practical task",

            "reason": str(error)
        }


    # ========================================================
    # FINAL DECISION
    # ========================================================

    decision = (

        coordinator_result.get(
            "decision"
        )

        or coordinator_result.get(
            "status"
        )

        or verification_result.get(
            "status"
        )

        or "NEW_TASK"
    )


    print("\n")
    print("==============================================")
    print("FINAL DECISION")
    print("==============================================")

    print(decision)


    # ========================================================
    # NEXT TASK
    # ========================================================

    next_task = None


    if decision in [
        "RETEST",
        "NEW_TASK"
    ]:

        try:

            next_task = generate_task(
                skill="Python",
                difficulty=data.task.get(
                    "difficulty",
                    "Intermediate"
                )
            )

            print("\nNEXT TASK GENERATED:")
            print(next_task)

        except Exception as error:

            print("\nNEXT TASK ERROR:")
            print(str(error))

            next_task = None


    # ========================================================
    # SKILL SUMMARY GENERATOR
    # ========================================================

    print("\n")
    print("##############################################")
    print("SKILL SUMMARY GENERATOR")
    print("##############################################")


    try:

        skill_summary = create_skill_summary(
            code_result,
            reasoning_result,
            verification_result
        )

        print("\nSKILL SUMMARY CREATED:")
        print(skill_summary)

    except Exception as error:

        print("\nSKILL SUMMARY ERROR:")
        print(str(error))

        skill_summary = {

            "skill": "Python",

            "code_score": code_result.get(
                "score",
                0
            ),

            "reasoning_score": reasoning_result.get(
                "score",
                0
            ),

            "tests_passed": (
                str(
                    code_result.get(
                        "passed",
                        0
                    )
                )
                + "/"
                + str(
                    code_result.get(
                        "total",
                        0
                    )
                )
            ),

            "verification_status": verification_result.get(
                "status",
                "UNKNOWN"
            ),

            "skill_level": "Moderate",

            "problem_solving": "Moderate",

            "reasoning": "Moderate",

            "strengths": [
                "Completed the practical coding evaluation."
            ],

            "areas_to_improve": [
                "Continue practicing programming problems."
            ],

            "summary": (
                "The candidate completed the "
                "practical skill evaluation."
            )
        }


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    final_response = {

        # Agent 2
        "code_evaluation": code_result,

        # Agent 3
        "reasoning_evaluation": reasoning_result,

        # Agent 4
        "verification": verification_result,

        # Agent 5
        "coordinator": coordinator_result,

        # New task if required
        "next_task": next_task,

        # Skill Summary
        "skill_summary": skill_summary
    }


    # ========================================================
    # DEBUG
    # ========================================================

    print("\n")
    print("================================================")
    print("FINAL RESPONSE")
    print("================================================")

    print(final_response)

    print("\nFINAL RESPONSE KEYS:")
    print(list(final_response.keys()))

    print("\nHAS SKILL SUMMARY:")
    print(
        "skill_summary"
        in final_response
    )

    print("================================================")
    print("PIPELINE COMPLETED")
    print("================================================")


    return final_response