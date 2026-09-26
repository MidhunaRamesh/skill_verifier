from agents.submission_evaluator import evaluate_submission
import json


if __name__ == "__main__":

    task = {
        "title": "Sort List by Frequency",

        "description": """
Write a Python function `sort_by_frequency(nums)` that receives
a list of integers and returns a new list where the integers are
ordered by increasing frequency. If two numbers have the same
frequency, the smaller number should come first.
""",

        "test_cases": [
            {
                "input": "[1, 2, 2, 3, 3, 3]",
                "expected_output": "[1, 2, 2, 3, 3, 3]"
            },
            {
                "input": "[4, 4, 4, 6, 6, 5]",
                "expected_output": "[5, 6, 6, 4, 4, 4]"
            },
            {
                "input": "[]",
                "expected_output": "[]"
            },
            {
                "input": "[7, 7, 8, 8, 9]",
                "expected_output": "[9, 7, 7, 8, 8]"
            },
            {
                "input": "[10, 9, 8, 7]",
                "expected_output": "[7, 8, 9, 10]"
            }
        ]
    }


    print("\n===== TEST TASK =====\n")
    print(json.dumps(task, indent=4))


    # Sample user submission
    code = """
def sort_by_frequency(nums):

    freq = {}

    for n in nums:
        freq[n] = freq.get(n, 0) + 1

    return sorted(nums, key=lambda x: (freq[x], x))
"""


    # Agent 2 evaluation
    result = evaluate_submission(task, code)


    print("\n===== AGENT 2 EVALUATION =====\n")
    print(json.dumps(result, indent=4))