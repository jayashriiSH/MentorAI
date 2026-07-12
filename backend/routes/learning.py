from fastapi import APIRouter
from pydantic import BaseModel

from learning.quiz import generate_quiz

router = APIRouter()


class LearningRequest(BaseModel):
    action: str
    question: str
    answer: str


@router.post("/learning")
def learning(request: LearningRequest):

    if request.action == "quiz":

        quiz = generate_quiz(
            request.question,
            request.answer,
        )

        return {
            "type": "quiz",
            "data": quiz,
        }

    return {
        "type": "unknown"
    }