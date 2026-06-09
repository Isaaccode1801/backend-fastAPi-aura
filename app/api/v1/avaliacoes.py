from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.crud import crud_aval
from app.db.session import obter_db
from app.schemas.avaliacao import AvaliacaoCreate, AvaliacaoResponse

router = APIRouter(tags=["Avaliações"])


@router.post("/", response_model=AvaliacaoResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_avaliacao(form: AvaliacaoCreate, db: Session = Depends(obter_db)):
    avaliacao = crud_aval.criar_avaliacao(
        db=db,
        aluno_id=form.aluno_id,
        professor=form.professor,
        nota=form.nota,
        comentario=form.comentario,
    )
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return avaliacao


@router.get("/aluno/{aluno_id}", response_model=List[AvaliacaoResponse])
def listar_avaliacoes_do_aluno(aluno_id: int, db: Session = Depends(obter_db)):
    return crud_aval.obter_avaliacoes_por_aluno(db, aluno_id=aluno_id)


@router.delete("/{avaliacao_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_avaliacao(avaliacao_id: int, db: Session = Depends(obter_db)):
    deletado = crud_aval.deletar_avaliacao(db, avaliacao_id=avaliacao_id)
    if not deletado:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return None
