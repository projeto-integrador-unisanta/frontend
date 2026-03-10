import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EstadosPage } from '../pages/estadosPage';
import { PartidosPage } from '../pages/partidosPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />

        <Route path="/estados" element={<EstadosPage />} />

        <Route path="/partidos" element={<PartidosPage />} />
      </Routes>
    </BrowserRouter>
  );
}
