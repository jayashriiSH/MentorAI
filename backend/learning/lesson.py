"""
learning/lesson.py
------------------
Generates a structured lesson for a topic using content retrieved from the
student's uploaded document (via RAG). Uses the shared base LLM helper so
rate-limit handling is consistent with all other learning modules.
"""

from learning.base import generate_learning_content


def generate_lesson(topic: str, context: str) -> dict:
    """
    Generates a structured JSON lesson for *topic* using *context* sourced
    exclusively from the student's uploaded document.

    Returns the standard base.py dict:
        { "success": True,  "data": { "title", "explanation", "examples", "key_takeaways" } }
    or
        { "success": False, "message": "..." }
    """

    prompt = f"""You are an expert educator.

Using ONLY the following content from the student's textbook, create a clear,
structured lesson about the topic: "{topic}".

Textbook content:
\"\"\"
{context[:4500]}
\"\"\"

Return ONLY valid JSON — no markdown, no code fences, no extra text.

{{
  "title": "{topic}",
  "explanation": "Comprehensive, easy-to-understand explanation in 2–3 paragraphs using ONLY the book content.",
  "examples": [
    "A concrete example directly from or inspired by the book content.",
    "Another example if available."
  ],
  "key_takeaways": [
    "Most important point 1 (one sentence).",
    "Most important point 2 (one sentence).",
    "Most important point 3 (one sentence)."
  ]
}}

IMPORTANT:
- Use ONLY information present in the provided textbook content.
- Do NOT hallucinate or add outside knowledge.
- Keep the explanation accessible to a student reading this topic for the first time.
"""

    return generate_learning_content(prompt, key_name="title")
