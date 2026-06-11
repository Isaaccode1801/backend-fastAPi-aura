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
import { Textarea } from "@/components/ui/textarea";
import { criarSala } from "@/lib/api";
import { cn } from "@/lib/utils";

const ANOS = ["6 ANO", "7 ANO", "8 ANO"] as const;

type SalaFormProps = {
  onSuccess: () => void;
};

export function SalaForm({ onSuccess }: SalaFormProps) {
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState<string>(ANOS[0]);
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMensagem(null);
    setSalvando(true);
    try {
      await criarSala({
        nome: nome.trim(),
        ano,
        descricao: descricao.trim() || null,
      });
      setMensagem({ tipo: "ok", texto: "Sala cadastrada com sucesso." });
      setNome("");
      setDescricao("");
      onSuccess();
    } catch {
      setMensagem({
        tipo: "erro",
        texto: "Não foi possível cadastrar. Verifique se a sala já existe.",
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Card className="border-coesi-muted-light/40 bg-white">
      <CardHeader>
        <CardTitle className="text-lg text-coesi-blue">Nova sala</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
              {salvando ? "Salvando..." : "Cadastrar sala"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
