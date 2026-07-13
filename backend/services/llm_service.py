from groq import Groq
from config import GROQ_API_KEY
from services.prompt_builder import build_prompt

client = Groq(api_key=GROQ_API_KEY)


def ask_llm(question, context, history, user_memory=None):

    prompt = build_prompt(
        history,
        context,
        question,
        user_memory
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": prompt
            }
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content
