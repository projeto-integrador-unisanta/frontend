import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/homePage';
import { PoliticosPage } from '../pages/politicosPage';
import { PecPage } from '../pages/pecPage';
import { FitPage } from '../pages/fitPage';
import { DeputadoPage } from '../pages/deputadoPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/politicos" element={<PoliticosPage />} />
      <Route path="/pecs" element={<PecPage />} />
      <Route path="/fit" element={<FitPage />} />
      <Route path="/deputado" element={<DeputadoPage />} />
    </Routes>
  );
}
