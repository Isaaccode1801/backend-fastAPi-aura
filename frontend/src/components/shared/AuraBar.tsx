import { COESI } from "@/lib/coesi";
import { AURA_MAX, AURA_MIN, auraParaPosicao, getAuraLevel } from "@/lib/aura";
import { cn } from "@/lib/utils";

type AuraBarProps = {
  aura: number;
  className?: string;
};

export function AuraBar({ aura, className }: AuraBarProps) {
  const posicao = auraParaPosicao(aura);
  const nivel = getAuraLevel(aura);
  const preenchimento =
    aura > 0
      ? { left: "50%", width: `${posicao - 50}%` }
      : aura < 0
        ? { left: `${posicao}%`, width: `${50 - posicao}%` }
        : null;

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full border border-coesi-muted-light/30 bg-white"
        role="progressbar"
        aria-valuenow={aura}
        aria-valuemin={AURA_MIN}
        aria-valuemax={AURA_MAX}
        aria-label={`Aura ${aura}, nível ${nivel.nome}`}
      >
        <div className="absolute inset-0 flex">
          <div
            className="w-1/2"
            style={{
              background: `linear-gradient(90deg, ${COESI.redTint} 0%, ${COESI.surface} 100%)`,
            }}
          />
          <div
            className="w-1/2"
            style={{
              background: `linear-gradient(270deg, ${COESI.cyanTint} 0%, ${COESI.surface} 100%)`,
            }}
          />
        </div>

        <div
          className="absolute top-0 left-1/2 z-10 h-full w-px -translate-x-px bg-coesi-muted-light/80"
          aria-hidden
        />

        {preenchimento ? (
          <div
            className="absolute top-0 z-20 h-full rounded-full transition-all duration-500"
            style={{
              ...preenchimento,
              backgroundColor: nivel.cor,
              opacity: 0.85,
            }}
          />
        ) : null}

        <div
          className="absolute top-1/2 z-30 size-3 -translate-y-1/2 rounded-full border-2 border-white transition-all duration-500"
          style={{
            left: `calc(${posicao}% - 6px)`,
            backgroundColor: nivel.cor,
            boxShadow: `0 1px 4px rgba(0, 37, 102, 0.2)`,
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
