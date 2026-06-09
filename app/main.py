from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import alunos, avaliacoes
from app.crud import crud_aluno
from app.db.session import SessionLocal, engine, Base
from app.models.aluno import Aluno
from app.models.avaliacao import Avaliacao
from app.crud.crud_aval import calcular_nova_aura

ALUNOS_INICIAIS = [
    {"matricula": "2026001", "nome": "Ana Silva", "aura": 8.0},
    {"matricula": "2026002", "nome": "Bruno Costa", "aura": 5.0},
    {"matricula": "2026003", "nome": "Carla Mendes", "aura": 2.0},
    {"matricula": "2026004", "nome": "Diego Lima", "aura": -2.0},
    {"matricula": "2026005", "nome": "Elena Souza", "aura": 10.0},
]


def seed_alunos():
    db = SessionLocal()
    try:
        if db.query(Aluno).first() is None:
            for dados in ALUNOS_INICIAIS:
                crud_aluno.criar_aluno(db, **dados)
    finally:
        db.close()


def sincronizar_aura_alunos():
    """Recalcula a aura com base no valor inicial + avaliações já registradas."""
    db = SessionLocal()
    try:
        aura_inicial = {item["matricula"]: item["aura"] for item in ALUNOS_INICIAIS}
        alunos = db.query(Aluno).all()

        for aluno in alunos:
            base = aura_inicial.get(aluno.matricula, aluno.aura)
            aura = calcular_nova_aura(base, 0)
            avaliacoes = (
                db.query(Avaliacao)
                .filter(Avaliacao.aluno_id == aluno.id)
                .order_by(Avaliacao.id)
                .all()
            )
            for avaliacao in avaliacoes:
                aura = calcular_nova_aura(aura, avaliacao.nota)
            aluno.aura = aura

        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_alunos()
    sincronizar_aura_alunos()
    yield


app = FastAPI(
    title="API de reputaçao escolar - Sistema de AURA",
    description="API para gerenciar alunos e suas avaliações de aura",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alunos.router, prefix="/api/v1/alunos", tags=["Alunos"])
app.include_router(avaliacoes.router, prefix="/api/v1/avaliacoes", tags=["Avaliações"])


@app.get("/")
def root():
    return {"message": "Farmador de Aura API ativa", "status": "ok"}
