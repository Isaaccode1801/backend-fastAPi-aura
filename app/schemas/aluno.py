from pydantic import BaseModel


class AlunoCreate(BaseModel):
    matricula: str
    nome: str
    aura: float = 0.0


class AlunoUpdate(BaseModel):
    matricula: str | None = None
    nome: str | None = None
    aura: float | None = None


class AlunoResponse(BaseModel):
    id: int
    matricula: str
    nome: str
    aura: float
