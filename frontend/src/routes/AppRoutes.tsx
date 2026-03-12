import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/homePage';
import { PoliticosPage } from '../pages/politicosPage';
import { PecPage } from '../pages/pecPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/politicos" element={<PoliticosPage />} />
      <Route path="/pecs" element={<PecPage />} />
    </Routes>
  );
}
