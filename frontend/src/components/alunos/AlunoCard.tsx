import { Link } from "react-router-dom";

import { AuraBar } from "@/components/shared/AuraBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { corPontuacaoAura, formatarAuraDiscreta, getAuraLevel } from "@/lib/aura";
import { cn } from "@/lib/utils";
import type { Aluno } from "@/types";

type AlunoCardProps = {
  aluno: Aluno;
};

export function AlunoCard({ aluno }: AlunoCardProps) {
  const nivel = getAuraLevel(aluno.aura);

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-lg border border-coesi-muted-light/40 bg-white",
        "shadow-[0_4px_20px_rgba(0,37,102,0.06)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-coesi-cyan/30 hover:shadow-[0_8px_28px_rgba(0,37,102,0.1)]"
      )}
    >
      <div
        className="h-1 w-full transition-colors duration-300"
        style={{ backgroundColor: nivel.cor }}
        aria-hidden
      />

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-lg text-xl font-bold text-white shadow-sm"
            style={{
              background: nivel.gradiente ? nivel.corFundo : nivel.cor,
            }}
            aria-hidden
          >
            {aluno.nome.charAt(0)}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle className="font-display text-lg leading-tight text-coesi-blue">
              {aluno.nome}
            </CardTitle>

            <span
              className="inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-bold tracking-wide uppercase"
              style={
                nivel.gradiente
                  ? { background: nivel.corFundo, color: nivel.corTexto }
                  : {
                      backgroundColor: nivel.corFundo,
                      color: nivel.corTexto,
                      border: `1px solid ${nivel.cor}33`,
                    }
              }
            >
              {nivel.nome}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <AuraBar aura={aluno.aura} />

        <p className="text-sm font-medium" style={{ color: corPontuacaoAura(aluno.aura) }}>
          {formatarAuraDiscreta(aluno.aura)}
        </p>

        <p className="text-xs text-coesi-muted">Matrícula {aluno.matricula}</p>
        <p className="text-xs text-coesi-muted-light">
          Sala:{" "}
          <span className="font-medium text-coesi-blue-mid">
            {aluno.sala_label ?? "Sem sala"}
          </span>
        </p>
      </CardContent>

      <CardFooter className="border-t border-coesi-muted-light/25 bg-coesi-surface/60 px-6 py-4">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full border-coesi-blue/25 text-coesi-blue hover:border-coesi-blue hover:bg-coesi-blue hover:text-white"
        >
          <Link to={`/avaliacoes?aluno=${aluno.id}`}>Registrar avaliação</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
