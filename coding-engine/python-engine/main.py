from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import tempfile
import os

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


@app.post("/execute")
def execute_code(request: CodeRequest):
    results = []

    for test_case in request.testCases:
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = os.path.join(
                temp_dir,
                "solution.py",
            )

            with open(
                file_path,
                "w",
                encoding="utf-8",
            ) as file:
                file.write(request.code)

            try:
                process = subprocess.run(
                    ["python", file_path],
                    input=test_case.input,
                    text=True,
                    capture_output=True,
                    timeout=2,
                    cwd=temp_dir,
                )

                actual_output = process.stdout.strip()
                expected_output = (
                    test_case.expectedOutput.strip()
                )

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

                results.append(
                    {
                        "passed": actual_output
                        == expected_output,
                        "status": (
                            "accepted"
                            if actual_output
                            == expected_output
                            else "wrong_answer"
                        ),
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

    passed = sum(
        1 for result in results if result["passed"]
    )

    total = len(results)

    return {
        "success": True,
        "status": (
            "accepted"
            if total > 0 and passed == total
            else "wrong_answer"
        ),
        "passedTests": passed,
        "totalTests": total,
        "results": results,
    }