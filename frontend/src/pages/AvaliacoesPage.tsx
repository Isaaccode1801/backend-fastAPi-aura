import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AvaliacaoForm } from "@/components/avaliacoes/AvaliacaoForm";
import { AvaliacaoList } from "@/components/avaliacoes/AvaliacaoList";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAlunoPorId, getAlunos, listarAvaliacoes } from "@/lib/api";
import type { Aluno, Avaliacao } from "@/types";

export function AvaliacoesPage() {
  const [searchParams] = useSearchParams();
  const alunoParam = searchParams.get("aluno");

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [alunoAtual, setAlunoAtual] = useState<Aluno | undefined>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarAvaliacoes = useCallback(async (alunoId: number) => {
    const aluno = await getAlunoPorId(alunoId);
    setAlunoAtual(aluno);

    try {
      const lista = await listarAvaliacoes(alunoId);
      setAvaliacoes(lista);
      setErro(null);
    } catch {
      setAvaliacoes([]);
      setErro("Não foi possível carregar as avaliações deste aluno.");
    }
  }, []);

  useEffect(() => {
    getAlunos()
      .then((lista) => {
        setAlunos(lista);

        if (lista.length === 0) {
          setCarregando(false);
          return;
        }

        const idInicial = alunoParam ? Number(alunoParam) : lista[0].id;
        return carregarAvaliacoes(idInicial).finally(() => setCarregando(false));
      })
      .catch(() => {
        setErro("Não foi possível carregar os alunos. Verifique se a API está online.");
        setCarregando(false);
      });
  }, [alunoParam, carregarAvaliacoes]);

  return (
    <>
      <section className="section-gradient py-12 text-white sm:py-14">
        <div className="container-app">
          <SectionHeader
            light
            label="Registro pedagógico"
            title="Avaliações"
            description="Cadastre comportamentos e acompanhe o histórico por aluno."
          />
        </div>
      </section>

      <section className="container-app py-10">
        {carregando ? (
          <p className="text-muted-foreground">Carregando avaliações...</p>
        ) : alunos.length === 0 ? (
          <p className="text-muted-foreground">
            Cadastre alunos antes de registrar avaliações.
          </p>
        ) : (
          <>
            {erro ? (
              <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-coesi-red">
                {erro}
              </p>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nova avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvaliacaoForm
                    alunos={alunos}
                    alunoIdInicial={alunoAtual?.id}
                    onSuccess={carregarAvaliacoes}
                    onAlunoChange={carregarAvaliacoes}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvaliacaoList avaliacoes={avaliacoes} alunoNome={alunoAtual?.nome} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </section>
    </>
  );
}
