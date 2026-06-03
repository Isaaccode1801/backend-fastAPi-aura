from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# importa a conexão com o banco 
from app.db.session import obter_db 
# importa as suas funções do CRUD de avaliação que você acabou de criar
from app.crud import crud_aval 
# importa as validações  
from app.schemas.avaliacao import AvaliacaoCreate, AvaliacaoResponse 

router = APIRouter(prefix="/avaliacoes", tags=["Avaliações"])

# rota para criar uma avaliação (POST)
@router.post("/", response_model=AvaliacaoResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_avaliacao(form: AvaliacaoCreate, db: Session = Depends(obter_db)):
    return crud_aval.criar_avaliacao(
        db=db, 
        aluno_id=form.aluno_id, 
        professor=form.professor, 
        nota=form.nota, 
        comentario=form.comentario
    )

# rota para listar as avaliações de um aluno específico (GET)
@router.get("/aluno/{aluno_id}", response_model=List[AvaliacaoResponse])
def listar_avaliacoes_do_aluno(aluno_id: int, db: Session = Depends(obter_db)):
    avaliacoes = crud_aval.obter_avaliacoes_por_aluno(db, aluno_id=aluno_id)
    return avaliacoes

# rota para deletar uma avaliação pelo ID dela (DELETE)
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_avaliacao(id: int, db: Session = Depends(obter_db)):
    deletado = crud_aval.deletar_avaliacao(db, avaliacao_id=id)
    if not deletado:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return None
