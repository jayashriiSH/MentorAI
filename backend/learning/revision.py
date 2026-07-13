from learning.base import generate_learning_content

def generate_revision(question: str, answer: str):
    """
    Generates structured, concise revision notes.
    """
    prompt = f"""You are creating revision notes for a student.

Question/Topic discussed:
{question}

Explanation/Context:
{answer}

Create a structured, concise revision summary of the concept.
Return ONLY valid JSON.
No markdown code fences.

Example structure:
{{
  "revision": {{
    "summary": "High-level summary of the concept...",
    "key_points": [
      "Key point 1 detailing critical mechanism...",
      "Key point 2 summarizing a core constraint..."
    ],
    "formulas_or_rules": [
      "Rule 1: Always check for...",
      "Formula: E = mc^2"
    ]
  }}
}}
"""
    return generate_learning_content(prompt, key_name="revision")
