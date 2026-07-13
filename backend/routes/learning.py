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


class LessonRequest(BaseModel):
    topic: str
    document_id: str


from services.retriever import retrieve_document_context
from services.supabase_service import supabase
from learning.lesson import generate_lesson

@router.post("/lesson")
def get_lesson(request: LessonRequest):
    try:
        # Fetch document filename
        doc_res = supabase.table("documents").select("filename").eq("id", request.document_id).single().execute()
        if not doc_res.data:
            return {"success": False, "message": "Document not found."}
        
        filename = doc_res.data["filename"]
        
        # Retrieve context from vector db
        docs = retrieve_document_context(request.topic, filename, k=4)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        if not context.strip():
            # If no context found, fall back to first page
            context = f"Topic: {request.topic}. Study guide for {filename}."

        res = generate_lesson(request.topic, context)
        return res
    except Exception as e:
        print("Error generating lesson:", e)
        return {"success": False, "message": str(e)}
