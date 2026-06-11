import { useState } from "react";

import { criarAvaliacao } from "@/lib/api";
import type { Aluno } from "@/types";
import { Button } from "@/components/ui/button";
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

const AURA_MIN = -1000;
const AURA_MAX = 1000;

type AvaliacaoFormProps = {
  alunos: Aluno[];
  alunoIdInicial?: number;
  onSuccess: (alunoId: number) => void;
  onAlunoChange?: (alunoId: number) => void;
};

function validarAura(valor: string): string | null {
  if (valor.trim() === "") {
    return "O campo Aura é obrigatório";
  }

  const numero = Number(valor);
  if (Number.isNaN(numero)) {
    return "O campo Aura é obrigatório";
  }

  if (numero > AURA_MAX) {
    return "A aura não pode ser maior que 1000";
  }

  if (numero < AURA_MIN) {
    return "A aura não pode ser menor que -1000";
  }

  return null;
}

export function AvaliacaoForm({
  alunos,
  alunoIdInicial,
  onSuccess,
  onAlunoChange,
}: AvaliacaoFormProps) {
  const [alunoId, setAlunoId] = useState(String(alunoIdInicial ?? alunos[0]?.id ?? ""));
  const [professor, setProfessor] = useState("");
  const [aura, setAura] = useState("");
  const [comentario, setComentario] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(
    null
  );
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(null);

    const erroAura = validarAura(aura);
    if (erroAura) {
      setMensagem({ tipo: "erro", texto: erroAura });
      return;
    }

    setEnviando(true);

    try {
      const id = Number(alunoId);
      await criarAvaliacao({
        aluno_id: id,
        professor,
        aura: Number(aura),
        comentario: comentario.trim() || null,
      });

      setMensagem({ tipo: "sucesso", texto: "Avaliação registrada com sucesso." });
      setAura("");
      setComentario("");
      onSuccess(id);
    } catch {
      setMensagem({
        tipo: "erro",
        texto: "Não foi possível salvar. Verifique se a API está online.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="aluno">Aluno</Label>
        <Select
          value={alunoId}
          onValueChange={(value) => {
            setAlunoId(value);
            onAlunoChange?.(Number(value));
          }}
        >
          <SelectTrigger id="aluno" aria-label="Selecionar aluno">
            <SelectValue placeholder="Selecione um aluno" />
          </SelectTrigger>
          <SelectContent>
            {alunos.map((aluno) => (
              <SelectItem key={aluno.id} value={String(aluno.id)}>
                {aluno.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professor">Professor</Label>
        <Input
          id="professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          placeholder="Nome do professor"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aura">Aura</Label>
        <Input
          id="aura"
          type="number"
          min={AURA_MIN}
          max={AURA_MAX}
          step={1}
          value={aura}
          onChange={(e) => setAura(e.target.value)}
          placeholder="Ex: 100 ou -200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comentario">
          Comentário <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Descreva o comportamento observado"
        />
      </div>

      {mensagem ? (
        <p
          role="status"
          className={
            mensagem.tipo === "sucesso"
              ? "rounded-md border border-coesi-muted-light bg-[#eef9fe] px-3 py-2 text-sm font-semibold text-coesi-blue-mid"
              : "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-coesi-red"
          }
        >
          {mensagem.texto}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar avaliação"}
      </Button>
    </form>
  );
}
