from learning.base import generate_learning_content

def generate_flashcards(question: str, answer: str):
    """
    Generates a list of 5 interactive flippable flashcards.
    """
    prompt = f"""You are creating flashcards for a student.

Question/Topic discussed:
{question}

Explanation/Context:
{answer}

Create exactly 5 flashcards to help them memorize key terms and concepts.
Return ONLY valid JSON.
No markdown code fences.

Example structure:
{{
  "flashcards": [
    {{
      "front": "What does SQL stand for?",
      "back": "Structured Query Language"
    }}
  ]
}}
"""
    return generate_learning_content(prompt, key_name="flashcards")
