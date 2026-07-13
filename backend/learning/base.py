import json
import groq
from groq import Groq
from config import GROQ_API_KEY
from utils.json_helper import clean_json_string

client = Groq(api_key=GROQ_API_KEY)

def generate_learning_content(prompt: str, key_name: str = None, model: str = "llama-3.3-70b-versatile"):
    """
    Executes a prompt on Groq LLM, cleans the response, and parses it as JSON.
    Handles rate limiting and other exceptions gracefully.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
        )
        raw_text = response.choices[0].message.content
        cleaned_text = clean_json_string(raw_text)
        
        try:
            parsed = json.loads(cleaned_text)
            if key_name and key_name not in parsed:
                return {
                    "success": False,
                    "message": f"Expected key '{key_name}' not found in the response."
                }
            return {
                "success": True,
                "data": parsed
            }
        except json.JSONDecodeError as je:
            print(f"JSON Decode Error: {je}. Raw response: {raw_text}")
            return {
                "success": False,
                "message": "Failed to parse the learning content format. Please try again."
            }
            
    except groq.RateLimitError as re:
        print(f"Groq Rate Limit Error: {re}")
        return {
            "success": False,
            "message": "The AI model has reached its usage limit. Please try again in a few minutes."
        }
    except Exception as e:
        print(f"LLM Generation Error: {e}")
        return {
            "success": False,
            "message": "An error occurred while generating learning content. Please try again."
        }
