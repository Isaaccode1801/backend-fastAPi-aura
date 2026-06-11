import { COESI } from "@/lib/coesi";
import type { NivelAura } from "@/types";

export const AURA_MIN = -1000;
export const AURA_MAX = 1000;

export function limitarAura(aura: number): number {
  return Math.max(AURA_MIN, Math.min(aura, AURA_MAX));
}

/** Posição na barra (0% = mínimo, 50% = zero, 100% = máximo). */
export function auraParaPosicao(aura: number): number {
  const limitada = limitarAura(aura);
  return ((limitada - AURA_MIN) / (AURA_MAX - AURA_MIN)) * 100;
}

/** @deprecated use auraParaPosicao */
export function auraParaPercentual(aura: number): number {
  return auraParaPosicao(aura);
}

export function getAuraLevel(aura: number): NivelAura {
  const valor = limitarAura(aura);

  if (valor >= 700) {
    return {
      nome: "Lendário",
      cor: COESI.cyan,
      corFundo: `linear-gradient(135deg, ${COESI.blue} 0%, ${COESI.blueSoft} 55%, ${COESI.cyan} 100%)`,
      corTexto: COESI.white,
      gradiente: true,
    };
  }
  if (valor >= 300) {
    return {
      nome: "Alto",
      cor: COESI.cyan,
      corFundo: COESI.cyanTint,
      corTexto: COESI.blueMid,
    };
  }
  if (valor >= 0) {
    return {
      nome: "Médio",
      cor: COESI.blueSoft,
      corFundo: COESI.blueTint,
      corTexto: COESI.blueMid,
    };
  }
  if (valor >= -500) {
    return {
      nome: "Baixo",
      cor: COESI.mutedLight,
      corFundo: COESI.navyTint,
      corTexto: COESI.blue,
    };
  }
  return {
    nome: "Crítico",
    cor: COESI.red,
    corFundo: COESI.redTint,
    corTexto: COESI.redHover,
  };
}

/** Alias para compatibilidade com imports existentes. */
export const nivelAura = getAuraLevel;

export function formatarAuraDiscreta(aura: number): string {
  const valor = limitarAura(aura);
  if (valor > 0) return `+${valor} aura`;
  if (valor < 0) return `−${Math.abs(valor)} aura`;
  return "0 aura";
}

export function formatarSala(nome: string, ano: string): string {
  const anoFmt = ano.replace(" ANO", "º Ano");
  const nomeFmt = nome
    .toLowerCase()
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  return `${nomeFmt} (${anoFmt})`;
}

const COR_NIVEL_SALA: Record<string, string> = {
  Crítico: COESI.red,
  Baixo: COESI.mutedLight,
  Médio: COESI.blueSoft,
  Alto: COESI.cyan,
  Lendário: COESI.blue,
};

export function corNivelSala(nivel: string): string {
  return COR_NIVEL_SALA[nivel] ?? COESI.blueSoft;
}

export function corPontuacaoAura(aura: number): string {
  const valor = limitarAura(aura);
  if (valor > 0) return COESI.blueSoft;
  if (valor < 0) return COESI.red;
  return COESI.muted;
}
