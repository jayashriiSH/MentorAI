from learning.base import generate_learning_content

def generate_exercise(question: str, answer: str):
    """
    Generates a coding or practical exercise.
    """
    prompt = f"""You are creating a coding or practical exercise for a student.

Question/Topic discussed:
{question}

Explanation/Context:
{answer}

Create a coding problem or practical challenge testing their understanding.
Return ONLY valid JSON.
No markdown code fences.

Example structure:
{{
  "exercise": {{
    "problem_description": "Write a function that...",
    "starter_code": "def solve(n):\\n    # Write your code here\\n    pass",
    "hints": [
      "Hint 1: Consider utilizing a hash map.",
      "Hint 2: Pay attention to edge cases like empty arrays."
    ],
    "solution": "def solve(n):\\n    return n * 2"
  }}
}}
"""
    return generate_learning_content(prompt, key_name="exercise")
