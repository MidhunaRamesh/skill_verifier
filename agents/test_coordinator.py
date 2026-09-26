from agents.coordinator_agent import coordinate


code_result = {
    "score": 75,
    "passed": 3,
    "total": 4
}

reasoning_result = {
    "score": 100,
    "understanding": "STRONG"
}

verification_result = {
    "status": "RETEST"
}


result = coordinate(
    code_result,
    reasoning_result,
    verification_result
)


print("\n===== COORDINATOR AGENT =====\n")
print(result)