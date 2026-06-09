import { AURA_MAX, AURA_MIN, auraParaPercentual, nivelAura } from "@/lib/aura";
import { cn } from "@/lib/utils";

type AuraBarProps = {
  aura: number;
  className?: string;
};

export function AuraBar({ aura, className }: AuraBarProps) {
  const pct = auraParaPercentual(aura);
  const nivel = nivelAura(aura);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-coesi-blue-mid">{nivel.nome}</span>
        <strong>
          {aura} pts <span className="font-normal text-muted-foreground">({AURA_MIN} a {AURA_MAX})</span>
        </strong>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: nivel.cor }}
          role="progressbar"
          aria-valuenow={aura}
          aria-valuemin={AURA_MIN}
          aria-valuemax={AURA_MAX}
          aria-label={`Aura ${aura} pontos, nível ${nivel.nome}`}
        />
      </div>
    </div>
  );
}
