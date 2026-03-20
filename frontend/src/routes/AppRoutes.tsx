import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/homePage';
import { PoliticosPage } from '../pages/politicosPage';
import { PecPage } from '../pages/pecPage';
import { FitPage } from '../pages/fitPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/politicos" element={<PoliticosPage />} />
      <Route path="/pecs" element={<PecPage />} />
      <Route path="/fit" element={<FitPage />} /> {/* <-- 2. Adiciona a rota aqui */}
    </Routes>
  );
}
