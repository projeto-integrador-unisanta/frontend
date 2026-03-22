import { type PEC } from '../models/pec';
import { type VotosPEC } from '../models/pecVotos';
import { useMemo, useState } from 'react';

interface PecVotesModalProps {
  pec: PEC;
  votos: VotosPEC | null;
  loadingVotos: boolean;
  errorVotos: string | null;
  onClose: () => void;
  onAbrirPolitico: (nome: string) => void;
}

export function PecVotesModal({ 
  pec, 
  votos, 
  loadingVotos, 
  errorVotos, 
  onClose, 
  onAbrirPolitico 
}: PecVotesModalProps) {
  const [sessaoAberta, setSessaoAberta] = useState<string | null>(null);
  const [buscaPolitico, setBuscaPolitico] = useState('');

  const toggleSessao = (id: string) => {
    setSessaoAberta(sessaoAberta === id ? null : id);
  };

  // Agrupa os deputados por data da sessão e tipo de voto
  const sessoesAgrupadas = useMemo(() => {
    if (!votos?.votos) return [];
    
    const grupos: Record<string, any> = {};
    
    votos.votos.forEach(item => {
      const dataOriginal = item.data_votacao;
      const dataFormatada = new Date(dataOriginal).toLocaleDateString('pt-BR');
      const id = `${dataOriginal}-${item.sessao_descricao}`; 
      
      if (!grupos[id]) {
        grupos[id] = {
          id,
          titulo: `Sessão ${dataFormatada}`,
          descricao: item.sessao_descricao,
          data: dataOriginal,
          votosSim: [],
          votosNao: [],
          votosAbstencao: [],
          votosOutros: [],
          politicosAdicionados: new Set() 
        };
      }
      
      if (grupos[id].politicosAdicionados.has(item.deputado)) {
        return;
      }
      
      grupos[id].politicosAdicionados.add(item.deputado);

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
      } else if (item.voto === 'Abstenção') {
        grupos[id].votosAbstencao.push(deputadoInfo);
      } else {
        grupos[id].votosOutros.push(deputadoInfo);
      }
    });

    const sessoesProcessadas = Object.values(grupos).map((sessao: any) => {
      const totalSim = sessao.votosSim.length;
      const totalNao = sessao.votosNao.length;
      const totalAbs = sessao.votosAbstencao.length;
      const totalOutros = sessao.votosOutros.length;
      
      return {
        ...sessao,
        resumo: {
          sim: totalSim,
          nao: totalNao,
          abs: totalAbs,
          total: totalSim + totalNao + totalAbs + totalOutros
        }
      };
    });
    
    return sessoesProcessadas.sort((a: any, b: any) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [votos]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 flex-shrink-0">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase mb-2 inline-block">
            {pec.siglaTipo} {pec.numero}/{pec.ano}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {pec.nome_popular 
              ? `${pec.nome_popular} (${pec.numero}/${pec.ano})` 
              : `Proposta de Emenda à Constituição ${pec.numero}/${pec.ano}`}
          </h2>
        </div>

        <div className="border-t border-gray-100 pt-6 flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">Sessões de Votação</h3>
              {votos && (
                <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {votos.status}
                </span>
              )}
            </div>

            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Pesquisar político na sessão..."
                value={buscaPolitico}
                onChange={(e) => setBuscaPolitico(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
              <svg 
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
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
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${sessaoAberta === sessao.id ? 'rotate-180' : ''}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {sessaoAberta === sessao.id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-6">
                      {(() => {
                        const filtrar = (lista: any[]) => 
                          lista.filter(d => d.nome.toLowerCase().includes(buscaPolitico.toLowerCase()));
                        
                        const simFiltrados = filtrar(sessao.votosSim);
                        const naoFiltrados = filtrar(sessao.votosNao);
                        const outrosFiltrados = filtrar(sessao.votosOutros);
                        const totalEncontrados = simFiltrados.length + naoFiltrados.length + outrosFiltrados.length;

                        if (buscaPolitico && totalEncontrados === 0) {
                          return (
                            <div className="text-center py-4 text-gray-500 text-sm italic">
                              Nenhum político encontrado com "{buscaPolitico}" nesta sessão.
                            </div>
                          );
                        }

                        return (
                          <>
                            {/* A Favor */}
                            {simFiltrados.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-green-600 uppercase mb-3 tracking-wider flex items-center gap-2">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  A Favor ({simFiltrados.length})
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {simFiltrados.map((dep: any, i: number) => (
                                    <button 
                                      key={i}
                                      onClick={() => onAbrirPolitico(dep.nome)}
                                      className="bg-white p-3 rounded-xl border border-green-50 hover:border-green-200 hover:bg-green-50/30 transition-all flex items-center justify-between shadow-sm group text-left"
                                    >
                                      <div>
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dep.nome}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-medium">{dep.partido} - {dep.estado}</div>
                                      </div>
                                      <span className="text-[10px] font-black px-2 py-1 rounded-lg uppercase bg-green-100 text-green-700">
                                        Sim
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Contra */}
                            {naoFiltrados.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-red-600 uppercase mb-3 tracking-wider flex items-center gap-2">
                                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                  Contra ({naoFiltrados.length})
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {naoFiltrados.map((dep: any, i: number) => (
                                    <button 
                                      key={i}
                                      onClick={() => onAbrirPolitico(dep.nome)}
                                      className="bg-white p-3 rounded-xl border border-red-50 hover:border-red-200 hover:bg-red-50/30 transition-all flex items-center justify-between shadow-sm group text-left"
                                    >
                                      <div>
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dep.nome}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-medium">{dep.partido} - {dep.estado}</div>
                                      </div>
                                      <span className="text-[10px] font-black px-2 py-1 rounded-lg uppercase bg-red-100 text-red-700">
                                        Não
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Outros (Abstenção, Obstrução, etc) */}
                            {outrosFiltrados.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider flex items-center gap-2">
                                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                  Outros ({outrosFiltrados.length})
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {outrosFiltrados.map((dep: any, i: number) => (
                                    <button 
                                      key={i}
                                      onClick={() => onAbrirPolitico(dep.nome)}
                                      className="bg-white p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-between shadow-sm group text-left"
                                    >
                                      <div>
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dep.nome}</div>
                                        <div className="text-[10px] text-gray-500 uppercase font-medium">{dep.partido} - {dep.estado}</div>
                                      </div>
                                      <span className="text-[10px] font-black px-2 py-1 rounded-lg uppercase bg-gray-100 text-gray-700">
                                        {dep.voto}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
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
          onClick={onClose}
          className="w-full mt-8 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
