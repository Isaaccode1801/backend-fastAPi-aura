import { ArrowRight, ClipboardList, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { AuraBar } from "@/components/shared/AuraBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResumoTurma } from "@/lib/api";

export function HomePage() {
  const location = useLocation();
  const [resumo, setResumo] = useState({ mediaAura: 0, totalAlunos: 0 });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    getResumoTurma()
      .then(setResumo)
      .catch(() => setErro("Não foi possível carregar os dados da turma."))
      .finally(() => setCarregando(false));
  }, [location.key]);

  return (
    <>
      <section className="section-gradient text-white">
        <div className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="space-y-6">
            <SectionHeader
              light
              label="Sistema escolar COESI"
              title="Mais que resultados, cultive a aura dos alunos."
              description="Acompanhe o desenvolvimento dos estudantes, registre avaliações e mantenha um ambiente organizado, acolhedor e alinhado à proposta educacional do COESI."
            />
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/alunos">Ver alunos</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-coesi-blue"
              >
                <Link to="/avaliacoes">Registrar avaliação</Link>
              </Button>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base text-muted-foreground">Resumo da turma</CardTitle>
              {carregando ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : erro ? (
                <p className="text-sm text-coesi-red">{erro}</p>
              ) : (
                <>
                  <p className="text-5xl font-black text-coesi-blue">{resumo.mediaAura}</p>
                  <p className="text-sm text-muted-foreground">
                    média de aura · {resumo.totalAlunos} alunos acompanhados
                  </p>
                </>
              )}
            </CardHeader>
            {!carregando && !erro ? (
              <CardContent>
                <AuraBar aura={resumo.mediaAura} />
              </CardContent>
            ) : null}
          </Card>
        </div>
        <div className="h-4 bg-coesi-cyan" aria-hidden />
      </section>

      <section className="container-app py-16">
        <SectionHeader
          label="Acesso rápido"
          title="Ferramentas principais"
          description="Navegue pelas áreas essenciais do sistema com a mesma clareza visual do portal institucional."
          className="mb-8"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/alunos" className="group">
            <Card className="h-full border-t-4 border-t-coesi-cyan transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-md bg-coesi-cyan text-white">
                  <Users className="size-5" aria-hidden />
                </div>
                <CardTitle>Alunos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Consulte matrícula, nome e nível de aura de cada estudante.
                </p>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-coesi-red transition-all group-hover:gap-2">
                  Explorar <ArrowRight className="size-4" aria-hidden />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/avaliacoes" className="group">
            <Card className="h-full border-t-4 border-t-coesi-red transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-md bg-coesi-red text-white">
                  <ClipboardList className="size-5" aria-hidden />
                </div>
                <CardTitle>Avaliações</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Registre notas, professores e comentários de forma simples.
                </p>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-coesi-red transition-all group-hover:gap-2">
                  Explorar <ArrowRight className="size-4" aria-hidden />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </>
  );
}
