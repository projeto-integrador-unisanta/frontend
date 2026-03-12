import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/homePage';
import { PoliticosPage } from '../pages/politicosPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/politicos" element={<PoliticosPage />} />
    </Routes>
  );
}
