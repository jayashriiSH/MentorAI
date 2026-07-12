import os
from dotenv import load_dotenv

load_dotenv()

# AI
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")