import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardDeputado } from '../components/cardDeputado';
import { Header } from '../components/Header';

// Importação dos hooks
import { useDeputadosEstado } from '../hooks/useDeputadosEstado';
import { useDeputadosPartido } from '../hooks/useDeputadosPartido';
import { useEstados } from '../hooks/useEstados';
import { usePartidos } from '../hooks/usePartidos';
import { useDeputados } from '../hooks/useDeputados';

export function PoliticosPage() {
  const navigate = useNavigate();

  // Estados dos filtros
  const [busca, setBusca] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [partido, setPartido] = useState('Todos');

  // 1. ESTADO DE PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 12;

  // Listas para os Selects
  const { estados } = useEstados();
  const { partidos } = usePartidos();

  const hookGeral = useDeputados(busca);
  const hookEstado = useDeputadosEstado(estado, partido, busca);
  const hookPartido = useDeputadosPartido(partido, estado, busca);

  const fonteAtiva = useMemo(() => {
    if (estado !== 'Todos') return hookEstado;
    if (partido !== 'Todos') return hookPartido;
    return hookGeral;
  }, [estado, partido, hookEstado, hookPartido, hookGeral]);

  const { deputados, loading, error } = fonteAtiva;

  // 2. RESETAR PÁGINA AO FILTRAR
  // Sempre que mudar a busca, estado ou partido, voltamos para a página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, estado, partido]);

  // 3. LÓGICA DE PAGINAÇÃO LOCAL
  const totalPaginas = Math.ceil(deputados.length / itensPorPagina);

  const deputadosExibidos = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return deputados.slice(inicio, fim);
  }, [deputados, paginaAtual]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="grid grid-cols-[280px_1fr] flex-1">
        <aside className="bg-white border-r p-6 space-y-6 sticky top-[73px] h-[calc(100vh-73px)]">
          <h2 className="text-xl font-semibold">Filtros</h2>

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

        <main className="p-10 flex flex-col">
          <h1 className="text-3xl font-bold mb-6">Busca de deputados</h1>

          <input
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full mb-6 border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* 4. CONTROLES DE PAGINAÇÃO */}
          {!loading && deputados.length > 0 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-xl mb-6 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500">
                Página <strong>{paginaAtual}</strong> de{' '}
                <strong>{totalPaginas}</strong> ({deputados.length} resultados)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={paginaAtual === 1}
                  onClick={() => {
                    setPaginaAtual((p) => p - 1);
                    window.scrollTo(0, 0);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  Anterior
                </button>
                <button
                  disabled={paginaAtual >= totalPaginas}
                  onClick={() => {
                    setPaginaAtual((p) => p + 1);
                    window.scrollTo(0, 0);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-30 transition-all"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium">
                Carregando base completa de deputados...
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* MAPEAMOS OS EXIBIDOS (SLICE) E NÃO TODOS */}
                {deputadosExibidos.map((dep: any) => (
                  <CardDeputado key={dep.id} Deputado={dep} />
                ))}
              </div>

              {deputados.length === 0 && (
                <p className="text-center text-gray-500 py-20">
                  Nenhum resultado para os filtros aplicados.
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
