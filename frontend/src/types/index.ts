export type Aluno = {
  id: number;
  matricula: string;
  nome: string;
  aura: number;
};

export type Avaliacao = {
  id: number;
  aluno_id: number;
  professor: string;
  nota: number;
  comentario: string | null;
};

export type AvaliacaoCreate = {
  aluno_id: number;
  professor: string;
  nota: number;
  comentario?: string | null;
};

export type NivelAura = {
  nome: string;
  cor: string;
};
