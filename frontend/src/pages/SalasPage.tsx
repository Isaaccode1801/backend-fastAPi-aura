import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
import { Textarea } from "@/components/ui/textarea";
import { criarSala, formatarSala, getResumoComportamental } from "@/lib/api";
import { corNivelSala } from "@/lib/aura";
import { COESI } from "@/lib/coesi";
import { cn } from "@/lib/utils";
import type { ResumoComportamental, Sala } from "@/types";

const ANOS = ["6 ANO", "7 ANO", "8 ANO"] as const;
const AURA_MIN_GRAFICO = -10;
const AURA_MAX_GRAFICO = 10;

function alturaBarra(media: number): number {
  const pct = ((media - AURA_MIN_GRAFICO) / (AURA_MAX_GRAFICO - AURA_MIN_GRAFICO)) * 100;
  return Math.max(4, Math.min(100, pct));
}

function EstadoVazio({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-coesi-muted-light/50 bg-white px-6 py-12 text-center">
      <p className="text-sm text-coesi-muted">{children}</p>
    </div>
  );
}

export function SalasPage() {
  const [resumo, setResumo] = useState<ResumoComportamental | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [ano, setAno] = useState<string>(ANOS[0]);
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msgForm, setMsgForm] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

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

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setMsgForm(null);
    setSalvando(true);
    try {
      await criarSala({
        nome: nome.trim(),
        ano,
        descricao: descricao.trim() || null,
      });
      setMsgForm({ tipo: "ok", texto: "Sala cadastrada com sucesso." });
      setNome("");
      setDescricao("");
      carregar();
    } catch {
      setMsgForm({ tipo: "erro", texto: "Não foi possível cadastrar. Verifique se a sala já existe." });
    } finally {
      setSalvando(false);
    }
  }

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
          {/* Cadastro */}
          <Card className="border-coesi-muted-light/40 bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-coesi-blue">Nova sala</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCadastro} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sala-nome">Nome da sala</Label>
                  <Input
                    id="sala-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Maurício de Sousa"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sala-ano">Ano / série</Label>
                  <Select value={ano} onValueChange={setAno}>
                    <SelectTrigger id="sala-ano">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANOS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a.replace(" ANO", "º Ano")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="sala-desc">
                    Descrição <span className="font-normal text-muted-foreground">(opcional)</span>
                  </Label>
                  <Textarea
                    id="sala-desc"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Observações sobre a turma"
                    rows={2}
                  />
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
                    {salvando ? "Salvando..." : "Cadastrar sala"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {carregando ? (
            <p className="text-coesi-muted">Carregando salas...</p>
          ) : erro ? (
            <p className="rounded-md border border-coesi-red/20 bg-coesi-red/5 px-4 py-3 text-sm text-coesi-red">
              {erro}
            </p>
          ) : salas.length === 0 ? (
            <EstadoVazio>Nenhuma sala cadastrada ainda. Use o formulário acima para começar.</EstadoVazio>
          ) : (
            <>
              {/* Panorama comportamental */}
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

                {resumo ? (
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
                          <p className="text-lg font-bold text-coesi-cyan">
                            {resumo.sala_maior_media.media_aura}
                          </p>
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
                          <p className="text-lg font-bold text-coesi-red">
                            {resumo.sala_menor_media.media_aura}
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  </div>
                ) : null}

                {!comDadosGrafico ? (
                  <EstadoVazio>
                    Ainda não há alunos vinculados às salas. O gráfico aparecerá quando houver dados
                    suficientes.
                  </EstadoVazio>
                ) : (
                  <Card className="border-coesi-muted-light/40 bg-white p-6">
                    <div className="mb-4 flex items-center justify-between text-xs text-coesi-muted">
                      <span>Média de aura por sala</span>
                      <span>
                        escala {AURA_MIN_GRAFICO} a {AURA_MAX_GRAFICO}
                      </span>
                    </div>
                    <div className="flex h-52 items-end justify-between gap-1 overflow-x-auto pb-6 sm:gap-2">
                      {salas.map((sala) => (
                        <div
                          key={sala.id}
                          className="flex min-w-[3rem] flex-1 flex-col items-center gap-2"
                          title={`${formatarSala(sala.nome, sala.ano)}: média ${sala.media_aura} (${sala.nivel_geral})`}
                        >
                          <span className="text-xs font-semibold text-coesi-blue">{sala.media_aura}</span>
                          <div
                            className="w-full max-w-12 rounded-t-md transition-all duration-500"
                            style={{
                              height: `${alturaBarra(sala.media_aura)}%`,
                              backgroundColor: corNivelSala(sala.nivel_geral),
                              minHeight: sala.total_alunos > 0 ? "8px" : "2px",
                              opacity: sala.total_alunos > 0 ? 1 : 0.25,
                            }}
                          />
                          <span className="max-w-[4.5rem] truncate text-center text-[10px] leading-tight text-coesi-muted sm:max-w-none sm:text-xs">
                            {sala.nome.split(" ")[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="mt-2 h-px w-full"
                      style={{ backgroundColor: COESI.mutedLight }}
                      aria-hidden
                    />
                  </Card>
                )}
              </div>

              {/* Lista de salas */}
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

function SalaCard({ sala }: { sala: Sala }) {
  const cor = corNivelSala(sala.nivel_geral);

  return (
    <Card className="overflow-hidden border-coesi-muted-light/40 bg-white transition-shadow hover:shadow-md">
      <div className="h-1" style={{ backgroundColor: cor }} aria-hidden />
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug text-coesi-blue">
          {formatarSala(sala.nome, sala.ano)}
        </CardTitle>
        {sala.descricao ? (
          <p className="text-sm text-coesi-muted">{sala.descricao}</p>
        ) : null}
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
          Média de aura:{" "}
          <strong className="text-coesi-blue">{sala.media_aura}</strong>
          {sala.total_avaliacoes > 0 ? (
            <span className="ml-2">· {sala.total_avaliacoes} avaliações</span>
          ) : null}
        </p>
        <Button variant="outline" size="sm" asChild className="w-full border-coesi-blue/25 text-coesi-blue">
          <Link to={`/alunos?sala=${sala.id}`}>Ver alunos</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
