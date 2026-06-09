import { Link } from "react-router-dom";

import { AuraBar } from "@/components/shared/AuraBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Aluno } from "@/types";

type AlunoCardProps = {
  aluno: Aluno;
};

export function AlunoCard({ aluno }: AlunoCardProps) {
  return (
    <Card className="transition-transform duration-300 hover:-translate-y-1">
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-md bg-coesi-red text-lg font-bold text-white"
          aria-hidden
        >
          {aluno.nome.charAt(0)}
        </div>
        <div>
          <CardTitle className="text-base">{aluno.nome}</CardTitle>
          <p className="text-sm text-muted-foreground">Matrícula {aluno.matricula}</p>
        </div>
      </CardHeader>
      <CardContent>
        <AuraBar aura={aluno.aura} />
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm" asChild>
          <Link to={`/avaliacoes?aluno=${aluno.id}`}>Registrar avaliação</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
