from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def rewrite_query(question, history):

    conversation = ""

    for msg in history:
        conversation += f"{msg['role']}: {msg['content']}\n"

    prompt = f"""
You are a query rewriting assistant.

Your job is NOT to answer.

Rewrite the user's latest question into a complete,
standalone question using the conversation history.

Conversation:

{conversation}

Current Question:

{question}

Return ONLY the rewritten question.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": prompt
            }
        ],
        temperature=0,
    )

    return response.choices[0].message.content.strip()