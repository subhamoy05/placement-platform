from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
import time

app = FastAPI(
    title="Placement Platform SQL Engine",
    version="1.0.0",
)


class SQLRequest(BaseModel):
    schema: str
    sampleData: str
    query: str


def create_database(schema: str, sample_data: str):
    connection = sqlite3.connect(":memory:")

    cursor = connection.cursor()

    cursor.executescript(schema)
    cursor.executescript(sample_data)

    return connection


def execute_query(connection, query: str):
    cursor = connection.cursor()

    start_time = time.perf_counter()

    cursor.execute(query)

    rows = cursor.fetchall()
    columns = [
        description[0]
        for description in cursor.description
    ]

    execution_time = (
        time.perf_counter() - start_time
    ) * 1000

    return columns, rows, execution_time


@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "SQL engine is running",
    }


@app.post("/execute")
def execute_sql(request: SQLRequest):
    connection = None

    try:
        connection = create_database(
            request.schema,
            request.sampleData,
        )

        columns, rows, execution_time = execute_query(
            connection,
            request.query,
        )

        return {
            "success": True,
            "columns": columns,
            "rows": rows,
            "executionTime": round(
                execution_time,
                2,
            ),
        }

    except sqlite3.Error as error:
        return {
            "success": False,
            "error": str(error),
        }

    finally:
        if connection:
            connection.close()