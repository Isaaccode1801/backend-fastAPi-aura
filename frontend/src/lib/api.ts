import type { Aluno, Avaliacao, AvaliacaoCreate } from "@/types";

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
  const alunos = await getAlunos();

  if (alunos.length === 0) {
    return { mediaAura: 0, totalAlunos: 0 };
  }

  const mediaAura = Math.round(
    alunos.reduce((total, aluno) => total + aluno.aura, 0) / alunos.length
  );

  return { mediaAura, totalAlunos: alunos.length };
}

export { auraParaPercentual, limitarAura, nivelAura } from "@/lib/aura";
export { AURA_MIN, AURA_MAX } from "@/lib/aura";
