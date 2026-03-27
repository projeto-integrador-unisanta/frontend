import { useState, useMemo, useEffect } from 'react';
import { CardDeputado } from '../components/cardDeputado';
import { Header } from '../components/Header';

// Importação dos hooks
import { useDeputadosEstado } from '../hooks/useDeputadosEstado';
import { useDeputadosPartido } from '../hooks/useDeputadosPartido';
import { useEstados } from '../hooks/useEstados';
import { usePartidos } from '../hooks/usePartidos';
import { useDeputados } from '../hooks/useDeputados';

export function PoliticosPage() {
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
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#001b3d] transition-colors duration-300">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] flex-1">
        <aside className="bg-white dark:bg-[#001529] border-r border-gray-200 dark:border-white/10 p-6 space-y-6 md:sticky md:top-[73px] md:h-[calc(100vh-73px)] transition-colors duration-300">
          <h2 className="text-xl font-semibold dark:text-white">Filtros</h2>

          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Partido
            </label>
            <select
              className="w-full border dark:border-white/10 rounded-lg p-2 bg-white dark:bg-[#001b3d] dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
            <label className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Estado
            </label>
            <select
              className="w-full border dark:border-white/10 rounded-lg p-2 bg-white dark:bg-[#001b3d] dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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

        <main className="p-6 md:p-10 flex flex-col">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">
            Busca de deputados
          </h1>

          <div className="relative mb-6">
            <input
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border dark:border-white/10 rounded-xl p-3 pl-10 shadow-sm bg-white dark:bg-[#001529] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 4. CONTROLES DE PAGINAÇÃO */}
          {!loading && deputados.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-[#001529] p-4 rounded-xl mb-6 shadow-sm border border-gray-200 dark:border-white/10 transition-colors duration-300">
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                Página{' '}
                <strong className="dark:text-white">{paginaAtual}</strong> de{' '}
                <strong className="dark:text-white">{totalPaginas}</strong> (
                {deputados.length} resultados)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={paginaAtual === 1}
                  onClick={() => {
                    setPaginaAtual((p) => p - 1);
                    window.scrollTo(0, 0);
                  }}
                  className="px-4 py-2 border dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white disabled:opacity-30 transition-all font-bold"
                >
                  Anterior
                </button>
                <button
                  disabled={paginaAtual >= totalPaginas}
                  onClick={() => {
                    setPaginaAtual((p) => p + 1);
                    window.scrollTo(0, 0);
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-brandAccent text-white dark:text-gray-900 rounded-lg hover:bg-blue-700 dark:hover:bg-yellow-500 disabled:opacity-30 transition-all font-bold"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-brandAccent"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Carregando base completa de deputados...
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* MAPEAMOS OS EXIBIDOS (SLICE) E NÃO TODOS */}
                {deputadosExibidos.map((dep: any) => (
                  <CardDeputado key={dep.id} Deputado={dep} />
                ))}
              </div>

              {/* CONTROLES DE PAGINAÇÃO (INFERIOR) */}
              {deputados.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-[#001529] p-4 rounded-xl mt-8 shadow-sm border border-gray-200 dark:border-white/10 transition-colors duration-300">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                    Página{' '}
                    <strong className="dark:text-white">{paginaAtual}</strong>{' '}
                    de{' '}
                    <strong className="dark:text-white">{totalPaginas}</strong>{' '}
                    ({deputados.length} resultados)
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={paginaAtual === 1}
                      onClick={() => {
                        setPaginaAtual((p) => p - 1);
                        window.scrollTo(0, 0);
                      }}
                      className="px-4 py-2 border dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white disabled:opacity-30 transition-all font-bold"
                    >
                      Anterior
                    </button>
                    <button
                      disabled={paginaAtual >= totalPaginas}
                      onClick={() => {
                        setPaginaAtual((p) => p + 1);
                        window.scrollTo(0, 0);
                      }}
                      className="px-4 py-2 bg-blue-600 dark:bg-brandAccent text-white dark:text-gray-900 rounded-lg hover:bg-blue-700 dark:hover:bg-yellow-500 disabled:opacity-30 transition-all font-bold"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}

              {deputados.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-20">
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
