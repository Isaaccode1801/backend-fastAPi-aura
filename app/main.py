from contextlib import asynccontextmanager
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine, get_db, migrar_banco
from app.models import Aluno, Avaliacao, Sala
from app.schemas import (
    AlunoCreate,
    AlunoResponse,
    AvaliacaoCreate,
    AvaliacaoResponse,
    ResumoComportamental,
    SalaComResumo,
    SalaCreate,
    SalaResponse,
)

AURA_MINIMA = -10.0
AURA_MAXIMA = 10.0

SALAS_INICIAIS = [
    {"nome": "MAURÍCIO DE SOUSA", "ano": "6 ANO"},
    {"nome": "ADA AUGUSTA", "ano": "6 ANO"},
    {"nome": "ZIRALDO", "ano": "6 ANO"},
    {"nome": "CARLOS DRUMMOND DE ANDRADE", "ano": "7 ANO"},
    {"nome": "MARIO QUINTANA", "ano": "7 ANO"},
    {"nome": "FLÁVIA MUNIZ", "ano": "7 ANO"},
    {"nome": "EVA FURNARI", "ano": "7 ANO"},
    {"nome": "OSWALDO CRUZ", "ano": "8 ANO"},
    {"nome": "MARIA APARECIDA", "ano": "8 ANO"},
    {"nome": "WALT DISNEY", "ano": "8 ANO"},
]

ALUNOS_INICIAIS = [
    {"matricula": "2026001", "nome": "Ana Silva", "aura": 8.0},
    {"matricula": "2026002", "nome": "Bruno Costa", "aura": 5.0},
    {"matricula": "2026003", "nome": "Carla Mendes", "aura": 2.0},
    {"matricula": "2026004", "nome": "Diego Lima", "aura": -2.0},
    {"matricula": "2026005", "nome": "Elena Souza", "aura": 10.0},
]

NIVEIS = ("Crítico", "Baixo", "Médio", "Alto", "Lendário")


def calcular_nova_aura(aura_atual: float, delta: float) -> float:
    return max(AURA_MINIMA, min(aura_atual + delta, AURA_MAXIMA))


def nivel_da_aura(valor: float) -> str:
    v = max(AURA_MINIMA, min(valor, AURA_MAXIMA))
    if v >= 7:
        return "Lendário"
    if v >= 3:
        return "Alto"
    if v >= 0:
        return "Médio"
    if v >= -5:
        return "Baixo"
    return "Crítico"


def label_sala(sala: Sala) -> str:
    ano = sala.ano.replace(" ANO", "º Ano")
    return f"{sala.nome.title()} ({ano})"


def montar_aluno(aluno: Aluno, db: Session) -> AlunoResponse:
    sala_label = None
    if aluno.sala_id:
        sala = db.query(Sala).filter(Sala.id == aluno.sala_id).first()
        if sala:
            sala_label = label_sala(sala)
    return AlunoResponse(
        id=aluno.id,
        matricula=aluno.matricula,
        nome=aluno.nome,
        aura=aluno.aura,
        sala_id=aluno.sala_id,
        sala_label=sala_label,
    )


def resumo_da_sala(sala: Sala, db: Session) -> SalaComResumo:
    alunos = db.query(Aluno).filter(Aluno.sala_id == sala.id).all()
    distribuicao: Dict[str, int] = {n: 0 for n in NIVEIS}
    total_avaliacoes = 0

    for aluno in alunos:
        distribuicao[nivel_da_aura(aluno.aura)] += 1
        total_avaliacoes += db.query(Avaliacao).filter(Avaliacao.aluno_id == aluno.id).count()

    media = round(sum(a.aura for a in alunos) / len(alunos), 1) if alunos else 0.0

    return SalaComResumo(
        id=sala.id,
        nome=sala.nome,
        ano=sala.ano,
        descricao=sala.descricao,
        total_alunos=len(alunos),
        media_aura=media,
        nivel_geral=nivel_da_aura(media) if alunos else "Médio",
        total_avaliacoes=total_avaliacoes,
        distribuicao_niveis=distribuicao,
    )


def seed_salas():
    db = SessionLocal()
    try:
        for dados in SALAS_INICIAIS:
            existe = (
                db.query(Sala)
                .filter(Sala.nome == dados["nome"], Sala.ano == dados["ano"])
                .first()
            )
            if not existe:
                db.add(Sala(**dados))
        db.commit()
    finally:
        db.close()


def seed_alunos():
    db = SessionLocal()
    try:
        if db.query(Aluno).first() is None:
            for dados in ALUNOS_INICIAIS:
                db.add(Aluno(**dados))
            db.commit()
    finally:
        db.close()


def sincronizar_aura_alunos():
    db = SessionLocal()
    try:
        aura_inicial = {a["matricula"]: a["aura"] for a in ALUNOS_INICIAIS}
        for aluno in db.query(Aluno).all():
            aura = calcular_nova_aura(aura_inicial.get(aluno.matricula, aluno.aura), 0)
            for aval in (
                db.query(Avaliacao)
                .filter(Avaliacao.aluno_id == aluno.id)
                .order_by(Avaliacao.id)
                .all()
            ):
                aura = calcular_nova_aura(aura, aval.aura)
            aluno.aura = aura
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    migrar_banco()
    seed_salas()
    seed_alunos()
    sincronizar_aura_alunos()
    yield


app = FastAPI(
    title="Farmador de Aura API",
    description="API escolar COESI — alunos e avaliações de aura",
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


@app.get("/")
def root():
    return {"message": "Farmador de Aura API ativa", "status": "ok"}


# --- Salas ---

@app.get("/api/v1/salas/", response_model=List[SalaComResumo])
def listar_salas(db: Session = Depends(get_db)):
    salas = db.query(Sala).order_by(Sala.ano, Sala.nome).all()
    return [resumo_da_sala(s, db) for s in salas]


@app.get("/api/v1/salas/resumo-comportamental", response_model=ResumoComportamental)
def resumo_comportamental(db: Session = Depends(get_db)):
    salas = db.query(Sala).order_by(Sala.ano, Sala.nome).all()
    resumos = [resumo_da_sala(s, db) for s in salas]
    com_alunos = [r for r in resumos if r.total_alunos > 0]

    maior = max(com_alunos, key=lambda r: r.media_aura, default=None)
    menor = min(com_alunos, key=lambda r: r.media_aura, default=None)

    return ResumoComportamental(
        total_salas=len(resumos),
        total_alunos=db.query(Aluno).count(),
        sala_maior_media=maior,
        sala_menor_media=menor,
        salas=resumos,
    )


@app.post("/api/v1/salas/", response_model=SalaResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_sala(form: SalaCreate, db: Session = Depends(get_db)):
    existe = (
        db.query(Sala)
        .filter(Sala.nome == form.nome.strip(), Sala.ano == form.ano.strip())
        .first()
    )
    if existe:
        raise HTTPException(status_code=409, detail="Sala já cadastrada com este nome e ano")

    sala = Sala(
        nome=form.nome.strip(),
        ano=form.ano.strip(),
        descricao=form.descricao.strip() if form.descricao else None,
    )
    db.add(sala)
    db.commit()
    db.refresh(sala)
    return sala


# --- Alunos ---

@app.get("/api/v1/alunos/", response_model=List[AlunoResponse])
def listar_alunos(db: Session = Depends(get_db)):
    return [montar_aluno(a, db) for a in db.query(Aluno).all()]


@app.get("/api/v1/alunos/{aluno_id}", response_model=AlunoResponse)
def buscar_aluno(aluno_id: int, db: Session = Depends(get_db)):
    aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return montar_aluno(aluno, db)


@app.post("/api/v1/alunos/", response_model=AlunoResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_aluno(form: AlunoCreate, db: Session = Depends(get_db)):
    if form.sala_id:
        sala = db.query(Sala).filter(Sala.id == form.sala_id).first()
        if not sala:
            raise HTTPException(status_code=404, detail="Sala não encontrada")

    aluno = Aluno(
        matricula=form.matricula,
        nome=form.nome,
        aura=form.aura,
        sala_id=form.sala_id,
    )
    db.add(aluno)
    db.commit()
    db.refresh(aluno)
    return montar_aluno(aluno, db)


# --- Avaliações ---

@app.post("/api/v1/avaliacoes/", response_model=AvaliacaoResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_avaliacao(form: AvaliacaoCreate, db: Session = Depends(get_db)):
    aluno = db.query(Aluno).filter(Aluno.id == form.aluno_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")

    avaliacao = Avaliacao(
        aluno_id=form.aluno_id,
        professor=form.professor,
        aura=form.aura,
        comentario=form.comentario,
    )
    aluno.aura = calcular_nova_aura(aluno.aura, form.aura)
    db.add(avaliacao)
    db.commit()
    db.refresh(avaliacao)
    return avaliacao


@app.get("/api/v1/avaliacoes/aluno/{aluno_id}", response_model=List[AvaliacaoResponse])
def listar_avaliacoes_do_aluno(aluno_id: int, db: Session = Depends(get_db)):
    return db.query(Avaliacao).filter(Avaliacao.aluno_id == aluno_id).all()


@app.delete("/api/v1/avaliacoes/{avaliacao_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_avaliacao(avaliacao_id: int, db: Session = Depends(get_db)):
    avaliacao = db.query(Avaliacao).filter(Avaliacao.id == avaliacao_id).first()
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")

    aluno = db.query(Aluno).filter(Aluno.id == avaliacao.aluno_id).first()
    if aluno:
        aluno.aura = calcular_nova_aura(aluno.aura, -avaliacao.aura)

    db.delete(avaliacao)
    db.commit()
