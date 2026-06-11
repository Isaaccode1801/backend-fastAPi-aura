import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { AlunoCard } from "@/components/alunos/AlunoCard";
import { AlunoForm } from "@/components/alunos/AlunoForm";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { getAlunos, getSalas } from "@/lib/api";
import type { Aluno, Sala } from "@/types";

export function AlunosPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const filtroSala = searchParams.get("sala");

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  function recarregar() {
    setCarregando(true);
    setErro(null);
    Promise.all([getAlunos(), getSalas()])
      .then(([listaAlunos, listaSalas]) => {
        setAlunos(listaAlunos);
        setSalas(listaSalas);
      })
      .catch(() => setErro("Não foi possível carregar os alunos. Verifique se a API está online."))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    recarregar();
  }, [location.key]);

  const alunosFiltrados = filtroSala
    ? alunos.filter((a) => String(a.sala_id) === filtroSala)
    : alunos;

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
        <div className="mt-8 h-1 bg-coesi-cyan" aria-hidden />
      </section>

      <section className="bg-gradient-to-b from-white to-coesi-surface py-10">
        <div className="container-app space-y-8">
          <AlunoForm salas={salas} salaIdInicial={filtroSala ?? ""} onSuccess={recarregar} />

          <div className="flex items-center justify-between gap-4 border-b border-coesi-muted-light/30 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-coesi-cyan">Turma COESI</p>
              <h2 className="mt-1 text-xl font-semibold text-coesi-blue">
                {filtroSala ? "Alunos da sala selecionada" : "Painel de auras"}
              </h2>
            </div>
            <Badge variant="secondary">
              {carregando ? "..." : `${alunosFiltrados.length} alunos`}
            </Badge>
          </div>

          {carregando ? (
            <p className="text-coesi-muted">Carregando alunos...</p>
          ) : erro ? (
            <p className="rounded-md border border-coesi-red/20 bg-coesi-red/5 px-4 py-3 text-sm text-coesi-red">
              {erro}
            </p>
          ) : alunosFiltrados.length === 0 ? (
            <p className="text-coesi-muted">
              {filtroSala ? "Nenhum aluno nesta sala ainda." : "Nenhum aluno cadastrado ainda."}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {alunosFiltrados.map((aluno) => (
                <AlunoCard key={aluno.id} aluno={aluno} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
