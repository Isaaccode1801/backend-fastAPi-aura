from typing import Optional

from pydantic import BaseModel, ConfigDict


class AvaliacaoCreate(BaseModel):
    aluno_id: int
    professor: str
    nota: float
    comentario: Optional[str] = None


class AvaliacaoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    aluno_id: int
    professor: str
    nota: float
    comentario: Optional[str] = None
