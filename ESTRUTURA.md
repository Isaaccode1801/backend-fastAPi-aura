# Estrutura do projeto — Farmador de Aura

Sistema escolar COESI para gerenciar **salas**, **alunos**, **avaliações** e a **aura** (reputação comportamental) de cada estudante.

**Stack:** Python + FastAPI + SQLAlchemy + SQLite (backend) · React + TypeScript + Vite (frontend)

```
backend-fastAPi-aura/
├── app/                        # Backend Python (FastAPI)
│   ├── __init__.py
│   ├── main.py                 # API, rotas, seed, cálculo de aura e níveis
│   ├── models.py               # Tabelas SQLAlchemy (Sala, Aluno, Avaliacao)
│   ├── schemas.py              # Validação Pydantic (entrada/saída da API)
│   └── database.py             # SQLite, sessão, get_db e migrações manuais
│
├── frontend/                   # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/              # Home, Salas, Alunos, Avaliações
│   │   ├── components/
│   │   │   ├── alunos/         # AlunoCard, AlunoForm
│   │   │   ├── avaliacoes/     # AvaliacaoForm, AvaliacaoList
│   │   │   ├── salas/          # SalaCard, SalaForm, SalaGrafico, SalaResumoCards
│   │   │   ├── layout/         # SiteHeader, SiteFooter, AppLayout
│   │   │   ├── shared/         # AuraBar, SectionHeader, EmptyState
│   │   │   └── ui/             # shadcn/ui (botões, cards, inputs…)
│   │   ├── lib/
│   │   │   ├── api.ts          # Chamadas HTTP à API
│   │   │   ├── aura.ts         # Escala, níveis, barra visual e formatação
│   │   │   ├── coesi.ts        # Paleta de cores COESI
│   │   │   └── utils.ts
│   │   └── types/              # Tipos TypeScript
│   ├── package.json
│   └── vite.config.ts
│
├── requirements.txt            # Dependências Python
├── .env.example                # Exemplo de configuração (DATABASE_URL)
├── ESTRUTURA.md                # Este arquivo
├── MATERIAL_DE_ESTUDO.md       # Explicação técnica linha a linha
└── .gitignore
```

## Regras de aura

| Conceito | Escala / comportamento | Onde |
|----------|------------------------|------|
| Aura de cada **avaliação** | Inteiro de **−1000 a +1000** | `schemas.py` (`AvaliacaoCreate`), `models.py` (`CheckConstraint`) |
| Aura **acumulada** do aluno | Soma livre, **sem limite fixo** | `main.py` → `calcular_nova_aura` |
| Níveis (Crítico → Lendário) | Limiares: −500 / 0 / 300 / 700 | `main.py` → `nivel_da_aura`, `frontend/src/lib/aura.ts` |
| Barra visual (AuraBar, gráfico) | Normalizada em **±1000** como referência | `aura.ts` → `limitarAura`, `auraParaPosicao`; `SalaGrafico.tsx` |
| Texto exibido (+990 aura…) | Valor **real**, sem truncar | `aura.ts` → `formatarAuraDiscreta` |

**Exemplo:** aluno com aura −10 recebe avaliação +1000 → aura total = **990**.

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

Documentação interativa: http://127.0.0.1:8000/docs

## Como rodar

### Backend

```bash
cd backend-fastAPi-aura
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # opcional — padrão: sqlite:///./escola.db
uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000

### Frontend

Em **outro terminal**:

```bash
cd backend-fastAPi-aura/frontend
npm install
npm run dev
```

App: http://localhost:5173

> Suba o backend **antes** do frontend.

## Não versionar

- `.venv/`, `venv/`, `node_modules/`, `escola.db`, `.env`, `__pycache__/`, `frontend/dist/`
