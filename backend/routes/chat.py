from fastapi import APIRouter
from pydantic import BaseModel
from services.query_rewriter import rewrite_query
from services.retriever import retrieve_context
from services.llm_service import ask_llm
from services.memory_service import (
    add_message,
    get_history
)
from services.toolbox import generate_toolbox

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):

    # Retrieve relevant document chunks
    history = get_history()

    rewritten_question = rewrite_query(
    request.question,
    history
)

    print("\n📝 Rewritten Question:")
    print(rewritten_question)

    docs = retrieve_context(rewritten_question)

    context = "\n\n".join(
    [doc.page_content for doc in docs]
)

    # Get previous conversation
    history = get_history()

    # Generate answer
    answer = ask_llm(
        question=request.question,
        context=context,
        history=history
    )
    toolbox = generate_toolbox(
    request.question,
    answer,
)

    # Save conversation
    add_message("user", request.question)
    add_message("assistant", answer)

    return {
    "question": request.question,
    "answer": answer,
    "sources": [
        doc.metadata for doc in docs
    ],
    "toolbox": toolbox,
}