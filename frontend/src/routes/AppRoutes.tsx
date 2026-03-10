import { Routes, Route } from 'react-router-dom';
import { PoliticosPage } from '../page/politicosPage';

export function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />

        <Route path="/politicos" element={<PoliticosPage />} />
      </Routes>
  );
}
