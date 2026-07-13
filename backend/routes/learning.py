from fastapi import APIRouter
from pydantic import BaseModel

from learning.quiz import generate_quiz
from learning.flashcards import generate_flashcards
from learning.revision import generate_revision
from learning.exercise import generate_exercise
from learning.interview import generate_interview
from learning.analogy import generate_analogy
from learning.examples import generate_examples

router = APIRouter(prefix="/learning")


class LearningRequest(BaseModel):
    question: str
    answer: str


@router.post("/quiz")
def get_quiz(request: LearningRequest):
    res = generate_quiz(request.question, request.answer)
    return {"type": "quiz", "data": res}


@router.post("/flashcards")
def get_flashcards(request: LearningRequest):
    res = generate_flashcards(request.question, request.answer)
    return {"type": "flashcards", "data": res}


@router.post("/revision")
def get_revision(request: LearningRequest):
    res = generate_revision(request.question, request.answer)
    return {"type": "revision", "data": res}


@router.post("/exercise")
def get_exercise(request: LearningRequest):
    res = generate_exercise(request.question, request.answer)
    return {"type": "exercise", "data": res}


@router.post("/interview")
def get_interview(request: LearningRequest):
    res = generate_interview(request.question, request.answer)
    return {"type": "interview", "data": res}


@router.post("/analogy")
def get_analogy(request: LearningRequest):
    res = generate_analogy(request.question, request.answer)
    return {"type": "analogy", "data": res}


@router.post("/examples")
def get_examples(request: LearningRequest):
    res = generate_examples(request.question, request.answer)
    return {"type": "examples", "data": res}