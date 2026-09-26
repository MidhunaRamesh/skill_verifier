import ast
import multiprocessing
import copy


def run_function(code, function_name, args, queue):

    try:

        namespace = {}

        exec(code, namespace)

        function = namespace[function_name]

        # Keep original input
        original_args = copy.deepcopy(args)

        result = function(*args)

        # Check whether input was modified
        input_unchanged = args == original_args

        queue.put({
            "success": True,
            "result": result,
            "input_unchanged": input_unchanged
        })

    except Exception as e:

        queue.put({
            "success": False,
            "error": str(e)
        })


def get_function_name(task):

    description = task.get("description", "")

    start = description.find("`")

    if start == -1:
        return None

    end = description.find("`", start + 1)

    if end == -1:
        return None

    function_text = description[start + 1:end]

    return function_text.split("(")[0]


def evaluate_submission(task, code):

    test_cases = task["test_cases"]

    results = []

    # Check syntax
    try:

        tree = ast.parse(code)

    except SyntaxError as e:

        return {
            "score": 0,
            "passed": 0,
            "total": len(test_cases),
            "status": "FAILED",
            "error": str(e),
            "results": []
        }

    # Find function
    function_name = get_function_name(task)

    if not function_name:

        return {
            "score": 0,
            "passed": 0,
            "total": len(test_cases),
            "status": "FAILED",
            "error": "Function name not found",
            "results": []
        }

    functions = [
        node.name
        for node in tree.body
        if isinstance(node, ast.FunctionDef)
    ]

    if function_name not in functions:

        return {
            "score": 0,
            "passed": 0,
            "total": len(test_cases),
            "status": "FAILED",
            "error": f"Required function '{function_name}' not found",
            "results": []
        }

    # Run test cases
    for test in test_cases:

        try:

            input_value = ast.literal_eval(
                test["input"]
            )

            expected = ast.literal_eval(
                test["expected_output"]
            )

            if isinstance(input_value, tuple):

                args = input_value

            else:

                args = (input_value,)

            # Create process
            queue = multiprocessing.Queue()

            process = multiprocessing.Process(
                target=run_function,
                args=(
                    code,
                    function_name,
                    copy.deepcopy(args),
                    queue
                )
            )

            process.start()

            # Maximum 3 seconds
            process.join(3)

            if process.is_alive():

                process.terminate()
                process.join()

                results.append({
                    "input": test["input"],
                    "expected": expected,
                    "actual": "TIMEOUT",
                    "passed": False
                })

                continue

            if queue.empty():

                results.append({
                    "input": test["input"],
                    "expected": expected,
                    "actual": "ERROR",
                    "passed": False
                })

                continue

            result = queue.get()

            if not result["success"]:

                results.append({
                    "input": test["input"],
                    "expected": expected,
                    "actual": "ERROR",
                    "passed": False,
                    "error": result["error"]
                })

                continue

            actual = result["result"]

            correct_output = actual == expected

            input_unchanged = result["input_unchanged"]

            passed = correct_output and input_unchanged

            results.append({
                "input": test["input"],
                "expected": expected,
                "actual": actual,
                "output_correct": correct_output,
                "input_unchanged": input_unchanged,
                "passed": passed
            })

        except Exception as e:

            results.append({
                "input": test["input"],
                "expected": test["expected_output"],
                "actual": "ERROR",
                "passed": False,
                "error": str(e)
            })

    # Calculate score
    passed_count = sum(
        1 for result in results
        if result["passed"]
    )

    total = len(results)

    score = (
        passed_count / total * 100
        if total > 0
        else 0
    )

    if score == 100:
        status = "PASSED"

    elif score >= 50:
        status = "PARTIALLY PASSED"

    else:
        status = "FAILED"

    return {
        "function": function_name,
        "score": score,
        "passed": passed_count,
        "total": total,
        "status": status,
        "results": results
    }