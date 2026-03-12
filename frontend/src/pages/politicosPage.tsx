import { useState, useMemo } from 'react';
import { CardDeputado } from '../components/cardDeputado';
// Importação dos hooks personalizados para busca de dados
import { useDeputados as useDeputadosEstado } from '../hooks/useDeputadosEstado';
import { useDeputados as useDeputadosPartido } from '../hooks/useDeputadosPartido';
import { useEstados } from '../hooks/useEstados';
import { usePartidos } from '../hooks/usePartidos';

export function PoliticosPage() {
  // Estados locais para controlar os valores dos filtros e busca
  const [busca, setBusca] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [partido, setPartido] = useState('Todos');

  // Carrega as listas de Estados e Partidos para preencher os selects dos filtros
  const { estados } = useEstados();
  const { partidos } = usePartidos();

  /**
   * Lógica de Busca Híbrida:
   * 1. useDeputadosEstado: Busca políticos por Estado na API e filtra Partido/Nome localmente.
   * 2. useDeputadosPartido: Busca políticos por Partido na API e filtra Estado/Nome localmente.
   * Chamamos ambos para que o React gerencie o ciclo de vida, mas escolheremos qual usar abaixo.
   */
  const hookEstado = useDeputadosEstado(estado, partido, busca);
  const hookPartido = useDeputadosPartido(partido, estado, busca);

  /**
   * Decidimos qual fonte de dados usar com base na interação do usuário:
   * - Se o usuário selecionou um Estado específico, priorizamos a busca por Estado na API.
   * - Se o Estado for 'Todos' mas um Partido foi selecionado, usamos a busca por Partido na API.
   * - O filtro de 'busca' (nome) é sempre aplicado localmente dentro dos hooks.
   */
  const { deputados, loading } = useMemo(() => {
    if (estado !== 'Todos') return hookEstado;
    if (partido !== 'Todos') return hookPartido;
    return hookEstado; // Caso padrão (busca todos)
  }, [estado, partido, hookEstado, hookPartido]);

  return (
    <div className="grid grid-cols-[280px_1fr] min-h-screen bg-gray-100">
      {/* COLUNA 1 - BARRA LATERAL DE FILTROS */}
      <aside className="bg-white border-r p-6 space-y-6">
        <h2 className="text-xl font-semibold">Filtros</h2>

        {/* Filtro de Partido */}
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
                {p.sigla} - {p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Estado */}
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

        {/* Filtro de Cargo (Desabilitado pois atualmente só temos Deputados) */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Cargo</label>
          <select className="w-full border rounded-lg p-2" disabled>
            <option>Deputado Federal</option>
          </select>
        </div>
      </aside>

      {/* COLUNA 2 - CONTEÚDO PRINCIPAL */}
      <main className="p-10 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Busca de Políticos</h1>

        {/* Campo de busca por nome (filtro local em tempo real) */}
        <input
          placeholder="Buscar por nome do político..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full mb-6 border rounded-xl p-3"
        />

        <p className="text-gray-600 mb-6">
          {deputados.length} políticos encontrados
        </p>

        {/* Listagem de Cards ou Estado de Carregamento */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl font-medium text-gray-500">Carregando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {deputados.map((dep) => (
              <CardDeputado key={dep.id} Deputado={dep} />
            ))}
          </div>
        )}

        {/* Mensagem de "Não encontrado" */}
        {!loading && deputados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Nenhum político encontrado com esses filtros.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
