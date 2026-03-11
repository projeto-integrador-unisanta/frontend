import { useState } from 'react';
import { CardDeputado } from '../components/cardDeputado';
import { useDeputados } from '../hooks/useDeputados';

export function PoliticosPage() {
  const [busca, setBusca] = useState('');
  const { deputados, loading } = useDeputados();

  const filtrados = deputados.filter((p) =>
    p.nomeUrna.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-[280px_1fr] min-h-screen bg-gray-100">
      {/* COLUNA 1 - FILTROS */}
      <aside className="bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-semibold">Filtros</h2>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Partido</label>

          <select className="w-full border rounded-lg p-2">
            <option>Todos</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Estado</label>

          <select className="w-full border rounded-lg p-2">
            <option>Todos</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Cargo</label>

          <select className="w-full border rounded-lg p-2">
            <option>Todos</option>
          </select>
        </div>
      </aside>

      {/* COLUNA 2 - CONTEÚDO */}
      <main className="p-10 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Busca de Políticos</h1>

        {/* BARRA DE BUSCA */}
        <input
          placeholder="Buscar por nome do político..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-6 border rounded-xl p-3"
        />

        <p className="text-gray-600 mb-6">
          {filtrados.length} políticos encontrados
        </p>

        {/* GRID DE CARDS */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-3 gap-6 justify-items-center">
            {filtrados.map((dep) => (
              <CardDeputado key={dep.id} Deputado={dep} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
