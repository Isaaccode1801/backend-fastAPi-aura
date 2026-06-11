import type {
  Aluno,
  AlunoCreate,
  Avaliacao,
  AvaliacaoCreate,
  ResumoComportamental,
  Sala,
  SalaCreate,
} from "@/types";

const API_BASE = "/api/v1";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const mensagem = await res.text().catch(() => `Erro ${res.status}`);
    throw new Error(mensagem || `Erro ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// --- Salas ---

export async function getSalas(): Promise<Sala[]> {
  return request(`${API_BASE}/salas/`);
}

export async function criarSala(dados: SalaCreate): Promise<Sala> {
  return request(`${API_BASE}/salas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

export async function getResumoComportamental(): Promise<ResumoComportamental> {
  return request(`${API_BASE}/salas/resumo-comportamental`);
}

// --- Alunos ---

export async function getAlunos(): Promise<Aluno[]> {
  return request(`${API_BASE}/alunos/`);
}

export async function getAlunoPorId(id: number): Promise<Aluno | undefined> {
  try {
    return await request<Aluno>(`${API_BASE}/alunos/${id}`);
  } catch {
    return undefined;
  }
}

export async function criarAluno(dados: AlunoCreate): Promise<Aluno> {
  return request(`${API_BASE}/alunos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

// --- Avaliações ---

export async function listarAvaliacoes(alunoId: number): Promise<Avaliacao[]> {
  return request(`${API_BASE}/avaliacoes/aluno/${alunoId}`);
}

export async function criarAvaliacao(dados: AvaliacaoCreate): Promise<Avaliacao> {
  return request(`${API_BASE}/avaliacoes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

export async function getResumoTurma(): Promise<{
  mediaAura: number;
  totalAlunos: number;
}> {
  const resumo = await getResumoComportamental();
  const comAlunos = resumo.salas.filter((s) => s.total_alunos > 0);
  const mediaAura =
    comAlunos.length > 0
      ? Math.round(
          comAlunos.reduce((t, s) => t + s.media_aura, 0) / comAlunos.length
        )
      : 0;

  return { mediaAura, totalAlunos: resumo.total_alunos };
}

export {
  auraParaPercentual,
  auraParaPosicao,
  corNivelSala,
  corPontuacaoAura,
  formatarAuraDiscreta,
  formatarSala,
  getAuraLevel,
  limitarAura,
  nivelAura,
} from "@/lib/aura";
export { AURA_MIN, AURA_MAX } from "@/lib/aura";
