import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardDeputado } from '../components/cardDeputado';

// Importação dos hooks
import { useDeputadosEstado } from '../hooks/useDeputadosEstado';
import { useDeputadosPartido } from '../hooks/useDeputadosPartido';
import { useEstados } from '../hooks/useEstados';
import { usePartidos } from '../hooks/usePartidos';
import { useDeputados } from '../hooks/useDeputados'; // Hook para "Todos"

export function PoliticosPage() {
  const navigate = useNavigate();

  // Estados dos filtros
  const [busca, setBusca] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [partido, setPartido] = useState('Todos');

  // Listas para os Selects
  const { estados } = useEstados();
  const { partidos } = usePartidos();

  // Instanciamos os hooks.
  // O React gerencia qual useEffect disparar com base nas dependências internas deles.
  const hookGeral = useDeputados();
  const hookEstado = useDeputadosEstado(estado, partido, busca);
  const hookPartido = useDeputadosPartido(partido, estado, busca);

  /**
   * LÓGICA DE SELEÇÃO DE FONTE:
   * Escolhemos qual objeto de hook retornar.
   */
  const fonteAtiva = useMemo(() => {
    if (estado !== 'Todos') return hookEstado;
    if (partido !== 'Todos') return hookPartido;
    return hookGeral;
  }, [estado, partido, hookEstado, hookPartido, hookGeral]);

  // DESESTRUTURAÇÃO: Agora pegamos os dados da fonte selecionada
  const { deputados, loading, error } = fonteAtiva;

  return (
    <div className="grid grid-cols-[280px_1fr] min-h-screen bg-gray-100">
      {/* BARRA LATERAL */}
      <aside className="bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-semibold">Filtros</h2>

        {/* Select Partido */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Partido</label>
          <select
            className="w-full border rounded-lg p-2"
            value={partido}
            onChange={(e) => setPartido(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {partidos.map((p) => (
              <option key={p.id} value={p.sigla}>
                {p.sigla}
              </option>
            ))}
          </select>
        </div>

        {/* Select Estado */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Estado</label>
          <select
            className="w-full border rounded-lg p-2"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {estados.map((e) => (
              <option key={e.id} value={e.sigla}>
                {e.nome} ({e.sigla})
              </option>
            ))}
          </select>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="p-10 flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors w-fit"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para Início
        </button>

        <h1 className="text-3xl font-bold mb-6">Busca de Políticos</h1>

        <input
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-6 border rounded-xl p-3"
        />

        {/* Status de carregamento e contagem */}
        {!loading && (
          <p className="text-gray-600 mb-6">
            {deputados.length} políticos encontrados para{' '}
            {estado === 'Todos' ? 'Brasil' : estado}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-20">Carregando...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deputados.map((dep: any) => (
              <CardDeputado key={dep.id} Deputado={dep} />
            ))}
          </div>
        )}

        {!loading && deputados.length === 0 && (
          <p className="text-center text-gray-500 py-20">
            Nenhum resultado para os filtros aplicados.
          </p>
        )}
      </main>
    </div>
  );
}
