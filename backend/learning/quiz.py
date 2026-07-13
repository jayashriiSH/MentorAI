from learning.base import generate_learning_content

def generate_quiz(question: str, answer: str):
    """
    Generates a 5-question multiple choice quiz based on the conversation context.
    """
    prompt = f"""You are creating a quiz for a student.

Question/Topic discussed:
{question}

Explanation/Context:
{answer}

Create exactly 5 multiple-choice questions testing their understanding.
Return ONLY valid JSON.
No markdown code fences.

Example structure:
{{
  "quiz": [
    {{
      "question": "What is ...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option B"
    }}
  ]
}}
"""
    return generate_learning_content(prompt, key_name="quiz")