from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# importa a conexão com o banco de dados
from app.db.session import obter_db

# importa as funções do banco
from app.crud import crud_aluno

# importa as validações de dados 
from app.schemas.aluno import AlunoCreate, AlunoResponse

router = APIRouter(prefix="/alunos", tags=["Alunos"])

# rota para criar aluno 
@router.post("/", response_model=AlunoResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_aluno(form: AlunoCreate, db: Session = Depends(obter_db)):

    if form.nome == "" or form.matricula == "":
        raise HTTPException(status_code=400, detail="Dados inválidos")
    
    return crud_aluno.criar_aluno(db=db, aluno=form)

# rota para buscar um aluno específico pelo ID
@router.get("/{aluno_id}", response_model=AlunoResponse)
def ler_aluno(aluno_id: int, db: Session = Depends(obter_db)):
    db_aluno = crud_aluno.obter_aluno(db=db, aluno_id=aluno_id)
    if db_aluno is None:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return db_aluno

# rota para listar todos os alunos
@router.get("/", response_model=List[AlunoResponse])
def listar_alunos(skip: int = 0, limit: int = 100, db: Session = Depends(obter_db)):
    return crud_aluno.obter_alunos(db=db, skip=skip, limit=limit)

# rota para deletar um aluno
@router.delete("/{aluno_id}", status_code=status.HTTP_200_OK)
def deletar_aluno(aluno_id: int, db: Session = Depends(obter_db)):
    sucesso = crud_aluno.deletar_aluno(db=db, aluno_id=aluno_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return {"message": "Aluno deletado com sucesso"}