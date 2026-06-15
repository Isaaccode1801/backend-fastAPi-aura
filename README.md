# Farmador de Aura

Sistema escolar **COESI** para gerenciar salas, alunos, avaliações e a **aura** (reputação comportamental) de cada estudante.

## Descrição do projeto

O **Farmador de Aura** é uma aplicação web desenvolvida para o contexto escolar do COESI. O sistema permite que professores e coordenadores acompanhem o comportamento dos alunos por meio de um indicador chamado **aura** — uma pontuação acumulada que reflete avaliações positivas ou negativas registradas ao longo do tempo.

Cada aluno possui uma aura total que define seu **nível comportamental** (Crítico, Baixo, Médio, Alto ou Lendário). As turmas (salas) contam com painéis de resumo que exibem médias, distribuição de níveis e comparativos entre salas, facilitando a gestão pedagógica e o acompanhamento coletivo dos estudantes.

O projeto é composto por uma **API REST** (FastAPI + SQLite) e uma **interface web** (React + TypeScript), integradas para oferecer cadastro, consulta e visualização dos dados em tempo real.

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

## Principais funcionalidades

### Salas (turmas)

- Listagem de todas as salas com resumo comportamental (total de alunos, média de aura, nível geral e distribuição por nível).
- Cadastro de novas salas com nome, ano e descrição opcional.
- Visão geral comparativa entre turmas (sala com maior e menor média de aura).
- Gráfico de distribuição de níveis por sala.

### Alunos

- Listagem de alunos com matrícula, nome, aura atual e sala vinculada.
- Cadastro de novos alunos, com possibilidade de associá-los a uma sala.
- Consulta individual por ID, com exibição do nível comportamental e barra visual de aura.

### Avaliações

- Registro de avaliações por professor, com pontuação de aura (−1000 a +1000) e comentário opcional.
- Atualização automática da aura acumulada do aluno a cada nova avaliação.
- Histórico de avaliações por aluno.
- Remoção de avaliação com reversão do delta na aura do aluno.

### Painel inicial (Home)

- Resumo geral da turma com média de aura e total de alunos.
- Acesso rápido às páginas de alunos, salas e avaliações.

## Instruções de execução

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

## Apresentação ao professor

Cada grupo deverá apresentar o projeto ao professor, demonstrando:

1. **Descrição geral** — objetivo do sistema e contexto COESI.
2. **Execução ao vivo** — subir backend e frontend e navegar pela aplicação.
3. **Funcionalidades principais** — cadastro e listagem de salas, alunos e avaliações; cálculo e exibição da aura; resumos comportamentais por turma.
4. **Arquitetura** — breve explicação da separação backend (API) / frontend (interface) e das tecnologias utilizadas.

Sugestão de roteiro para a demo:

1. Abrir a Home e mostrar o resumo da turma.
2. Cadastrar ou exibir um aluno e sua barra de aura.
3. Registrar uma avaliação e mostrar a aura atualizada.
4. Acessar a página de Salas e o resumo comportamental comparativo.

## Documentação adicional

- [ESTRUTURA.md](./ESTRUTURA.md) — estrutura de pastas e convenções do projeto
- [MATERIAL_DE_ESTUDO.md](./MATERIAL_DE_ESTUDO.md) — guia técnico detalhado do código

## Licença

Projeto educacional COESI.
