import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { AlunoCard } from "@/components/alunos/AlunoCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { getAlunos } from "@/lib/api";
import type { Aluno } from "@/types";

export function AlunosPage() {
  const location = useLocation();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    getAlunos()
      .then(setAlunos)
      .catch(() => setErro("Não foi possível carregar os alunos. Verifique se a API está online."))
      .finally(() => setCarregando(false));
  }, [location.key]);

  return (
    <>
      <section className="section-gradient py-12 text-white sm:py-14">
        <div className="container-app">
          <SectionHeader
            light
            label="Estudantes"
            title="Alunos"
            description="Visualize a aura e o perfil de cada aluno de forma clara e organizada."
          />
        </div>
      </section>

      <section className="container-app py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Badge>{carregando ? "..." : `${alunos.length} alunos cadastrados`}</Badge>
        </div>

        {carregando ? (
          <p className="text-muted-foreground">Carregando alunos...</p>
        ) : erro ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-coesi-red">
            {erro}
          </p>
        ) : alunos.length === 0 ? (
          <p className="text-muted-foreground">Nenhum aluno cadastrado ainda.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {alunos.map((aluno) => (
              <AlunoCard key={aluno.id} aluno={aluno} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
