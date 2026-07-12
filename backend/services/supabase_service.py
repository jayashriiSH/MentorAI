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