export function SiteFooter() {
  return (
    <footer className="mt-auto bg-coesi-footer text-white">
      <div className="container-app grid gap-8 py-12 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-lg font-bold text-coesi-red">Farmador de Aura</p>
          <p className="max-w-md text-sm leading-relaxed text-white/90">
            Acompanhamento de alunos e avaliações com clareza, acolhimento e foco no
            protagonismo estudantil.
          </p>
        </div>
        <div>
          <p className="mb-3 text-lg font-bold text-coesi-red">Contato COESI</p>
          <p className="text-sm">79 3212.9800</p>
          <p className="text-sm">atendimento@sercoesi.com.br</p>
        </div>
      </div>
      <div className="bg-coesi-footer-copy py-4 text-center text-sm">
        <div className="container-app">© COESI · Mais que resultados, poder de escolha</div>
      </div>
    </footer>
  );
}
