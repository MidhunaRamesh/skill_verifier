from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.task_generator import generate_task
from agents.submission_evaluator import evaluate_submission


app = FastAPI()


# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Submission(BaseModel):
    task: dict
    code: str


@app.get("/")
def home():
    return {"message": "Skill Verifier API is running"}


@app.get("/generate-task")
def get_task():

    task = generate_task(
        "Python",
        "Intermediate",
        "Functions"
    )

    return task


@app.post("/evaluate")
def evaluate(data: Submission):

    result = evaluate_submission(
        data.task,
        data.code
    )

    return result