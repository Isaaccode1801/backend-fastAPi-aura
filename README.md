# Farmador de Aura

Sistema escolar **COESI** para gerenciar salas, alunos, avaliações e a **aura** (reputação comportamental) de cada estudante.

## Sobre o projeto

Professores registram avaliações que somam ou subtraem pontos de aura dos alunos. A aura acumulada define o nível comportamental de cada estudante — de **Crítico** a **Lendário** — e alimenta dashboards por turma com médias, distribuição de níveis e comparativos entre salas.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Backend | Python, FastAPI, SQLAlchemy, Pydantic, SQLite |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui |

## Estrutura

```
backend-fastAPi-aura/
├── app/                  # API FastAPI
│   ├── main.py           # Rotas, seed e regras de aura
│   ├── models.py         # Modelos SQLAlchemy
│   ├── schemas.py        # Schemas Pydantic
│   └── database.py       # Conexão e migrações
├── frontend/             # Interface React
│   └── src/
│       ├── pages/        # Home, Salas, Alunos, Avaliações
│       ├── components/   # UI por domínio
│       └── lib/          # API client, aura, cores COESI
├── requirements.txt
├── .env.example
├── ESTRUTURA.md          # Detalhes da arquitetura
└── MATERIAL_DE_ESTUDO.md # Explicação técnica linha a linha
```

## Regras de aura

| Conceito | Comportamento |
|----------|---------------|
| Cada avaliação | Inteiro de **−1000** a **+1000** |
| Aura acumulada | Soma livre, sem limite fixo |
| Níveis | Crítico (&lt; −500) · Baixo (−500 a 0) · Médio (0 a 300) · Alto (300 a 700) · Lendário (≥ 700) |

**Exemplo:** aluno com aura −10 recebe avaliação +1000 → aura total = **990**.

## Como rodar

### Pré-requisitos

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend-fastAPi-aura
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # opcional — padrão: sqlite:///./escola.db
uvicorn app.main:app --reload
```

API disponível em http://127.0.0.1:8000  
Documentação interativa (Swagger): http://127.0.0.1:8000/docs

### Frontend

Em **outro terminal**:

```bash
cd backend-fastAPi-aura/frontend
npm install
npm run dev
```

App disponível em http://localhost:5173

> Suba o backend **antes** do frontend.

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Health check |
| GET | `/api/v1/salas/` | Lista salas com resumo comportamental |
| GET | `/api/v1/salas/resumo-comportamental` | Visão geral de todas as turmas |
| POST | `/api/v1/salas/` | Cadastra sala |
| GET | `/api/v1/alunos/` | Lista alunos |
| GET | `/api/v1/alunos/{id}` | Busca aluno |
| POST | `/api/v1/alunos/` | Cadastra aluno |
| POST | `/api/v1/avaliacoes/` | Registra avaliação e atualiza aura |
| GET | `/api/v1/avaliacoes/aluno/{id}` | Lista avaliações do aluno |
| DELETE | `/api/v1/avaliacoes/{id}` | Remove avaliação e reverte delta |

## Documentação adicional

- [ESTRUTURA.md](./ESTRUTURA.md) — estrutura de pastas e convenções do projeto
- [MATERIAL_DE_ESTUDO.md](./MATERIAL_DE_ESTUDO.md) — guia técnico detalhado do código

## Licença

Projeto educacional COESI.
