from agents.reasoning_agent import evaluate_reasoning


task = {
    "description": """
    Write a Python function product_except_self(nums)
    that returns the product of all elements except itself.
    Do not use division.
    """
}


code = """
def product_except_self(nums):

    result = [1] * len(nums)

    left = 1

    for i in range(len(nums)):
        result[i] = left
        left *= nums[i]

    right = 1

    for i in range(len(nums) - 1, -1, -1):
        result[i] *= right
        right *= nums[i]

    return result
"""


explanation = """
I use two passes.
The first pass stores the product of all elements
to the left of each position.
The second pass multiplies it with the product
of all elements to the right.
This avoids division and takes O(n) time.
"""


result = evaluate_reasoning(
    task,
    code,
    explanation
)

print("\n===== REASONING AGENT =====\n")
print(result)