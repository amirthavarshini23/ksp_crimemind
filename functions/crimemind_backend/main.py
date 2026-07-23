import os
from dotenv import load_dotenv

# Load .env file for local development
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, chat, cases, analytics

app = FastAPI(
    title="CrimeMind AI API",
    description="Agentic Crime Intelligence Platform for Karnataka State Police",
    version="1.0.0"
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(cases.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "active",
        "service": "CrimeMind AI KSP Backend",
        "engine": "Gemini 1.5 Multi-Agent System"
    }

# Entrypoint handler for Zoho Catalyst Python advanced function
def handler(request, response):
    try:
        from a2wsgi import ASGIMiddleware
        wsgi_app = ASGIMiddleware(app)
        return wsgi_app(request, response)
    except Exception as e:
        # Fallback raw response in case a2wsgi is not loaded in sandbox
        response.write(b'{"error": "Catalyst runtime loading failed"}')
        response.set_header('Content-Type', 'application/json')
        response.send()
