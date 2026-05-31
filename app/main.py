from fastapi import FastAPI
from app.db.session import engine, Base
from app.api.v1 import alunos, avaliacoes

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de reputaçao escolar - Sistema de AURA",
    description="API para gerenciar alunos e suas avaliações de aura",
    version="1.0.0"
)

app.include_router(alunos.router, prefix="/api/v1/alunos", tags=["Alunos"])
app.include_router(avaliacoes.router, prefix="/api/v1/avaliacoes", tags=["Avaliações"])

@app.get("/")
def root():
    return {"message": "API funcionando = +10000 de aura para quem acessou kkkkkk"}