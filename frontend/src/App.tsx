import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AlunosPage } from "@/pages/AlunosPage";
import { AvaliacoesPage } from "@/pages/AvaliacoesPage";
import { HomePage } from "@/pages/HomePage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="alunos" element={<AlunosPage />} />
          <Route path="avaliacoes" element={<AvaliacoesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
