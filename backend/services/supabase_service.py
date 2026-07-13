from supabase import create_client

from config import (
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)


def save_document(user_id, filename, pages, chunks):

    data = {
        "user_id": user_id,
        "filename": filename,
        "pages": pages,
        "chunks": chunks,
    }

    try:
        response = (
            supabase
            .table("documents")
            .insert(data)
            .execute()
        )

        return response

    except Exception as e:
        print("Supabase Error:", e)
        return None


def get_user_memory(user_id: str):
    """
    Retrieves the user memory record for a user.
    """
    try:
        response = supabase.table("user_memory").select("*").eq("user_id", user_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print("Supabase get_user_memory Error:", e)
        return None


def update_user_memory(user_id: str, summary: str, strengths: str, weak_topics: str, learning_style: str = None):
    """
    Upserts the user memory record.
    """
    try:
        data = {
            "user_id": user_id,
            "summary": summary,
            "strengths": strengths,
            "weak_topics": weak_topics,
        }
        if learning_style:
            data["learning_style"] = learning_style

        # We check if a memory already exists to perform update, otherwise insert
        existing = get_user_memory(user_id)
        if existing:
            response = supabase.table("user_memory").update(data).eq("user_id", user_id).execute()
        else:
            response = supabase.table("user_memory").insert(data).execute()
        return response
    except Exception as e:
        print("Supabase update_user_memory Error:", e)
        return None


def get_learning_path(user_id: str):
    """
    Retrieves the learning path for a user.
    """
    try:
        response = supabase.table("learning_path").select("*").eq("user_id", user_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print("Supabase get_learning_path Error:", e)
        return None


def update_learning_path(user_id: str, completed: list, current_topic: str, next_topic: str, roadmap: list = None):
    """
    Upserts the learning path record.
    """
    try:
        data = {
            "user_id": user_id,
            "completed": completed,
            "current_topic": current_topic,
            "next_topic": next_topic,
        }
        if roadmap is not None:
            data["roadmap"] = roadmap

        existing = get_learning_path(user_id)
        if existing:
            response = supabase.table("learning_path").update(data).eq("user_id", user_id).execute()
        else:
            response = supabase.table("learning_path").insert(data).execute()
        return response
    except Exception as e:
        print("Supabase update_learning_path Error:", e)
        return None