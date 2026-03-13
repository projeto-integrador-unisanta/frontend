import { usePecs } from '../hooks/usePecs';
import { usePecVotos } from '../hooks/usePecVotos';
import { CardPec } from '../components/cardPec';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { type PEC } from '../models/pec';

export function PecPage() {
  const { pecs, loading, error } = usePecs();
  const { 
    votos, 
    loading: loadingVotos, 
    error: errorVotos, 
    carregarVotos, 
    limparVotos 
  } = usePecVotos();

  const [busca, setBusca] = useState('');
  const [ano, setAno] = useState('');
  const navigate = useNavigate();

  // Estados para o Modal de Votos
  const [pecSelecionada, setPecSelecionada] = useState<PEC | null>(null);
  const [sessaoAberta, setSessaoAberta] = useState<string | null>(null);

  const anos = useMemo(() => {
    const uniqueYears = [...new Set(pecs.map((pec) => pec.ano))];
    return uniqueYears.sort((a, b) => b - a);
  }, [pecs]);

  const pecsFiltradas = useMemo(() => {
    const buscaLower = busca.toLowerCase();
    return pecs.filter((pec) => {
      const identificacao = `${pec.siglaTipo} ${pec.numero}/${pec.ano}`.toLowerCase();
      const matchBusca =
        pec.ementa.toLowerCase().includes(buscaLower) ||
        pec.numero.toString().includes(buscaLower) ||
        pec.siglaTipo.toLowerCase().includes(buscaLower) ||
        (pec.nome_popular && pec.nome_popular.toLowerCase().includes(buscaLower)) ||
        identificacao.includes(buscaLower);
      const matchAno = ano === '' || pec.ano.toString() === ano;
      return matchBusca && matchAno;
    });
  }, [pecs, busca, ano]);

  // Agrupa os deputados por data da sessão e tipo de voto
  const sessoesAgrupadas = useMemo(() => {
    if (!votos?.votos) return [];
    
    const grupos: Record<string, any> = {};
    
    votos.votos.forEach(item => {
      const dataOriginal = item.data_votacao;
      const dataFormatada = new Date(dataOriginal).toLocaleDateString('pt-BR');
      const id = dataOriginal; 
      
      if (!grupos[id]) {
        grupos[id] = {
          id,
          titulo: `Sessão ${dataFormatada}`,
          descricao: item.sessao_descricao,
          data: dataOriginal,
          votosSim: [],
          votosNao: [],
          votosOutros: []
        };
      }
      
      const deputadoInfo = {
        nome: item.deputado,
        partido: item.partido,
        estado: item.estado,
        voto: item.voto
      };

      if (item.voto === 'Sim') {
        grupos[id].votosSim.push(deputadoInfo);
      } else if (item.voto === 'Não') {
        grupos[id].votosNao.push(deputadoInfo);
      } else {
        grupos[id].votosOutros.push(deputadoInfo);
      }
    });

    // Calcula os resumos dinâmicos por sessão conforme solicitado
    const sessoesProcessadas = Object.values(grupos).map((sessao: any) => {
      const totalSim = sessao.votosSim.length;
      const totalNao = sessao.votosNao.length + sessao.votosOutros.length;
      return {
        ...sessao,
        resumo: {
          sim: totalSim,
          nao: totalNao,
          total: totalSim + totalNao
        }
      };
    });
    
    return sessoesProcessadas.sort((a: any, b: any) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [votos]);

  // Calcula totais gerais somando todas as sessoes conforme solicitado
  const resumoPrincipal = useMemo(() => {
    if (sessoesAgrupadas.length === 0) return null;
    
    return sessoesAgrupadas.reduce((acc, sessao) => ({
      sim: acc.sim + sessao.resumo.sim,
      nao: acc.nao + sessao.resumo.nao,
      total: acc.total + sessao.resumo.total
    }), { sim: 0, nao: 0, total: 0 });
  }, [sessoesAgrupadas]);

  const handleAbrirVotos = (pec: PEC) => {
    setPecSelecionada(pec);
    setSessaoAberta(null);
    carregarVotos(pec.numero, pec.ano);
  };

  const handleFecharModal = () => {
    setPecSelecionada(null);
    setSessaoAberta(null);
    limparVotos();
  };

  const toggleSessao = (id: string) => {
    setSessaoAberta(sessaoAberta === id ? null : id);
  };

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

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            placeholder="Buscar por número, assunto ou nome popular da PEC..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="md:w-48 border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="">Todos os anos</option>
            {anos.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

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
              <CardPec key={pec.id} pec={pec} onClick={handleAbrirVotos} />
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

      {/* Modal de Votos */}
      {pecSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
            <button
              onClick={handleFecharModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6 flex-shrink-0">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase mb-2 inline-block">
                {pecSelecionada.siglaTipo} {pecSelecionada.numero}/{pecSelecionada.ano}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                {pecSelecionada.nome_popular 
                  ? `${pecSelecionada.nome_popular} (${pecSelecionada.numero}/${pecSelecionada.ano})` 
                  : `Proposta de Emenda à Constituição ${pecSelecionada.numero}/${pecSelecionada.ano}`}
              </h2>

              {/* Resumo de Votos logo abaixo do cabeçalho */}
              {votos && (
                <div className="flex items-center gap-6 bg-blue-50 p-4 rounded-xl border border-blue-100 w-fit">
                  <div className="text-center">
                    <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Total de Votos</div>
                    <div className="text-xl font-black text-blue-900">{votos.total_votos_historicos}</div>
                  </div>
                  {resumoPrincipal && (
                    <>
                      <div className="h-10 w-px bg-blue-200"></div>
                      <div className="text-center">
                        <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Sim</div>
                        <div className="text-xl font-black text-green-600">{resumoPrincipal.sim}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Não</div>
                        <div className="text-xl font-black text-red-600">{resumoPrincipal.nao}</div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6 flex-1 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-800">Sessões de Votação</h3>
                {votos && (
                  <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {votos.status} - {votos.total_votos_historicos} votações totais
                  </span>
                )}
              </div>
              
              {loadingVotos ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="ml-3 text-gray-500">Carregando votações...</p>
                </div>
              ) : errorVotos ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errorVotos}
                </div>
              ) : sessoesAgrupadas.length > 0 ? (
                <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                  {sessoesAgrupadas.map((sessao: any) => (
                    <div key={sessao.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      {/* Cabeçalho da Sessão (Resumo) */}
                      <button 
                        onClick={() => toggleSessao(sessao.id)}
                        className="w-full text-left p-5 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
                              {sessao.titulo}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {sessao.id}</span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-500 leading-tight">
                            {sessao.descricao}
                          </h4>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="text-center">
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Total</div>
                            <div className="text-sm font-bold text-gray-700">{sessao.resumo.total}</div>
                          </div>
                          <div className="h-8 w-px bg-gray-200"></div>
                          <div className="text-center">
                            <div className="text-[10px] text-green-600 font-bold uppercase">Sim</div>
                            <div className="text-sm font-bold text-green-600">{sessao.resumo.sim}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] text-red-600 font-bold uppercase">Não</div>
                            <div className="text-sm font-bold text-red-600">{sessao.resumo.nao}</div>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform ${sessaoAberta === sessao.id ? 'rotate-180' : ''}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Lista de Deputados (Expansível) */}
                      {sessaoAberta === sessao.id && (
                        <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-6">
                          {/* A Favor */}
                          {sessao.votosSim.length > 0 && (
                            <div>
                              <h5 className="text-xs font-bold text-green-600 uppercase mb-3 tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                A Favor ({sessao.votosSim.length})
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sessao.votosSim.map((dep: any, i: number) => (
                                  <div key={i} className="bg-white p-3 rounded-lg border border-green-100 flex items-center justify-between shadow-sm">
                                    <div>
                                      <div className="text-sm font-bold text-gray-900">{dep.nome}</div>
                                      <div className="text-[10px] text-gray-500 uppercase">{dep.partido} - {dep.estado}</div>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-green-100 text-green-700">
                                      Sim
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Contra */}
                          {sessao.votosNao.length > 0 && (
                            <div>
                              <h5 className="text-xs font-bold text-red-600 uppercase mb-3 tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                Contra ({sessao.votosNao.length})
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sessao.votosNao.map((dep: any, i: number) => (
                                  <div key={i} className="bg-white p-3 rounded-lg border border-red-100 flex items-center justify-between shadow-sm">
                                    <div>
                                      <div className="text-sm font-bold text-gray-900">{dep.nome}</div>
                                      <div className="text-[10px] text-gray-500 uppercase">{dep.partido} - {dep.estado}</div>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-red-100 text-red-700">
                                      Não
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Outros (Abstenção, Obstrução, etc) */}
                          {sessao.votosOutros.length > 0 && (
                            <div>
                              <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                Outros ({sessao.votosOutros.length})
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sessao.votosOutros.map((dep: any, i: number) => (
                                  <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
                                    <div>
                                      <div className="text-sm font-bold text-gray-900">{dep.nome}</div>
                                      <div className="text-[10px] text-gray-500 uppercase">{dep.partido} - {dep.estado}</div>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-gray-100 text-gray-700">
                                      {dep.voto}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-6 rounded-xl text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Não foram encontradas sessões de votação para esta PEC.
                </div>
              )}
            </div>

            <button
              onClick={handleFecharModal}
              className="w-full mt-8 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
