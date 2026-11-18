
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas

from database import Base, engine, get_db


# Cria as tabelas caso ainda não existam
Base.metadata.create_all(bind=engine)


# Inicialização da aplicação
app = FastAPI(
    title="FinanTrack API",
    description="API para gestão financeira pessoal",
    version="1.0.0",
)


# Permite comunicação com o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Rota inicial
@app.get("/")
def inicio():
    return {
        "mensagem": "Bem-vindo ao FinanTrack!",
        "status": "online"
    }


# Verificar funcionamento da API
@app.get("/api/health")
def verificar_saude():
    return {"status": "ok"}


# Listar todas as transações
@app.get(
    "/api/transacoes",
    response_model=list[schemas.TransacaoResponse]
)
def listar_transacoes(db: Session = Depends(get_db)):

    transacoes = (
        db.query(models.Transacao)
        .order_by(
            models.Transacao.data.desc(),
            models.Transacao.id.desc()
        )
        .all()
    )

    return transacoes


# Cadastrar uma nova transação
@app.post(
    "/api/transacoes",
    response_model=schemas.TransacaoResponse,
    status_code=status.HTTP_201_CREATED
)
def criar_transacao(
    transacao: schemas.TransacaoCreate,
    db: Session = Depends(get_db)
):

    nova_transacao = models.Transacao(
        **transacao.model_dump()
    )

    db.add(nova_transacao)
    db.commit()
    db.refresh(nova_transacao)

    return nova_transacao


# Excluir uma transação
@app.delete(
    "/api/transacoes/{transacao_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def excluir_transacao(
    transacao_id: int,
    db: Session = Depends(get_db)
):

    transacao = (
        db.query(models.Transacao)
        .filter(models.Transacao.id == transacao_id)
        .first()
    )

    if transacao is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transação não encontrada."
        )

    db.delete(transacao)
    db.commit()

    return None
