from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text

from app.db.session import Base


class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    aluno_id = Column(Integer, ForeignKey("alunos.id"), nullable=False)
    professor = Column(String(200), nullable=False)
    nota = Column(Float, nullable=False)
    comentario = Column(Text, nullable=True)
