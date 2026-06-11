import { useCallback, useEffect, useState } from "react";

import { SalaCard } from "@/components/salas/SalaCard";
import { SalaForm } from "@/components/salas/SalaForm";
import { SalaGrafico } from "@/components/salas/SalaGrafico";
import { SalaResumoCards } from "@/components/salas/SalaResumoCards";
import { EmptyState } from "@/components/shared/EmptyState";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { getResumoComportamental } from "@/lib/api";
import type { ResumoComportamental } from "@/types";

export function SalasPage() {
  const [resumo, setResumo] = useState<ResumoComportamental | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    setErro(null);
    getResumoComportamental()
      .then(setResumo)
      .catch(() => setErro("Não foi possível carregar as salas. Verifique se a API está online."))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const salas = resumo?.salas ?? [];
  const comDadosGrafico = salas.some((s) => s.total_alunos > 0);

  return (
    <>
      <section className="section-gradient py-12 text-white sm:py-14">
        <div className="container-app">
          <SectionHeader
            light
            label="Turmas COESI"
            title="Salas"
            description="Acompanhe a composição e o comportamento de cada turma com clareza e organização."
          />
        </div>
        <div className="mt-8 h-1 bg-coesi-cyan" aria-hidden />
      </section>

      <section className="bg-gradient-to-b from-white to-coesi-surface py-10">
        <div className="container-app space-y-10">
          <SalaForm onSuccess={carregar} />

          {carregando ? (
            <p className="text-coesi-muted">Carregando salas...</p>
          ) : erro ? (
            <p className="rounded-md border border-coesi-red/20 bg-coesi-red/5 px-4 py-3 text-sm text-coesi-red">
              {erro}
            </p>
          ) : salas.length === 0 ? (
            <EmptyState>Nenhuma sala cadastrada ainda. Use o formulário acima para começar.</EmptyState>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-coesi-cyan">
                    Visão geral
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-coesi-blue">
                    Panorama comportamental por sala
                  </h2>
                  <p className="mt-1 text-sm text-coesi-muted">
                    Acompanhe a média de aura e o perfil geral de cada turma
                  </p>
                </div>

                {resumo ? <SalaResumoCards resumo={resumo} /> : null}

                {!comDadosGrafico ? (
                  <EmptyState>
                    Ainda não há alunos vinculados às salas. O gráfico aparecerá quando houver dados
                    suficientes.
                  </EmptyState>
                ) : (
                  <SalaGrafico salas={salas} />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-coesi-muted-light/30 pb-4">
                  <h2 className="text-xl font-semibold text-coesi-blue">Salas cadastradas</h2>
                  <Badge variant="secondary">{salas.length} salas</Badge>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {salas.map((sala) => (
                    <SalaCard key={sala.id} sala={sala} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
