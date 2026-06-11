import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarSala, corNivelSala } from "@/lib/aura";
import type { Sala } from "@/types";

type SalaCardProps = {
  sala: Sala;
};

export function SalaCard({ sala }: SalaCardProps) {
  const cor = corNivelSala(sala.nivel_geral);

  return (
    <Card className="overflow-hidden border-coesi-muted-light/40 bg-white transition-shadow hover:shadow-md">
      <div className="h-1" style={{ backgroundColor: cor }} aria-hidden />
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug text-coesi-blue">
          {formatarSala(sala.nome, sala.ano)}
        </CardTitle>
        {sala.descricao ? <p className="text-sm text-coesi-muted">{sala.descricao}</p> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-coesi-blue/20 text-coesi-blue">
            {sala.total_alunos} aluno{sala.total_alunos !== 1 ? "s" : ""}
          </Badge>
          <span
            className="inline-flex rounded-sm px-2 py-0.5 text-xs font-bold uppercase"
            style={{ backgroundColor: `${cor}22`, color: cor }}
          >
            {sala.nivel_geral}
          </span>
        </div>
        <p className="text-sm text-coesi-muted">
          Média de aura: <strong className="text-coesi-blue">{sala.media_aura}</strong>
          {sala.total_avaliacoes > 0 ? (
            <span className="ml-2">· {sala.total_avaliacoes} avaliações</span>
          ) : null}
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full border-coesi-blue/25 text-coesi-blue"
        >
          <Link to={`/alunos?sala=${sala.id}`}>Ver alunos</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
