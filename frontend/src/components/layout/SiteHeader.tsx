import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const LOGO_COESI =
  "https://coesi.com.br/wp-content/themes/coesi/assets/img/logo.png";

const links = [
  { to: "/", label: "Início", end: true },
  { to: "/salas", label: "Salas" },
  { to: "/alunos", label: "Alunos" },
  { to: "/avaliacoes", label: "Avaliações" },
] as const;

export function SiteHeader() {
  return (
    <>
      <div className="bg-coesi-blue-mid py-3 text-white">
        <div className="container-app flex flex-wrap items-center justify-between gap-2 font-display text-xs font-semibold sm:text-sm">
          <span>Colégio COESI · Plataforma escolar</span>
          <span>Aracaju/SE</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-coesi-nav">
        <div className="container-app flex flex-col items-stretch justify-between gap-4 py-4 sm:flex-row sm:items-center">
          <NavLink to="/" className="flex items-center gap-3" aria-label="Ir para início">
            <img src={LOGO_COESI} alt="COESI" className="h-10 w-auto" />
            <span className="hidden h-8 w-px bg-border sm:block" aria-hidden />
            <span className="font-display text-sm font-bold text-coesi-blue sm:text-base">
              Farmador de Aura
            </span>
          </NavLink>

          <nav className="flex flex-wrap gap-1" aria-label="Principal">
            {links.map(({ to, label, ...rest }) => (
              <NavLink
                key={to}
                to={to}
                {...rest}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-4 py-2 text-sm font-semibold text-coesi-blue transition-colors",
                    isActive ? "bg-white text-coesi-red shadow-sm" : "hover:bg-white/80"
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
