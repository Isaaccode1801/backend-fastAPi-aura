export type Sala = {
  id: number;
  nome: string;
  ano: string;
  descricao: string | null;
  total_alunos: number;
  media_aura: number;
  nivel_geral: string;
  total_avaliacoes: number;
  distribuicao_niveis: Record<string, number>;
};

export type SalaCreate = {
  nome: string;
  ano: string;
  descricao?: string | null;
};

export type ResumoComportamental = {
  total_salas: number;
  total_alunos: number;
  sala_maior_media: Sala | null;
  sala_menor_media: Sala | null;
  salas: Sala[];
};

export type Aluno = {
  id: number;
  matricula: string;
  nome: string;
  aura: number;
  sala_id: number | null;
  sala_label: string | null;
};

export type AlunoCreate = {
  matricula: string;
  nome: string;
  aura?: number;
  sala_id?: number | null;
};

export type Avaliacao = {
  id: number;
  aluno_id: number;
  professor: string;
  aura: number;
  comentario: string | null;
};

export type AvaliacaoCreate = {
  aluno_id: number;
  professor: string;
  aura: number;
  comentario?: string | null;
};

export type NivelAura = {
  nome: string;
  cor: string;
  corFundo: string;
  corTexto: string;
  gradiente?: boolean;
};
