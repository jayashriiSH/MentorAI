from langchain_chroma import Chroma
from services.embedding_service import get_embedding_model
import os

embedding_model = get_embedding_model()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")


def retrieve_context(query: str, k: int = 5):

    vector_db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_model,
    )

    results = vector_db.similarity_search_with_score(
        query,
        k=k * 2
    )

    docs = []
    seen = set()

    for doc, score in results:

        identifier = (
            doc.metadata.get("source"),
            doc.metadata.get("page")
        )

        # Skip duplicate pages
        if identifier in seen:
            continue

        seen.add(identifier)

        # Save similarity score
        doc.metadata["score"] = round(score, 4)

        docs.append(doc)

        if len(docs) >= k:
            break

    return docs