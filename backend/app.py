from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.chat import router as chat_router
from routes.upload import router as upload_router
from routes.learning import router as learning_router
app = FastAPI(
    title="AI Teaching Assistant",
    version="1.0"
)

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(learning_router)
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "..", "uploads")
)

print("Serving PDFs from:", UPLOAD_DIR)

app.mount(
    "/documents",
    StaticFiles(directory=UPLOAD_DIR),
    name="documents",
)

@app.get("/")
def home():
    return {
        "message": "AI Teaching Assistant Backend Running 🚀"
    }