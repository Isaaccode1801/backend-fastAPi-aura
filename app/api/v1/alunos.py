from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Aluno(BaseModel):
    matricula: int
    nome: str
    aura: int = None 

@app.get("/")
def read_root():
    return {"message": "Fe meu levado"}

@app.get("/alunos/{matricula}")
def read_aluno(matricula: int, query_param: str = None):
    return {"matricula": matricula, "query_param": query_param}

@app.post("/alunos/")
def create_aluno(body: Aluno):
    matricula = body.matricula
    nome = body.nome
    aura = body.aura
    if nome == "" or matricula == 0:
        return {"message": "Dados invalidos"}
    
    return {"message": f"Aluno {nome} com aura {aura} criado"}

@app.put("/alunos/{matricula}")
def update_aluno(matricula: int):
    return {"message": "Aluno atualizado"}

@app.delete("alunos/{matricula}")
def deletar_aluno(matricula: int):
    return {"message": "Aluno deletado"}