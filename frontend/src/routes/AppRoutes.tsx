import { Routes, Route } from 'react-router-dom';
import type { Deputado } from '../models/deputado';

export function AppRoutes() {
  const deputado: Deputado = {
    id: 1,
    idApi: 204554,
    idLegislatura: 57,
    nomeUrna: 'João Silva',
    nomeCompleto: 'João da Silva',
    cargo: 'Deputado Federal',
    estadoId: 25,
    partidoId: 10,
    email: 'joao@camara.leg.br',
    fotoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/220593.jpg',
    ativo: true,
    atualizadoEm: null,
  };
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />

      {/* <Route path="/estados" element={<EstadosPage />} /> */}
    </Routes>
  );
}
