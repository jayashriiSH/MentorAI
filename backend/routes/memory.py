from fastapi import APIRouter, Query
from services.supabase_service import get_user_memory

router = APIRouter()


@router.get("/memory")
def fetch_memory(user_id: str = Query(...)):
    memory = get_user_memory(user_id)
    if memory:
        return {
            "success": True,
            "memory": memory
        }
    return {
        "success": False,
        "message": "No memory found for this user."
    }
