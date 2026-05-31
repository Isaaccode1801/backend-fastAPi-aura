from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Aluno(BaseModel):
    matricula: int
    nome: str
    aura: int = None 

@router.get("/")
def read_root():
    return {"message": "Fe meu levado"}

@router.get("/alunos/{matricula}")
def read_aluno(matricula: int, query_param: str = None):
    return {"matricula": matricula, "query_param": query_param}

@router.post("/alunos/")
def create_aluno(body: Aluno):
    matricula = body.matricula
    nome = body.nome
    aura = body.aura
    if nome == "" or matricula == 0:
        return {"message": "Dados invalidos"}
    
    return {"message": f"Aluno {nome} com aura {aura} criado"}

@router.put("/alunos/{matricula}")
def update_aluno(matricula: int):
    return {"message": "Aluno atualizado"}

@router.delete("alunos/{matricula}")
def deletar_aluno(matricula: int):
    return {"message": "Aluno deletado"}