from sqlalchemy.orm import Session

from app.models.aluno import Aluno


def criar_aluno(db: Session, matricula: str, nome: str, aura: float = 0.0):
    aluno = Aluno(matricula=matricula, nome=nome, aura=aura)
    db.add(aluno)
    db.commit()
    db.refresh(aluno)
    return aluno


def obter_aluno(db: Session, aluno_id: int):
    return db.query(Aluno).filter(Aluno.id == aluno_id).first()


def obter_alunos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Aluno).offset(skip).limit(limit).all()


def atualizar_aura_aluno(db: Session, aluno_id: int, nova_aura: float):
    db_aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if db_aluno:
        db_aluno.aura = nova_aura
        db.commit()
        db.refresh(db_aluno)
    return db_aluno


def deletar_aluno(db: Session, aluno_id: int):
    db_aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if db_aluno:
        db.delete(db_aluno)
        db.commit()
        return True
    return False
