from sqlalchemy import CheckConstraint, Column, Float, ForeignKey, Integer, String, Text, UniqueConstraint

from app.database import Base


class Sala(Base):
    __tablename__ = "salas"
    __table_args__ = (UniqueConstraint("nome", "ano", name="uq_sala_nome_ano"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(150), nullable=False)
    ano = Column(String(20), nullable=False)
    descricao = Column(Text, nullable=True)


class Aluno(Base):
    __tablename__ = "alunos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    matricula = Column(String(20), unique=True, nullable=False)
    nome = Column(String(100), nullable=False)
    aura = Column(Float, nullable=False, default=0.0)
    sala_id = Column(Integer, ForeignKey("salas.id"), nullable=True)


class Avaliacao(Base):
    __tablename__ = "avaliacoes"
    __table_args__ = (
        CheckConstraint("aura >= -1000 AND aura <= 1000", name="ck_avaliacao_aura_range"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    aluno_id = Column(Integer, ForeignKey("alunos.id"), nullable=False)
    professor = Column(String(200), nullable=False)
    aura = Column(Integer, nullable=False)
    comentario = Column(Text, nullable=True)
