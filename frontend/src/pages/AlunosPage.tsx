import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { AlunoCard } from "@/components/alunos/AlunoCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { criarAluno, formatarSala, getAlunos, getSalas } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Aluno, Sala } from "@/types";

export function AlunosPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const filtroSala = searchParams.get("sala");

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [salaId, setSalaId] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msgForm, setMsgForm] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

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

  useEffect(() => {
    if (filtroSala) setSalaId(filtroSala);
  }, [filtroSala]);

  const alunosFiltrados = filtroSala
    ? alunos.filter((a) => String(a.sala_id) === filtroSala)
    : alunos;

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setMsgForm(null);
    setSalvando(true);
    try {
      await criarAluno({
        matricula: matricula.trim(),
        nome: nome.trim(),
        sala_id: salaId ? Number(salaId) : null,
      });
      setMsgForm({ tipo: "ok", texto: "Aluno cadastrado com sucesso." });
      setMatricula("");
      setNome("");
      setSalaId(filtroSala ?? "");
      recarregar();
    } catch {
      setMsgForm({ tipo: "erro", texto: "Não foi possível cadastrar o aluno." });
    } finally {
      setSalvando(false);
    }
  }

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
          <Card className="border-coesi-muted-light/40 bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-coesi-blue">Novo aluno</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCadastro} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="aluno-matricula">Matrícula</Label>
                  <Input
                    id="aluno-matricula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Ex: 2026011"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aluno-nome">Nome</Label>
                  <Input
                    id="aluno-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="aluno-sala">Sala</Label>
                  <Select value={salaId || "none"} onValueChange={(v) => setSalaId(v === "none" ? "" : v)}>
                    <SelectTrigger id="aluno-sala">
                      <SelectValue placeholder="Selecione uma sala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem sala</SelectItem>
                      {salas.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {formatarSala(s.nome, s.ano)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {msgForm ? (
                  <p
                    className={cn(
                      "sm:col-span-2 rounded-md px-3 py-2 text-sm font-medium",
                      msgForm.tipo === "ok"
                        ? "border border-coesi-cyan/30 bg-coesi-cyan-tint text-coesi-blue-mid"
                        : "border border-coesi-red/20 bg-coesi-red-tint text-coesi-red"
                    )}
                  >
                    {msgForm.texto}
                  </p>
                ) : null}
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={salvando}>
                    {salvando ? "Salvando..." : "Cadastrar aluno"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

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
