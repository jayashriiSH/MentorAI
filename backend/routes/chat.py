import groq
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from services.query_rewriter import rewrite_query
from services.retriever import retrieve_context
from services.llm_service import ask_llm
from services.memory_service import (
    add_message,
    get_history,
    clear_history,
    summarize_and_update_memory
)
from services.supabase_service import get_user_memory
from services.toolbox import generate_toolbox

router = APIRouter()

# Global caches for cost optimization
query_rewrite_cache = {}
response_cache = {}


def clear_user_response_cache(user_id: str):
    keys_to_remove = [k for k in response_cache.keys() if k[0] == user_id]
    for k in keys_to_remove:
        response_cache.pop(k, None)


class ChatRequest(BaseModel):
    question: str
    user_id: Optional[str] = None


@router.post("/chat")
def chat(request: ChatRequest):
    user_id = request.user_id or "default"

    # 1. Retrieve user memory summary
    user_memory = None
    if user_id != "default":
        user_memory = get_user_memory(user_id)

    # 2. Get previous conversation history
    history = get_history(user_id)

    # 3. Create a hashable key for rewrite cache
    history_key = tuple((msg["role"], msg["content"]) for msg in history)
    rewrite_key = (user_id, request.question, history_key)

    # Check query rewrite cache
    if rewrite_key in query_rewrite_cache:
        rewritten_question = query_rewrite_cache[rewrite_key]
        print(f"\n♻️ Reusing Rewritten Question from Cache: {rewritten_question}")
    else:
        try:
            rewritten_question = rewrite_query(request.question, history)
            query_rewrite_cache[rewrite_key] = rewritten_question
            print(f"\n📝 Rewritten Question: {rewritten_question}")
        except groq.RateLimitError:
            return {
                "error": "The AI model has reached its daily usage limit. Please try again in a few minutes."
            }
        except Exception as e:
            print("Query rewrite error:", e)
            rewritten_question = request.question

    # 4. Check response cache
    response_key = (user_id, rewritten_question)
    if response_key in response_cache:
        print("\n♻️ Reusing Cached Response")
        cached_res = response_cache[response_key]

        # Save conversation to active history
        add_message(user_id, "user", request.question)
        add_message(user_id, "assistant", cached_res["answer"])

        # Check active history count
        new_history = get_history(user_id)
        assistant_replies = [m for m in new_history if m["role"] == "assistant"]
        if len(assistant_replies) >= 5:
            print("Automatic memory summarization triggered via cache hit...")
            summarize_and_update_memory(user_id, new_history)
            clear_history(user_id)

        return cached_res

    # 5. Retrieve context
    docs = retrieve_context(rewritten_question)
    context = "\n\n".join([doc.page_content for doc in docs])

    # 6. Slice history to only include last 4 messages to save tokens
    sliced_history = history[-4:]

    # 7. Ask LLM and catch rate limits
    try:
        answer = ask_llm(
            question=request.question,
            context=context,
            history=sliced_history,
            user_memory=user_memory
        )
    except groq.RateLimitError:
        return {
            "error": "The AI model has reached its daily usage limit. Please try again in a few minutes."
        }
    except Exception as e:
        print("LLM Error:", e)
        return {
            "error": "Failed to generate answer. Please try again."
        }

    toolbox = generate_toolbox(request.question, answer)

    # Save to history
    add_message(user_id, "user", request.question)
    add_message(user_id, "assistant", answer)

    response_data = {
        "question": request.question,
        "answer": answer,
        "sources": [doc.metadata for doc in docs],
        "toolbox": toolbox,
    }

    # Store in response cache
    response_cache[response_key] = response_data

    # 8. Check if we need to summarize learning memory
    new_history = get_history(user_id)
    assistant_replies = [m for m in new_history if m["role"] == "assistant"]
    if len(assistant_replies) >= 5:
        print("Automatic memory summarization triggered...")
        summarize_and_update_memory(user_id, new_history)
        clear_history(user_id)

    return response_data