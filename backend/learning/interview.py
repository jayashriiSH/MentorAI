from learning.base import generate_learning_content

def generate_interview(question: str, answer: str):
    """
    Generates technical mock interview questions.
    """
    prompt = f"""You are creating technical interview questions for a student.

Question/Topic discussed:
{question}

Explanation/Context:
{answer}

Create exactly 3 mock interview questions with detailed suggested answers and interviewer feedback guidelines.
Return ONLY valid JSON.
No markdown code fences.

Example structure:
{{
  "interview": [
    {{
      "question": "How do you handle X in a production system?",
      "suggested_answer": "To handle X, you must implement...",
      "what_interviewer_looks_for": "The interviewer is looking for understanding of scalability, error handling, and reliability."
    }}
  ]
}}
"""
    return generate_learning_content(prompt, key_name="interview")
