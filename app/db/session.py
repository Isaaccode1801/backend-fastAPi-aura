from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings 

DATABASE_URL = settings.database_url

# O connect_args é obrigatório para que o SQLite funcione com as threads do FastAPI
engine = create_engine(
    DATABASE_URL, connect_args={ "check_same_thread": False }
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def obter_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()