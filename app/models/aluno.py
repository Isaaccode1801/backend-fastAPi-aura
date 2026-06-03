from sqlalchemy import Column, Float, Integer, String

from app.db.session import Base


class Aluno(Base):
    __tablename__ = "alunos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    matricula = Column(String(20), unique=True, nullable=False)
    nome = Column(String(100), nullable=False)
    aura = Column(Float, nullable=False, default=0.0)
