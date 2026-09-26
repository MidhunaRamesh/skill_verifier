from agents.verification_agent import verify_skill


code_result = {
    "score": 100,
    "passed": 5,
    "total": 5
}


reasoning_result = {
    "score": 90,
    "understanding": "STRONG"
}


result = verify_skill(
    code_result,
    reasoning_result
)


print("\n===== VERIFICATION AGENT =====\n")
print(result)