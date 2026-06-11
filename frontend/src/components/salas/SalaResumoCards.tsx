import { Card, CardContent } from "@/components/ui/card";
import { formatarSala } from "@/lib/aura";
import type { ResumoComportamental } from "@/types";

type SalaResumoCardsProps = {
  resumo: ResumoComportamental;
};

export function SalaResumoCards({ resumo }: SalaResumoCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-coesi-muted-light/30 bg-white">
        <CardContent className="pt-6">
          <p className="text-xs font-bold uppercase text-coesi-muted">Total de salas</p>
          <p className="mt-1 text-3xl font-black text-coesi-blue">{resumo.total_salas}</p>
        </CardContent>
      </Card>
      <Card className="border-coesi-muted-light/30 bg-white">
        <CardContent className="pt-6">
          <p className="text-xs font-bold uppercase text-coesi-muted">Total de alunos</p>
          <p className="mt-1 text-3xl font-black text-coesi-blue">{resumo.total_alunos}</p>
        </CardContent>
      </Card>
      <Card className="border-coesi-muted-light/30 bg-white">
        <CardContent className="pt-6">
          <p className="text-xs font-bold uppercase text-coesi-muted">Maior média</p>
          <p className="mt-1 text-sm font-semibold text-coesi-blue">
            {resumo.sala_maior_media
              ? formatarSala(resumo.sala_maior_media.nome, resumo.sala_maior_media.ano)
              : "—"}
          </p>
          {resumo.sala_maior_media ? (
            <p className="text-lg font-bold text-coesi-cyan">{resumo.sala_maior_media.media_aura}</p>
          ) : null}
        </CardContent>
      </Card>
      <Card className="border-coesi-muted-light/30 bg-white">
        <CardContent className="pt-6">
          <p className="text-xs font-bold uppercase text-coesi-muted">Menor média</p>
          <p className="mt-1 text-sm font-semibold text-coesi-blue">
            {resumo.sala_menor_media
              ? formatarSala(resumo.sala_menor_media.nome, resumo.sala_menor_media.ano)
              : "—"}
          </p>
          {resumo.sala_menor_media ? (
            <p className="text-lg font-bold text-coesi-red">{resumo.sala_menor_media.media_aura}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
