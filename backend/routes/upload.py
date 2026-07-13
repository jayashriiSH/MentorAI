from fastapi import APIRouter, UploadFile, File, Form
from typing import List
from services.vector_store import add_document
from services.parser import extract_documents_from_pdf
from services.chunker import chunk_documents
from services.supabase_service import save_document, supabase
from routes.chat import clear_user_response_cache
import os
import shutil

router = APIRouter()

UPLOAD_FOLDER = "../uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")
async def upload_files(
    user_id: str = Form(...),
    files: List[UploadFile] = File(...)
):

    print("===== Upload Started =====")
    print("User:", user_id)

    # Invalidate cache for new context
    clear_user_response_cache(user_id)

    uploaded_files = []

    for file in files:

        # Check if the document already exists in Supabase
        try:
            existing = supabase.table("documents").select("*").eq("user_id", user_id).eq("filename", file.filename).execute()
            if existing.data:
                print(f"⚠️ Document {file.filename} is already indexed. Skipping processing.")
                uploaded_files.append({
                    "filename": file.filename,
                    "pages": existing.data[0].get("pages", 0),
                    "chunks": existing.data[0].get("chunks", 0),
                    "status": "already_indexed"
                })
                continue
        except Exception as se:
            print("Failed to query existing document in upload:", se)

        print(f"\nSaving {file.filename}")

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("✅ File saved")


        documents = extract_documents_from_pdf(file_path)
        print("✅ PDF parsed")

        chunks = chunk_documents(documents)
        print("✅ PDF chunked")

        add_document(
            documents=chunks,
            filename=file.filename,
        )

        print("✅ Added to Chroma")

        save_document(
            user_id=user_id,
            filename=file.filename,
            pages=len(documents),
            chunks=len(chunks),
        )

        print("✅ Saved to Supabase")

        uploaded_files.append({
            "filename": file.filename,
            "pages": len(documents),
            "chunks": len(chunks)
        })

    print("===== Upload Finished =====")

    return {
        "message": "Documents indexed successfully!",
        "documents": uploaded_files
    }