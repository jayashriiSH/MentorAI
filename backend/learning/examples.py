from learning.base import generate_learning_content

def generate_examples(question: str, answer: str):
    """
    Generates 3 distinct real-world practical examples.
    """
    prompt = f"""You are creating real-world practical examples for a student.

Question/Topic discussed:
{question}

Explanation/Context:
{answer}

Create exactly 3 clear, detailed real-world examples illustrating this concept.
Return ONLY valid JSON.
No markdown code fences.

Example structure:
{{
  "examples": [
    {{
      "title": "E-Commerce Shopping Cart",
      "description": "In an e-commerce website, this concept is used to...",
      "code_or_scenario": "class Cart:\\n    def __init__(self):..."
    }}
  ]
}}
"""
    return generate_learning_content(prompt, key_name="examples")
