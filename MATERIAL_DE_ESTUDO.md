# Material de Estudo — Farmador de Aura
## Explicação técnica linha a linha para apresentação acadêmica

Este documento explica o projeto **Farmador de Aura**: sistema escolar do COESI que gerencia **salas**, **alunos**, **avaliações** e a **aura** (reputação comportamental) de cada estudante.

**Arquitetura geral:**
- **Backend:** Python + FastAPI + SQLAlchemy + SQLite
- **Frontend:** React + TypeScript + Vite
- **Comunicação:** JSON via HTTP REST (`/api/v1/...`)

---

# PARTE 1 — BACKEND (Python)

---

## ARQUIVO: `app/database.py`

**PROPÓSITO:** Configura a conexão com o banco de dados SQLite, cria a sessão ORM, fornece acesso ao banco nas rotas e executa migrações simples quando o sistema inicia.

```python
import os
from pathlib import Path
```
**LINHA 1:** Importa `os` para ler variáveis de ambiente do sistema operacional (como `DATABASE_URL`).  
**LINHA 2:** Importa `Path` para manipular caminhos de arquivo de forma segura e multiplataforma.  
*Se removidas:* não seria possível carregar o `.env` nem montar o caminho do banco.

```python
from dotenv import load_dotenv
```
**LINHA 4:** Importa `load_dotenv` da biblioteca `python-dotenv`, que lê o arquivo `.env` e coloca as variáveis no ambiente.  
*Por que existe:* separar configuração (URL do banco) do código-fonte.

```python
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
```
**LINHA 5:**  
- `create_engine`: cria o "motor" de conexão com o banco  
- `inspect`: inspeciona estrutura de tabelas existentes  
- `text`: permite executar SQL bruto (usado nas migrações)  

**LINHA 6:**  
- `declarative_base`: classe base para os models ORM  
- `sessionmaker`: fábrica de sessões de banco (cada operação usa uma sessão)

```python
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
```
**LINHA 8:** Carrega o `.env` que fica na **raiz do projeto** (um nível acima de `app/`).  
- `__file__` = caminho deste arquivo  
- `.parent.parent` = sobe de `app/` para a raiz  
*Se removida:* `DATABASE_URL` só viria do sistema operacional, não do `.env`.

```python
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./escola.db")
```
**LINHA 10:** Lê a URL do banco. Se não existir no `.env`, usa SQLite local `escola.db`.  
- `sqlite:///./escola.db` = arquivo na pasta atual  
⭐ **PONTO IMPORTANTE:** todo o projeto persiste dados neste arquivo SQLite.

```python
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```
**LINHA 12:** Cria o engine SQLAlchemy.  
- `check_same_thread: False` é **obrigatório** no SQLite com FastAPI, porque várias threads podem acessar o banco.  
*Se removido:* erros de thread ao receber várias requisições.

```python
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```
**LINHA 13:** `SessionLocal` é uma fábrica de sessões.  
- `autocommit=False`: mudanças só persistem com `commit()` explícito  
- `autoflush=False`: evita flush automático antes de cada query  

**LINHA 14:** `Base` é a classe-mãe de todos os models em `models.py`.

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```
**LINHAS 17–22:** Função geradora usada pelo FastAPI via `Depends(get_db)`.  
- Abre uma sessão  
- `yield db` entrega a sessão para a rota  
- `finally: db.close()` **sempre** fecha, mesmo se der erro  
⭐ **PONTO IMPORTANTE:** padrão "uma sessão por requisição", evita vazamento de conexão.

```python
def migrar_banco():
```
**LINHA 25:** Migração manual para bancos que já existiam antes de mudanças no schema. Não é Alembic; é SQL direto.

**LINHAS 26–27:** Inspeciona quais tabelas existem no banco atual.

**LINHAS 29–33:** Se a tabela `avaliacoes` tiver coluna `nota` (nome antigo), renomeia para `aura`.  
*Por que:* o projeto evoluiu de "nota" para "aura" sem perder dados antigos.

**LINHAS 35–38:** Adiciona coluna `descricao` em `salas` se não existir.

**LINHAS 40–43:** Adiciona coluna `sala_id` em `alunos` se não existir (vínculo aluno ↔ sala).

**RESUMO:** `database.py` é a **fundação de dados**. `models.py` herda `Base`; `main.py` usa `engine`, `SessionLocal` e `get_db`.

---

## ARQUIVO: `app/models.py`

**PROPÓSITO:** Define como os dados são **armazenados fisicamente** no banco (tabelas e colunas). É a camada ORM (Object-Relational Mapping).

```python
from sqlalchemy import CheckConstraint, Column, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from app.database import Base
```
**LINHA 1:** Tipos de coluna e restrições do SQLAlchemy.  
**LINHA 3:** Importa `Base` de `database.py` para registrar as tabelas.

### Classe `Sala`

```python
class Sala(Base):
    __tablename__ = "salas"
    __table_args__ = (UniqueConstraint("nome", "ano", name="uq_sala_nome_ano"),)
```
**LINHA 6–8:**  
- Representa uma **turma/sala** (ex: "MAURÍCIO DE SOUSA", "6 ANO")  
- `UniqueConstraint`: não permite duas salas com mesmo nome **e** mesmo ano  
⭐ Evita duplicação no seed e no cadastro

| Campo | Tipo | Função |
|-------|------|--------|
| `id` | Integer, PK | Identificador único auto-incrementado |
| `nome` | String(150) | Nome da sala, obrigatório |
| `ano` | String(20) | Série (ex: "6 ANO") |
| `descricao` | Text, opcional | Observações sobre a turma |

### Classe `Aluno`

```python
class Aluno(Base):
    __tablename__ = "alunos"
```
Representa um estudante.

| Campo | Tipo | Função |
|-------|------|--------|
| `id` | Integer, PK | ID único |
| `matricula` | String(20), unique | Matrícula única no sistema |
| `nome` | String(100) | Nome do aluno |
| `aura` | Float, default 0.0 | Pontuação acumulada (−10 a 10 no backend) |
| `sala_id` | FK → salas.id, nullable | Vínculo com a sala; pode ser nulo |

⭐ `ForeignKey("salas.id")` cria relação no banco: um aluno pode pertencer a uma sala.

### Classe `Avaliacao`

```python
class Avaliacao(Base):
    __table_args__ = (
        CheckConstraint("aura >= -1000 AND aura <= 1000", name="ck_avaliacao_aura_range"),
    )
```
Registra um evento comportamental feito por um professor sobre um aluno.

| Campo | Tipo | Função |
|-------|------|--------|
| `id` | Integer, PK | ID da avaliação |
| `aluno_id` | FK → alunos.id | Qual aluno foi avaliado |
| `professor` | String(200) | Quem registrou |
| `aura` | Integer | Valor da avaliação (−1000 a 1000) |
| `comentario` | Text, opcional | Observação textual |

⭐ `CheckConstraint` garante no **banco** que valores inválidos não entram, mesmo bypassando a API.

**RESUMO:** `models.py` = estrutura das tabelas. `schemas.py` valida JSON; `main.py` lê/escreve via ORM.

---

## ARQUIVO: `app/schemas.py`

**PROPÓSITO:** Define **contratos de dados** com Pydantic — o que a API aceita (entrada) e o que devolve (saída). Não toca no banco diretamente.

```python
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
```

### `SalaCreate` (entrada POST)
- `nome`, `ano`: obrigatórios  
- `descricao`: opcional  
*Usado quando o frontend cadastra uma nova sala.*

### `SalaResponse` (saída)
- `model_config = ConfigDict(from_attributes=True)` permite converter objeto SQLAlchemy → JSON automaticamente  
- Campos espelham a tabela `salas`

### `SalaComResumo` (herda `SalaResponse`)
Adiciona dados **calculados** pelo backend (não existem como colunas):
- `total_alunos`, `media_aura`, `nivel_geral`, `total_avaliacoes`, `distribuicao_niveis`  
⭐ Agregação feita em Python (`main.py`), não no frontend.

### `ResumoComportamental`
Pacote completo para a tela de Salas e o gráfico:
- totais, sala com maior/menor média, lista de salas com resumo

### `AlunoCreate` / `AlunoResponse`
- `aura: Field(ge=-10, le=10)` valida intervalo na **criação**  
- `sala_id` opcional  
- `sala_label` só na resposta (texto formatado, ex: "Ana Silva (6º Ano)")

### `AvaliacaoCreate` / `AvaliacaoResponse`
- `aura: Field(ge=-1000, le=1000)` valida o valor da avaliação  
⭐ Se alguém enviar `aura: 5000`, Pydantic rejeita **antes** de chegar ao banco.

**RESUMO:** `schemas.py` = porteiro da API. Valida, tipa e serializa JSON.

---

## ARQUIVO: `app/main.py`

**PROPÓSITO:** Coração do backend — aplicação FastAPI, regras de negócio, rotas HTTP, seed inicial e sincronização de aura.

### Imports (linhas 1–19)
| Import | Função |
|--------|--------|
| `asynccontextmanager` | Define ciclo de vida da app (startup/shutdown) |
| `Depends` | Injeção de dependências (sessão do banco) |
| `FastAPI, HTTPException, status` | Framework web e erros HTTP |
| `CORSMiddleware` | Permite frontend em outra porta acessar a API |
| `Session` | Tipo da sessão SQLAlchemy |
| `database, models, schemas` | Camadas internas do projeto |

### Constantes (21–45)

```python
AURA_MINIMA = -10.0
AURA_MAXIMA = 10.0
```
Limites da **aura do aluno** (não da avaliação individual).

`SALAS_INICIAIS` e `ALUNOS_INICIAIS`: dados padrão inseridos no primeiro startup.

`NIVEIS`: tupla usada para inicializar contagem na distribuição por sala.

### `calcular_nova_aura(aura_atual, delta)` (48–49)
```python
return max(AURA_MINIMA, min(aura_atual + delta, AURA_MAXIMA))
```
- Soma `delta` (valor da avaliação) à aura atual  
- **Trava** entre −10 e 10  
⭐ Regra central do jogo de aura do aluno  
*Se removida:* aura poderia explodir para valores absurdos.

### `nivel_da_aura(valor)` (52–62)
Classifica aura em: Crítico, Baixo, Médio, Alto, Lendário.  
Usado no resumo por sala e nos gráficos.

### `label_sala(sala)` (65–67)
Formata nome legível: `"MAURÍCIO DE SOUSA"` + `"6 ANO"` → `"Maurício De Sousa (6º Ano)"`.

### `montar_aluno(aluno, db)` (70–83)
Monta `AlunoResponse` enriquecido com `sala_label` buscando a sala no banco.

### `resumo_da_sala(sala, db)` (86–107)
⭐ **Agregação principal para o gráfico:**
1. Busca alunos da sala  
2. Conta avaliações por aluno  
3. Calcula média de aura  
4. Monta distribuição por nível  
5. Retorna `SalaComResumo`

### Funções de seed (110–153)

**`seed_salas()`:** Para cada sala em `SALAS_INICIAIS`, insere **só se não existir** (nome + ano). Idempotente.

**`seed_alunos()`:** Se não há nenhum aluno, insere os 5 iniciais.

**`sincronizar_aura_alunos()`:** Recalcula aura de cada aluno = base inicial + soma de todas avaliações. Garante consistência após reinício.

### `lifespan` (156–163)

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # cria tabelas se não existirem
    migrar_banco()                          # ajusta colunas legadas
    seed_salas()
    seed_alunos()
    sincronizar_aura_alunos()
    yield  # app fica rodando
```

⭐ Roda **uma vez** quando o Uvicorn sobe.

### App e CORS (166–183)

```python
app = FastAPI(title=..., lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[...5173, 5174...])
```
CORS libera o React (porta 5173/5174) a chamar a API (porta 8000).

### Rotas

| Método | Rota | Função |
|--------|------|--------|
| GET | `/` | Health check |
| GET | `/api/v1/salas/` | Lista salas com resumo |
| GET | `/api/v1/salas/resumo-comportamental` | Dados do gráfico |
| POST | `/api/v1/salas/` | Cadastra sala (409 se duplicada) |
| GET | `/api/v1/alunos/` | Lista alunos |
| GET | `/api/v1/alunos/{id}` | Busca um aluno |
| POST | `/api/v1/alunos/` | Cadastra aluno |
| POST | `/api/v1/avaliacoes/` | Cria avaliação **e atualiza aura** |
| GET | `/api/v1/avaliacoes/aluno/{id}` | Histórico do aluno |
| DELETE | `/api/v1/avaliacoes/{id}` | Remove e **reverte** aura |

#### Decorators explicados:
- `@app.get(...)`: rota HTTP GET  
- `@app.post(...)`: rota HTTP POST  
- `response_model=List[SalaComResumo]`: FastAPI valida e serializa a resposta  
- `status_code=201`: "Created" para POST bem-sucedido  
- `db: Session = Depends(get_db)`: injeta sessão do banco automaticamente  

#### `cadastrar_avaliacao` (274–290) — fluxo crítico:
1. Valida se aluno existe (404 se não)  
2. Cria `Avaliacao`  
3. `aluno.aura = calcular_nova_aura(aluno.aura, form.aura)`  
4. `commit()` persiste ambos  

**RESUMO `main.py`:** único ponto de entrada HTTP + regras de negócio + inicialização.

---

# PARTE 2 — FRONTEND (React/TypeScript)

---

## ARQUIVO: `src/main.tsx`

**PROPÓSITO:** Ponto de entrada do React — monta a aplicação no DOM.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@/index.css";
```
- `StrictMode`: modo rigoroso de desenvolvimento (detecta problemas)  
- `createRoot`: API moderna do React 18+ para renderizar  
- `@/` = alias configurado no Vite para `src/`  
- `index.css`: estilos globais e tema COESI  

```tsx
createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>
);
```
- Busca `<div id="root">` no `index.html`  
- `!` diz ao TypeScript que o elemento existe  
- Renderiza `<App />` dentro de `StrictMode`

---

## ARQUIVO: `src/App.tsx`

**PROPÓSITO:** Define **rotas** (URLs) e qual página cada uma exibe.

```tsx
<BrowserRouter>
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<HomePage />} />           {/* / */}
      <Route path="salas" element={<SalasPage />} />   {/* /salas */}
      <Route path="alunos" element={<AlunosPage />} />
      <Route path="avaliacoes" element={<AvaliacoesPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

- `BrowserRouter`: habilita navegação por URL no navegador  
- `AppLayout`: envolve todas as páginas com header e footer  
- `index`: rota raiz `/`  
⭐ Sem isso, mudar de tela recarregaria a página inteira.

---

## ARQUIVO: `src/lib/api.ts`

**PROPÓSITO:** **Único cliente HTTP** — centraliza todas as chamadas à API Python.

```typescript
const API_BASE = "/api/v1";
```
Prefixo comum. Em dev, o Vite redireciona `/api` → `localhost:8000`.

### `request<T>(url, options?)`
Função genérica interna:
1. `fetch(url)` — API nativa do navegador  
2. Se `!res.ok` → lança `Error` com mensagem  
3. Se status `204` (DELETE) → retorna `undefined`  
4. Senão → `res.json()` tipado como `T`  

### Funções exportadas:
| Função | Endpoint | Ação |
|--------|----------|------|
| `getSalas()` | GET `/salas/` | Lista salas |
| `criarSala()` | POST `/salas/` | Cadastra sala |
| `getResumoComportamental()` | GET `/salas/resumo-comportamental` | Gráfico |
| `getAlunos()` | GET `/alunos/` | Lista alunos |
| `criarAluno()` | POST `/alunos/` | Cadastra aluno |
| `listarAvaliacoes()` | GET `/avaliacoes/aluno/{id}` | Histórico |
| `criarAvaliacao()` | POST `/avaliacoes/` | Nova avaliação |

`getResumoTurma()`: usa `getResumoComportamental()` e calcula só média para a Home (dados já vêm agregados do Python).

---

## ARQUIVO: `src/types/index.ts`

**PROPÓSITO:** Contratos TypeScript espelhando os schemas Python — autocomplete e segurança de tipos.

Cada `type` corresponde a um schema Pydantic:
- `Sala`, `Aluno`, `Avaliacao` = respostas da API  
- `SalaCreate`, `AlunoCreate`, `AvaliacaoCreate` = corpo dos POSTs  
- `NivelAura` = objeto visual (nome, cores) para badges e barras  

⭐ Se a API mudar um campo, o TypeScript avisa onde o front quebra.

---

## ARQUIVO: `src/lib/aura.ts`

**PROPÓSITO:** Lógica **visual** de aura no frontend (cores, níveis, formatação). Não persiste dados.

- `AURA_MIN/MAX = -1000/1000`: escala da **barra visual** (mais ampla que a do backend −10/10)  
- `limitarAura()`: garante valor dentro da escala  
- `auraParaPosicao()`: converte aura em % para posicionar marcador na barra (50% = zero)  
- `getAuraLevel()`: retorna nome + cores COESI por faixa de valor  
- `formatarAuraDiscreta()`: `"+8 aura"`, `"−2 aura"`, `"0 aura"`  
- `formatarSala()`: formata nome da turma para exibição  
- `corNivelSala()` / `corPontuacaoAura()`: cores institucionais  

⭐ Separação correta: **regra de persistência** no Python; **apresentação** no TypeScript.

---

## ARQUIVO: `src/lib/coesi.ts`

**PROPÓSITO:** Paleta de cores institucional em um único objeto `COESI`.  
Evita "cores mágicas" espalhadas pelo código. `as const` torna os valores imutáveis no TypeScript.

---

## ARQUIVO: `src/pages/HomePage.tsx`

**PROPÓSITO:** Página inicial — apresentação do sistema + resumo da turma.

**Estado React:**
- `resumo`: média de aura e total de alunos  
- `carregando` / `erro`: UX de loading e falha  

**`useEffect`:** ao montar a página, chama `getResumoTurma()` → API Python.

**JSX principal:**
- Hero com gradiente COESI  
- Card com média, badge de nível, `AuraBar`, texto discreto  
- Links rápidos para Alunos e Avaliações  

---

## ARQUIVO: `src/pages/AlunosPage.tsx`

**PROPÓSITO:** Listar alunos e cadastrar novos com vínculo à sala.

- `useSearchParams()`: lê `?sala=3` na URL para filtrar alunos de uma sala  
- `recarregar()`: `Promise.all([getAlunos(), getSalas()])` — duas APIs em paralelo  
- `alunosFiltrados`: filtro local por `sala_id`  
- Renderiza `AlunoForm` + grid de `AlunoCard`  

---

## ARQUIVO: `src/pages/AvaliacoesPage.tsx`

**PROPÓSITO:** Registrar avaliações e ver histórico por aluno.

- `alunoParam` da URL (`?aluno=2`) pré-seleciona aluno  
- `carregarAvaliacoes(id)`: busca aluno + lista de avaliações  
- Layout em 2 colunas: `AvaliacaoForm` | `AvaliacaoList`  
- `onSuccess` e `onAlunoChange` recarregam histórico após salvar ou trocar aluno  

---

## ARQUIVO: `src/pages/SalasPage.tsx`

**PROPÓSITO:** Gerenciar salas e exibir panorama comportamental.

- `getResumoComportamental()` → um único endpoint com tudo para gráfico + cards  
- `SalaForm`: cadastro  
- `SalaResumoCards`: 4 indicadores (totais, maior/menor média)  
- `SalaGrafico`: barras por sala  
- `SalaCard`: card individual  
- `EmptyState`: mensagens quando não há dados  

---

## ARQUIVO: `src/components/alunos/AlunoCard.tsx`

**PROPÓSITO:** Card visual de um aluno na listagem.

| Elemento | Função |
|----------|--------|
| Faixa colorida no topo | Cor do nível de aura |
| Avatar com inicial | Identidade visual rápida |
| Badge do nível | Crítico / Baixo / Médio / Alto / Lendário |
| `AuraBar` | Barra bicolor centrada em zero |
| Texto `+X aura` | Pontuação discreta |
| Matrícula e Sala | Metadados |
| Botão | Link para `/avaliacoes?aluno={id}` |

`cn()`: utilitário que combina classes CSS (Tailwind) condicionalmente.

---

## ARQUIVO: `src/components/shared/AuraBar.tsx`

**PROPÓSITO:** Barra de progresso visual da aura.

1. Calcula `posicao` (0–100%) e `nivel` (cores)  
2. Fundo bicolor: vermelho suave (negativo) | ciano suave (positivo)  
3. Linha central = zero  
4. Preenchimento da barra do centro até a posição  
5. Marcador circular na posição exata  
6. `role="progressbar"` + `aria-*` para acessibilidade  

---

## ARQUIVO: `src/components/avaliacoes/AvaliacaoForm.tsx`

**PROPÓSITO:** Formulário de nova avaliação.

**Estado:** `alunoId`, `professor`, `aura`, `comentario`, `mensagem`, `enviando`

**`validarAura()`:** validação UX no cliente (−1000 a 1000) — espelha Pydantic, mas o Python é quem manda.

**`handleSubmit`:**
1. `event.preventDefault()` — não recarrega a página  
2. Valida aura  
3. `criarAvaliacao()` → POST Python  
4. Limpa campos e chama `onSuccess(id)`  

---

## Outros arquivos relevantes

| Arquivo | Responsabilidade |
|---------|------------------|
| `AlunoForm.tsx` | Cadastro de aluno com select de sala |
| `SalaForm.tsx` | Cadastro de sala |
| `SalaCard.tsx` | Card de sala na listagem |
| `SalaGrafico.tsx` | Gráfico de barras por sala |
| `SalaResumoCards.tsx` | 4 cards de indicadores |
| `AvaliacaoList.tsx` | Lista histórico de avaliações |
| `EmptyState.tsx` | Placeholder visual para listas vazias |
| `AppLayout.tsx` | Header + Footer + `<Outlet />` para páginas |
| `SiteHeader.tsx` | Menu: Início, Salas, Alunos, Avaliações |
| `SectionHeader.tsx` | Título padronizado das seções |
| `components/ui/*` | Botões, inputs, cards (shadcn/ui) |
| `vite.config.ts` | Proxy `/api` → `:8000`, alias `@` |
| `index.css` | Tema COESI, variáveis CSS, utilitários |

---

# FLUXO COMPLETO DO SISTEMA

```
┌─────────────┐     HTTP JSON      ┌──────────────┐     SQLAlchemy     ┌──────────┐
│   React     │  ◄──────────────►  │   FastAPI    │  ◄──────────────►  │ SQLite   │
│  (Vite)     │   /api/v1/...      │  main.py     │                    │escola.db │
└─────────────┘                    └──────────────┘                    └──────────┘
      │                                    │
  api.ts (fetch)                    schemas.py (valida)
  pages (UI)                        models.py (tabelas)
  aura.ts (visual)                  database.py (conexão)
```

### Exemplo: registrar avaliação
1. Professor preenche `AvaliacaoForm`  
2. Front valida aura (−1000 a 1000)  
3. `POST /api/v1/avaliacoes/` com JSON  
4. Pydantic valida `AvaliacaoCreate`  
5. Python cria registro em `avaliacoes`  
6. Python recalcula `aluno.aura` com `calcular_nova_aura`  
7. `commit()` no SQLite  
8. JSON de resposta → front mostra sucesso  
9. `AlunosPage` ao recarregar mostra aura atualizada no `AlunoCard`  

### Exemplo: gráfico de salas
1. `SalasPage` chama `getResumoComportamental()`  
2. Python agrega por sala em `resumo_da_sala()`  
3. Retorna JSON com médias e níveis  
4. `SalaGrafico` só **desenha** barras — não calcula médias  

---

# TABELA DE ARQUIVOS

| Arquivo | Camada | Responsabilidade |
|---------|--------|------------------|
| `app/database.py` | Backend | Conexão SQLite, sessão, migrações |
| `app/models.py` | Backend | Tabelas ORM (Sala, Aluno, Avaliacao) |
| `app/schemas.py` | Backend | Validação e serialização JSON |
| `app/main.py` | Backend | Rotas, regras de aura, seed, CORS |
| `requirements.txt` | Backend | Dependências Python |
| `src/main.tsx` | Frontend | Entrada React |
| `src/App.tsx` | Frontend | Rotas |
| `src/lib/api.ts` | Frontend | Cliente HTTP |
| `src/types/index.ts` | Frontend | Tipos TypeScript |
| `src/lib/aura.ts` | Frontend | Cores, níveis, formatação visual |
| `src/lib/coesi.ts` | Frontend | Paleta institucional |
| `src/pages/*.tsx` | Frontend | Telas |
| `src/components/alunos/*` | Frontend | UI de alunos |
| `src/components/salas/*` | Frontend | UI de salas e gráfico |
| `src/components/avaliacoes/*` | Frontend | UI de avaliações |
| `src/components/shared/*` | Frontend | Componentes reutilizáveis |
| `src/components/layout/*` | Frontend | Header, footer, layout |
| `src/components/ui/*` | Frontend | Primitivos visuais (shadcn) |
| `vite.config.ts` | Frontend | Build e proxy dev |

---

## Frases-chave para a apresentação ao professor

1. **"O backend é 100% Python com FastAPI; o frontend só consome a API."**  
2. **"`models.py` define o banco; `schemas.py` valida JSON; `main.py` orquestra tudo."**  
3. **"A aura do aluno é calculada no Python, limitada entre −10 e 10."**  
4. **"Cada avaliação pode valer de −1000 a 1000, mas impacta a aura do aluno dentro do limite."**  
5. **"O gráfico de salas usa agregação do endpoint `resumo-comportamental`, não calcula no navegador."**  
6. **"O seed é idempotente: reiniciar o servidor não duplica salas."**  
