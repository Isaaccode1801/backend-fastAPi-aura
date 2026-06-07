# funções do banco de dados para Alunos
from sqlalchemy.orm import Session
from app.models.aluno import Aluno
from app.schemas.aluno import AlunoCreate  

# buscar um aluno específico pelo ID
def obter_aluno(db: Session, aluno_id: int):
    return db.query(Aluno).filter(Aluno.id == aluno_id).first()

# listar todos os alunos
def obter_alunos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Aluno).offset(skip).limit(limit).all()

# atualizar a Aura do aluno 
def atualizar_aura_aluno(db: Session, aluno_id: int, nova_aura: float):
    db_aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if db_aluno:
        db_aluno.aura = nova_aura
        db.commit()
        db.refresh(db_aluno)
    return db_aluno

# deletar um aluno do banco de dados
def deletar_aluno(db: Session, aluno_id: int):
    db_aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if db_aluno:
        db.delete(db_aluno)
        db.commit()
        return True
    return False

# criar um novo aluno no banco de dados
def criar_aluno(db: Session, aluno: AlunoCreate):
    db_aluno = Aluno(
        nome=aluno.nome, 
        matricula=aluno.matricula,
        aura=0.0  
    )

    db.add(db_aluno)
    db.commit()
    db.refresh(db_aluno)
    return db_aluno