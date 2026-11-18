
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Date,
    CheckConstraint,
)

from database import Base


class Transacao(Base):
    __tablename__ = "transacoes"

    __table_args__ = (
        CheckConstraint(
            "tipo IN ('income', 'expense')",
            name="ck_transacao_tipo",
        ),
        CheckConstraint(
            "valor > 0",
            name="ck_transacao_valor",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    descricao = Column(String(100), nullable=False)

    tipo = Column(String(10), nullable=False)

    categoria = Column(String(50), nullable=False)

    valor = Column(Numeric(12, 2), nullable=False)

    data = Column(Date, nullable=False)
