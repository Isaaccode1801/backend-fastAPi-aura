import type { NivelAura } from "@/types";

export const AURA_MIN = -10;
export const AURA_MAX = 10;

export function limitarAura(aura: number): number {
  return Math.max(AURA_MIN, Math.min(aura, AURA_MAX));
}

export function auraParaPercentual(aura: number): number {
  const limitada = limitarAura(aura);
  return ((limitada - AURA_MIN) / (AURA_MAX - AURA_MIN)) * 100;
}

export function nivelAura(aura: number): NivelAura {
  const valor = limitarAura(aura);

  if (valor >= 7) return { nome: "Lendário", cor: "#27AAE0" };
  if (valor >= 3) return { nome: "Alto", cor: "#122E7D" };
  if (valor >= 0) return { nome: "Médio", cor: "#194598" };
  if (valor >= -5) return { nome: "Baixo", cor: "#828282" };
  return { nome: "Crítico", cor: "#ED3237" };
}
