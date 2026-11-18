
from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TransacaoCreate(BaseModel):
    descricao: str = Field(min_length=1, max_length=100)

    tipo: Literal["income", "expense"]

    categoria: str = Field(min_length=1, max_length=50)

    valor: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    data: date


class TransacaoResponse(TransacaoCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
