from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import crud_aluno
from app.db.session import obter_db
from app.schemas.aluno import AlunoCreate, AlunoResponse

router = APIRouter()


@router.get("/", response_model=List[AlunoResponse])
def listar_alunos(db: Session = Depends(obter_db)):
    return crud_aluno.obter_alunos(db)


@router.get("/{aluno_id}", response_model=AlunoResponse)
def buscar_aluno(aluno_id: int, db: Session = Depends(obter_db)):
    aluno = crud_aluno.obter_aluno(db, aluno_id)
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return aluno


@router.post("/", response_model=AlunoResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_aluno(form: AlunoCreate, db: Session = Depends(obter_db)):
    return crud_aluno.criar_aluno(
        db=db,
        matricula=form.matricula,
        nome=form.nome,
        aura=form.aura,
    )
