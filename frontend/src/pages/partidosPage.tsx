import { useEffect, useState } from 'react';
import { partidosService } from '../services/partidosService';
import { type Partido } from '../models/partido';

export function PartidosPage() {
  const [partido, setPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    partidosService
      .listarPartido()
      .then((data) => setPartidos(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Partidos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partido.map((partido) => (
          <div
            key={partido.sigla}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            {partido.logoUrl ? (
              <img
                src={partido.logoUrl}
                alt={partido.nome}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                ?
              </div>
            )}

            <div>
              <p className="font-semibold text-lg">{partido.nome}</p>
              <p className="text-gray-500 text-sm">{partido.sigla}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}