"""
routes/learning_path.py
-----------------------
Two endpoints for the Learning Journey feature.

POST  /learning-path/generate      — generate & save a learning path for a document
GET   /learning-path/{document_id} — retrieve an existing learning path
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.learning_path_service import (
    generate_learning_path,
    get_learning_path,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------


class GeneratePathRequest(BaseModel):
    user_id: str
    document_id: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.post("/learning-path/generate")
def generate_path(request: GeneratePathRequest):
    """
    Generate a Learning Journey for a specific uploaded document.

    Flow:
        PDF → extract ToC / first pages → LLM → JSON roadmap → enrich → Supabase → response
    """
    result = generate_learning_path(
        user_id=request.user_id,
        document_id=request.document_id,
    )

    if not result.get("success"):
        raise HTTPException(
            status_code=500,
            detail=result.get("message", "Failed to generate learning path."),
        )

    return {
        "success": True,
        "document_id": request.document_id,
        "roadmap": result["roadmap"],
    }


@router.get("/learning-path/{document_id}")
def fetch_learning_path(document_id: str, user_id: str):
    """
    Retrieve an existing Learning Journey for a user + document.

    Query params:
        user_id  (required)
    """
    path = get_learning_path(user_id=user_id, document_id=document_id)

    if not path:
        raise HTTPException(
            status_code=404,
            detail="No learning path found for this document.",
        )

    return {
        "success": True,
        "document_id": document_id,
        "path": path,
    }


class UpdateProgressRequest(BaseModel):
    user_id: str
    document_id: str
    roadmap: dict
    current_topic: str
    next_topic: str
    completed: bool


@router.post("/learning-path/update-progress")
def update_progress(request: UpdateProgressRequest):
    """
    Update topic-level progress in the roadmap JSON and advance active topic status.
    """
    from services.learning_path_service import update_learning_progress
    
    result = update_learning_progress(
        user_id=request.user_id,
        document_id=request.document_id,
        current_topic=request.current_topic,
        next_topic=request.next_topic,
        roadmap=request.roadmap,
        completed=request.completed
    )
    
    if not result:
        raise HTTPException(
            status_code=500,
            detail="Failed to update progress."
        )
        
    return {"success": True, "path": result}

