import { usePecs } from '../hooks/usePecs';
import { CardPec } from '../components/cardPec';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export function PecPage() {
  const { pecs, loading, error } = usePecs();
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  const pecsFiltradas = useMemo(() => {
    return pecs.filter((pec) =>
      pec.ementa.toLowerCase().includes(busca.toLowerCase()) ||
      pec.numero.toString().includes(busca)
    );
  }, [pecs, busca]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <main className="max-w-6xl mx-auto flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Início
        </button>

        <h1 className="text-3xl font-bold mb-6">Busca de PECs</h1>

        <input
          placeholder="Buscar por número ou assunto da PEC..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-6 border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <p className="text-gray-600 mb-6">
          {pecsFiltradas.length} PECs encontradas
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl font-medium text-gray-500">Carregando...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pecsFiltradas.map((pec) => (
              <CardPec key={pec.id} pec={pec} />
            ))}
          </div>
        )}

        {!loading && pecsFiltradas.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Nenhuma PEC encontrada com esses filtros.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
