from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def generate_quiz(question, answer):

    prompt = f"""
You are creating a quiz for a student.

Question:
{question}

Explanation:
{answer}

Create exactly 5 multiple-choice questions.

Return ONLY valid JSON.

Example:

{{
    "quiz":[
        {{
            "question":"...",
            "options":[
                "A",
                "B",
                "C",
                "D"
            ],
            "answer":"B"
        }}
    ]
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
    )

    import json

    text = response.choices[0].message.content

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    return json.loads(text)