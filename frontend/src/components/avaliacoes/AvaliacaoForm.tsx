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

type AvaliacaoFormProps = {
  alunos: Aluno[];
  alunoIdInicial?: number;
  onSuccess: (alunoId: number) => void;
  onAlunoChange?: (alunoId: number) => void;
};

export function AvaliacaoForm({
  alunos,
  alunoIdInicial,
  onSuccess,
  onAlunoChange,
}: AvaliacaoFormProps) {
  const [alunoId, setAlunoId] = useState(String(alunoIdInicial ?? alunos[0]?.id ?? ""));
  const [professor, setProfessor] = useState("");
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(
    null
  );
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(null);
    setEnviando(true);

    try {
      const id = Number(alunoId);
      await criarAvaliacao({
        aluno_id: id,
        professor,
        nota: Number(nota),
        comentario: comentario.trim() || null,
      });

      setMensagem({ tipo: "sucesso", texto: "Avaliação registrada com sucesso." });
      setNota("");
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
        <Label htmlFor="nota">Nota</Label>
        <Input
          id="nota"
          type="number"
          step="0.5"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Ex: 3 ou -2"
          required
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
