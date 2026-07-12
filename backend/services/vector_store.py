import os
from langchain_chroma import Chroma
from services.embedding_service import get_embedding_model

embedding_model = get_embedding_model()

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")


def create_vector_store():

    vector_db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_model,
    )

    return vector_db


def add_document(documents, filename):

    vector_db = create_vector_store()

    for i, doc in enumerate(documents):

        doc.metadata["source"] = filename
        doc.metadata["chunk"] = i + 1

    vector_db.add_documents(documents)

    return vector_db