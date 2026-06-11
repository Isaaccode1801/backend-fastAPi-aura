import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./escola.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def migrar_banco():
    inspector = inspect(engine)
    tabelas = set(inspector.get_table_names())

    with engine.begin() as conn:
        if "avaliacoes" in tabelas:
            colunas = {c["name"] for c in inspector.get_columns("avaliacoes")}
            if "nota" in colunas and "aura" not in colunas:
                conn.execute(text("ALTER TABLE avaliacoes RENAME COLUMN nota TO aura"))

        if "salas" in tabelas:
            colunas = {c["name"] for c in inspector.get_columns("salas")}
            if "descricao" not in colunas:
                conn.execute(text("ALTER TABLE salas ADD COLUMN descricao TEXT"))

        if "alunos" in tabelas:
            colunas = {c["name"] for c in inspector.get_columns("alunos")}
            if "sala_id" not in colunas:
                conn.execute(text("ALTER TABLE alunos ADD COLUMN sala_id INTEGER REFERENCES salas(id)"))
