import { Card } from "@/components/ui/card";
import { AURA_MAX, AURA_MIN, formatarSala, corNivelSala } from "@/lib/aura";
import { COESI } from "@/lib/coesi";
import type { Sala } from "@/types";

function alturaBarra(media: number): number {
  const pct = ((media - AURA_MIN) / (AURA_MAX - AURA_MIN)) * 100;
  return Math.max(4, Math.min(100, pct));
}

type SalaGraficoProps = {
  salas: Sala[];
};

export function SalaGrafico({ salas }: SalaGraficoProps) {
  return (
    <Card className="border-coesi-muted-light/40 bg-white p-6">
      <div className="mb-4 flex items-center justify-between text-xs text-coesi-muted">
        <span>Média de aura por sala</span>
        <span>
          escala {AURA_MIN} a {AURA_MAX}
        </span>
      </div>
      <div className="flex h-52 items-end justify-between gap-1 overflow-x-auto pb-6 sm:gap-2">
        {salas.map((sala) => (
          <div
            key={sala.id}
            className="flex min-w-[3rem] flex-1 flex-col items-center gap-2"
            title={`${formatarSala(sala.nome, sala.ano)}: média ${sala.media_aura} (${sala.nivel_geral})`}
          >
            <span className="text-xs font-semibold text-coesi-blue">{sala.media_aura}</span>
            <div
              className="w-full max-w-12 rounded-t-md transition-all duration-500"
              style={{
                height: `${alturaBarra(sala.media_aura)}%`,
                backgroundColor: corNivelSala(sala.nivel_geral),
                minHeight: sala.total_alunos > 0 ? "8px" : "2px",
                opacity: sala.total_alunos > 0 ? 1 : 0.25,
              }}
            />
            <span className="max-w-[4.5rem] truncate text-center text-[10px] leading-tight text-coesi-muted sm:max-w-none sm:text-xs">
              {sala.nome.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 h-px w-full" style={{ backgroundColor: COESI.mutedLight }} aria-hidden />
    </Card>
  );
}
