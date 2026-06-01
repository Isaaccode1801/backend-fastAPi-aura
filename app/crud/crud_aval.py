from sqlalchemy.orm import Session
from app.models.avaliacao import Avaliacao

# criar uma nova avaliação para um aluno
def criar_avaliacao(db: Session, aluno_id: int, professor: str, nota: float, comentario: str):
    nova_aval = Avaliacao(
        aluno_id=aluno_id,
        professor=professor,
        nota=nota,
        comentario=comentario
    )
    db.add(nova_aval)
    db.commit()
    db.refresh(nova_aval)
    return nova_aval

# listar todas as avaliações de um aluno específico
def obter_avaliacoes_por_aluno(db: Session, aluno_id: int):
    return db.query(Avaliacao).filter(Avaliacao.aluno_id == aluno_id).all()

# buscar uma avaliação pelo ID dela
def obter_avaliacao(db: Session, avaliacao_id: int):
    return db.query(Avaliacao).filter(Avaliacao.id == avaliacao_id).first()

# deletar uma avaliação do sistema
def deletar_avaliacao(db: Session, avaliacao_id: int):
    db_aval = db.query(Avaliacao).filter(Avaliacao.id == avaliacao_id).first()
    if db_aval:
        db.delete(db_aval)
        db.commit()
        return True
    return False