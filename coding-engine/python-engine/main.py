from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import tempfile
import os
import sys
import re
import ast

app = FastAPI(
    title="Placement Platform Python Engine",
    version="1.0.0",
)


class TestCase(BaseModel):
    input: str
    expectedOutput: str


class CodeRequest(BaseModel):
    code: str
    testCases: list[TestCase]


@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "Python coding engine is running",
    }


def parse_input(raw_input: str):
    """
    Converts different DSA input formats into Python arguments.

    Supported:

    [1, 2, 3, 4, 5], 2

    arr[] = [1, 2, 3, 4, 5], d = 2

    arr = [1, 2, 3, 4, 5], d = 2

    [1, 2, 3, 4, 5]
    """

    raw_input = raw_input.strip()

    if not raw_input:
        return ()

    cleaned_input = raw_input

    # Remove "Input:" prefix
    cleaned_input = re.sub(
        r"^\s*(Input|input)\s*:\s*",
        "",
        cleaned_input,
    )

    # Convert:
    # arr[] = [1, 2, 3], d = 2
    #
    # into:
    # [1, 2, 3], 2
    cleaned_input = re.sub(
        r"\b[A-Za-z_]\w*\[\]\s*=\s*",
        "",
        cleaned_input,
    )

    # Remove normal variable assignments:
    # d = 2
    # n = 5
    # arr = [...]
    cleaned_input = re.sub(
        r"\b[A-Za-z_]\w*\s*=\s*",
        "",
        cleaned_input,
    )

    cleaned_input = cleaned_input.strip()

    # Try multiple arguments
    try:
        args = ast.literal_eval("(" + cleaned_input + ",)")

        if not isinstance(args, tuple):
            args = (args,)

        return args

    except Exception:
        pass

    # Try single argument
    try:
        value = ast.literal_eval(cleaned_input)
        return (value,)

    except Exception:
        raise Exception("Invalid test case input: " + raw_input)


def create_runner(code: str):
    """
    Creates a runner for DSA code.

    Supports:
        class Solution:
            def method(...):
                ...
    """

    runner = f"""
{code}

import ast
import sys
import inspect
import re


def __parse_input(raw_input):

    raw_input = raw_input.strip()

    if not raw_input:
        return ()

    # Remove Input: prefix
    raw_input = re.sub(
        r"^\\s*(Input|input)\\s*:\\s*",
        "",
        raw_input
    ).strip()

    # -------------------------------------------------
    # FORMAT:
    # arr[] = [1, 2, 3, 4, 5], d = 2
    # -------------------------------------------------

    match = re.match(
        r"^\\s*[A-Za-z_]\\w*\\[\\]\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*,\\s*[A-Za-z_]\\w*\\s*=\\s*(.+?)\\s*$",
        raw_input
    )

    if match:

        array_value = match.group(1)
        second_value = match.group(2)

        try:

            arr = ast.literal_eval(
                array_value
            )

            value = ast.literal_eval(
                second_value
            )

            return (arr, value)

        except Exception:

            raise Exception(
                "Invalid named test case input: "
                + raw_input
            )

    # -------------------------------------------------
    # FORMAT:
    # arr = [1, 2, 3], d = 2
    # -------------------------------------------------

    match = re.match(
        r"^\\s*[A-Za-z_]\\w*\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*,\\s*[A-Za-z_]\\w*\\s*=\\s*(.+?)\\s*$",
        raw_input
    )

    if match:

        array_value = match.group(1)
        second_value = match.group(2)

        try:

            arr = ast.literal_eval(
                array_value
            )

            value = ast.literal_eval(
                second_value
            )

            return (arr, value)

        except Exception:

            raise Exception(
                "Invalid named test case input: "
                + raw_input
            )

    # -------------------------------------------------
    # STANDARD FORMAT:
    # [1, 2, 3, 4, 5], 2
    # -------------------------------------------------

    try:

        args = ast.literal_eval(
            "(" + raw_input + ",)"
        )

        if isinstance(args, tuple):
            return args

    except Exception:
        pass

    # -------------------------------------------------
    # SINGLE VALUE:
    # [1, 2, 3]
    # -------------------------------------------------

    try:

        value = ast.literal_eval(
            raw_input
        )

        return (value,)

    except Exception:

        raise Exception(
            "Invalid test case input: "
            + raw_input
        )


def __run_solution():

    solution = Solution()

    # Find public methods
    methods = [
        name
        for name, value in inspect.getmembers(
            solution,
            predicate=inspect.ismethod
        )
        if not name.startswith("_")
    ]

    if not methods:

        raise Exception(
            "No solution method found"
        )

    # Use first public method
    method = getattr(
        solution,
        methods[0]
    )

    raw_input = sys.stdin.read()

    args = __parse_input(
        raw_input
    )

    # Execute solution
    result = method(
        *args
    )

    # Handle in-place operations
    if result is None and args:

        result = args[0]

    # Format output
    if isinstance(result, list):

        print(result)

    elif isinstance(result, tuple):

        print(list(result))

    else:

        print(result)


__run_solution()
"""

    return runner


@app.post("/execute")
def execute_code(request: CodeRequest):

    results = []

    for test_case in request.testCases:

        with tempfile.TemporaryDirectory() as temp_dir:

            file_path = os.path.join(
                temp_dir,
                "solution.py",
            )

            runner_code = create_runner(request.code)

            with open(
                file_path,
                "w",
                encoding="utf-8",
            ) as file:

                file.write(runner_code)

            try:

                process = subprocess.run(
                    [
                        sys.executable,
                        file_path,
                    ],
                    input=test_case.input,
                    text=True,
                    capture_output=True,
                    timeout=2,
                    cwd=temp_dir,
                )

                actual_output = process.stdout.strip()

                expected_output = test_case.expectedOutput.strip()

                # Runtime error
                if process.returncode != 0:

                    results.append(
                        {
                            "passed": False,
                            "status": "runtime_error",
                            "input": test_case.input,
                            "expectedOutput": expected_output,
                            "actualOutput": process.stderr.strip(),
                        }
                    )

                    continue

                # Compare output
                passed = actual_output == expected_output

                results.append(
                    {
                        "passed": passed,
                        "status": ("accepted" if passed else "wrong_answer"),
                        "input": test_case.input,
                        "expectedOutput": expected_output,
                        "actualOutput": actual_output,
                    }
                )

            except subprocess.TimeoutExpired:

                results.append(
                    {
                        "passed": False,
                        "status": "time_limit_exceeded",
                        "input": test_case.input,
                        "expectedOutput": test_case.expectedOutput,
                        "actualOutput": "",
                    }
                )

    passed = sum(1 for result in results if result["passed"])

    total = len(results)

    return {
        "success": True,
        "status": ("accepted" if total > 0 and passed == total else "wrong_answer"),
        "passedTests": passed,
        "totalTests": total,
        "results": results,
    }
