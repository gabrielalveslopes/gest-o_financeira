
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FinanTrack API",
    description="API para gestão financeira pessoal",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def inicio():
    return {
        "mensagem": "Bem-vindo ao FinanTrack!",
        "status": "online",
    }


@app.get("/api/health")
def verificar_saude():
    return {"status": "ok"}

