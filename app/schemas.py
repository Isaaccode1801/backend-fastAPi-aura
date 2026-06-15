from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class SalaCreate(BaseModel):
    nome: str
    ano: str
    descricao: Optional[str] = None


class SalaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    ano: str
    descricao: Optional[str] = None


class SalaComResumo(SalaResponse):
    total_alunos: int = 0
    media_aura: float = 0.0
    nivel_geral: str = "Médio"
    total_avaliacoes: int = 0
    distribuicao_niveis: Dict[str, int] = Field(default_factory=dict)


class ResumoComportamental(BaseModel):
    total_salas: int
    total_alunos: int
    sala_maior_media: Optional[SalaComResumo] = None
    sala_menor_media: Optional[SalaComResumo] = None
    salas: List[SalaComResumo]


class AlunoCreate(BaseModel):
    matricula: str
    nome: str
    aura: float = Field(default=0.0)
    sala_id: Optional[int] = None


class AlunoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    matricula: str
    nome: str
    aura: float
    sala_id: Optional[int] = None
    sala_label: Optional[str] = None


class AvaliacaoCreate(BaseModel):
    aluno_id: int
    professor: str
    aura: int = Field(ge=-1000, le=1000)
    comentario: Optional[str] = None


class AvaliacaoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    aluno_id: int
    professor: str
    aura: int
    comentario: Optional[str] = None
