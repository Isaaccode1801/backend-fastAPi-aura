import { useState } from "react";

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
import { criarAluno, formatarSala } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Sala } from "@/types";

type AlunoFormProps = {
  salas: Sala[];
  salaIdInicial?: string;
  onSuccess: () => void;
};

export function AlunoForm({ salas, salaIdInicial = "", onSuccess }: AlunoFormProps) {
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [salaId, setSalaId] = useState(salaIdInicial);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setSalvando(true);
    try {
      await criarAluno({
        matricula: matricula.trim(),
        nome: nome.trim(),
        sala_id: salaId ? Number(salaId) : null,
      });
      setMensagem({ tipo: "ok", texto: "Aluno cadastrado com sucesso." });
      setMatricula("");
      setNome("");
      setSalaId(salaIdInicial);
      onSuccess();
    } catch {
      setMensagem({ tipo: "erro", texto: "Não foi possível cadastrar o aluno." });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Card className="border-coesi-muted-light/40 bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-coesi-blue">Novo aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
            <Select
              value={salaId || "none"}
              onValueChange={(v) => setSalaId(v === "none" ? "" : v)}
            >
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
          {mensagem ? (
            <p
              className={cn(
                "sm:col-span-2 rounded-md px-3 py-2 text-sm font-medium",
                mensagem.tipo === "ok"
                  ? "border border-coesi-cyan/30 bg-coesi-cyan-tint text-coesi-blue-mid"
                  : "border border-coesi-red/20 bg-coesi-red-tint text-coesi-red"
              )}
            >
              {mensagem.texto}
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
  );
}
