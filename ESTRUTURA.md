# Estrutura do projeto — Farmador de Aura

```
backend-fastAPi-aura/
├── app/                        # Backend Python (FastAPI)
│   ├── __init__.py
│   ├── main.py                 # API, rotas, seed e regras de negócio
│   ├── models.py               # Tabelas SQLAlchemy (Sala, Aluno, Avaliacao)
│   ├── schemas.py              # Validação Pydantic
│   └── database.py             # SQLite, sessão e migrações
│
├── frontend/                   # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/              # Telas (Home, Salas, Alunos, Avaliações)
│   │   ├── components/
│   │   │   ├── alunos/         # AlunoCard, AlunoForm
│   │   │   ├── avaliacoes/     # AvaliacaoForm, AvaliacaoList
│   │   │   ├── salas/          # SalaCard, SalaForm, SalaGrafico, SalaResumoCards
│   │   │   ├── layout/         # Header, Footer, AppLayout
│   │   │   ├── shared/         # AuraBar, SectionHeader, EmptyState
│   │   │   └── ui/             # shadcn/ui (botões, cards, inputs…)
│   │   ├── lib/                # api.ts, aura.ts, coesi.ts, utils.ts
│   │   └── types/              # Tipos TypeScript
│   ├── package.json
│   └── vite.config.ts
│
├── requirements.txt            # Dependências Python
├── .env.example                # Exemplo de configuração
└── .gitignore
```

## Como rodar

```bash
# Backend
cd backend-fastAPi-aura
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Não versionar

- `venv/`, `node_modules/`, `escola.db`, `.env`, `__pycache__/`, `frontend/dist/`
