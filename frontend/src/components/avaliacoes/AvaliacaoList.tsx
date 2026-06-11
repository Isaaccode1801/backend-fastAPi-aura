import type { Avaliacao } from "@/types";
import { cn } from "@/lib/utils";

type AvaliacaoListProps = {
  avaliacoes: Avaliacao[];
  alunoNome?: string;
  emptyMessage?: string;
};

export function AvaliacaoList({
  avaliacoes,
  alunoNome,
  emptyMessage = "Nenhuma avaliação registrada para este aluno.",
}: AvaliacaoListProps) {
  return (
    <div>
      {alunoNome ? (
        <p className="mb-4 text-sm text-muted-foreground">Histórico de {alunoNome}</p>
      ) : null}

      <ul className="space-y-3" aria-live="polite">
        {avaliacoes.length === 0 ? (
          <li className="text-sm text-muted-foreground">{emptyMessage}</li>
        ) : (
          avaliacoes.map((av) => (
            <li
              key={av.id}
              className={cn(
                "grid grid-cols-[auto_1fr] gap-3 rounded-md bg-muted p-4",
                av.aura >= 0 ? "border-l-4 border-coesi-cyan" : "border-l-4 border-coesi-red"
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-md bg-white text-sm font-bold text-coesi-blue">
                {av.aura > 0 ? "+" : ""}
                {av.aura}
              </div>
              <div>
                <strong className="text-sm">{av.professor}</strong>
                <p className="mt-1 text-sm text-muted-foreground">
                  {av.comentario || "Sem comentário"}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
