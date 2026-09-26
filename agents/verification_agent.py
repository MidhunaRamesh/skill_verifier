def verify_skill(code_result, reasoning_result):

    code_score = code_result.get("score", 0)
    reasoning_score = reasoning_result.get("score", 0)

    understanding = reasoning_result.get(
        "understanding", "WEAK"
    )

    tests_passed = code_result.get("passed", 0)
    total_tests = code_result.get("total", 0)

    # Verification decision

    if (
        code_score >= 80
        and reasoning_score >= 70
        and understanding == "STRONG"
        and tests_passed == total_tests
    ):

        status = "VERIFIED"

        feedback = (
            "Practical skill verified. "
            "The solution passed the tests and "
            "the candidate demonstrated strong reasoning."
        )

    elif code_score >= 50 or reasoning_score >= 50:

        status = "RETEST"

        feedback = (
            "Partial skill evidence found. "
            "A retest is recommended to confirm proficiency."
        )

    else:

        status = "NEW TASK"

        feedback = (
            "Skill proficiency could not be verified. "
            "A new practical task is required."
        )

    return {
        "status": status,
        "code_score": code_score,
        "reasoning_score": reasoning_score,
        "tests_passed": tests_passed,
        "total_tests": total_tests,
        "understanding": understanding,
        "feedback": feedback
    }