from typing import Optional

from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.avaliacao import Avaliacao

AURA_MINIMA = -10.0
AURA_MAXIMA = 10.0


def calcular_nova_aura(aura_atual: float, nota: float) -> float:
    nova_aura = aura_atual + nota
    return max(AURA_MINIMA, min(nova_aura, AURA_MAXIMA))


def criar_avaliacao(
    db: Session,
    aluno_id: int,
    professor: str,
    nota: float,
    comentario: Optional[str] = None,
):
    aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if not aluno:
        return None

    nova_aval = Avaliacao(
        aluno_id=aluno_id,
        professor=professor,
        nota=nota,
        comentario=comentario,
    )
    aluno.aura = calcular_nova_aura(aluno.aura, nota)

    db.add(nova_aval)
    db.commit()
    db.refresh(nova_aval)
    return nova_aval


def obter_avaliacoes_por_aluno(db: Session, aluno_id: int):
    return db.query(Avaliacao).filter(Avaliacao.aluno_id == aluno_id).all()


def obter_avaliacao(db: Session, avaliacao_id: int):
    return db.query(Avaliacao).filter(Avaliacao.id == avaliacao_id).first()


def deletar_avaliacao(db: Session, avaliacao_id: int):
    db_aval = db.query(Avaliacao).filter(Avaliacao.id == avaliacao_id).first()
    if not db_aval:
        return False

    aluno = db.query(Aluno).filter(Aluno.id == db_aval.aluno_id).first()
    if aluno:
        aluno.aura = calcular_nova_aura(aluno.aura, -db_aval.nota)

    db.delete(db_aval)
    db.commit()
    return True
