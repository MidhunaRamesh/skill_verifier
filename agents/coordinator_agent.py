def coordinate(code_result, reasoning_result, verification_result, attempt=1):

    code_score = code_result.get("score", 0)
    reasoning_score = reasoning_result.get("score", 0)

    tests_passed = code_result.get("passed", 0)
    total_tests = code_result.get("total", 0)

    understanding = reasoning_result.get(
        "understanding",
        "WEAK"
    )

    verification_status = verification_result.get(
        "status",
        "NEW TASK"
    )


    # =========================
    # VERIFIED
    # =========================

    if (
        verification_status == "VERIFIED"
        and code_score >= 80
        and reasoning_score >= 70
        and tests_passed == total_tests
        and understanding == "STRONG"
    ):

        decision = "VERIFIED"

        next_action = "Assessment completed successfully."

        handoff = "Coordinator → Assessment Complete"


    # =========================
    # RETEST
    # =========================

    elif (
        verification_status == "RETEST"
        and attempt < 3
    ):

        decision = "RETEST"

        next_action = "Generate another practical task."

        handoff = "Coordinator → Task Generator"


    # =========================
    # NEW TASK
    # =========================

    else:

        decision = "NEW TASK"

        next_action = "Generate a new practical task."

        handoff = "Coordinator → Task Generator"


    return {

        "decision": decision,

        "attempt": attempt,

        "code_score": code_score,

        "reasoning_score": reasoning_score,

        "tests_passed": tests_passed,

        "total_tests": total_tests,

        "understanding": understanding,

        "next_action": next_action,

        "handoff": handoff,

        "coordinator_message":
            "Coordinator analyzed the outputs of "
            "the Code Evaluator, Reasoning Agent, "
            "and Verification Agent."

    }