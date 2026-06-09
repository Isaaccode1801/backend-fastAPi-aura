from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AlunoCreate(BaseModel):
    matricula: str
    nome: str
    aura: float = Field(default=0.0, ge=-10, le=10)


class AlunoUpdate(BaseModel):
    matricula: Optional[str] = None
    nome: Optional[str] = None
    aura: Optional[float] = None


class AlunoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    matricula: str
    nome: str
    aura: float
