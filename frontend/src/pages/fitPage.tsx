import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipagens
interface Tag {
  id: string;
  label: string;
  description: string;
}

interface Justificativa {
  pec: string;
  ementa: string;
}

interface PoliticoFit {
  idApi: number;
  nome: string;
  foto: string | null;
  partido: string;
  estado: string;
  scoreFit: number;
  justificativas: Justificativa[];
}

export function FitPage() {
  const navigate = useNavigate();
  
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [resultados, setResultados] = useState<PoliticoFit[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ATUALIZAÇÃO 1: Novos estados para controlar a paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITENS_POR_PAGINA = 12;

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('https://backend-de23aa.fly.dev/tags');
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.error('Erro ao buscar tags:', error);
      }
    }
    fetchTags();
  }, []);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // ATUALIZAÇÃO 2: Agora a função recebe qual página deve buscar
  const calcularFit = async (pageNumber = 1) => {
    if (selectedTags.length === 0) return;

    setLoading(true);
    try {
      // Passa a página via Query String na URL
      const res = await fetch(`https://backend-de23aa.fly.dev/fit?page=${pageNumber}&limit=${ITENS_POR_PAGINA}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: selectedTags }),
      });
      const data = await res.json();
      
      setResultados(data.deputados || []);
      setCurrentPage(data.pagina_atual || 1);
      
      // Se a API retornou a quantidade máxima do limite, presumimos que tem mais páginas
      setHasMore((data.resultados_nesta_pagina || 0) === ITENS_POR_PAGINA);
    } catch (error) {
      console.error('Erro ao calcular fit:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funções dos botões da paginação
  const handleNextPage = () => {
    if (hasMore) {
      calcularFit(currentPage + 1);
      window.scrollTo({ top: 400, behavior: 'smooth' }); // Rola a tela pra cima
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      calcularFit(currentPage - 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Ao clicar no botão principal, sempre reseta pra página 1
  const handleCalcularNovo = () => {
    calcularFit(1);
  };

  return (
    <div className="min-h-screen bg-[#002B5B] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÃO DE VOLTAR */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-transparent border-none shadow-none text-yellow-400 hover:text-yellow-300 transition-colors mb-8 font-medium group cursor-pointer p-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar para a Home
        </button>

        {/* CABEÇALHO */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
          DESCUBRA SEU FIT POLÍTICO
        </h1>
        <p className="text-white/80 mb-10 text-lg max-w-3xl">
          Selecione as pautas com as quais você mais se identifica e descubra quais deputados votam de acordo com o que você pensa.
        </p>

        {/* BLOCO DE TAGS */}
        <div className="bg-[#001b3d] p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl mb-12">
          <h2 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">
            Selecione suas pautas:
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {tags.length === 0 ? (
              <p className="text-sm text-white/50">Carregando pautas...</p>
            ) : (
              tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    title={tag.description}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                      isSelected
                        ? 'bg-yellow-400 text-[#002B5B] border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' 
                        : 'bg-[#002B5B] text-white/80 border-white/20 hover:border-yellow-400/50 hover:text-yellow-400'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })
            )}
          </div>

          <button
            onClick={handleCalcularNovo} // Chama a função que zera pra pag 1
            disabled={loading || selectedTags.length === 0}
            className="mt-8 w-full md:w-auto px-10 py-4 bg-yellow-400 text-[#002B5B] font-extrabold rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed uppercase tracking-wide"
          >
            {loading ? 'Calculando afinidade...' : 'Calcular Meu Match'}
          </button>
        </div>

        {/* BLOCO DE RESULTADOS */}
        {resultados.length > 0 && (
          <div className="animate-fade-in" id="resultados-grid">
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight uppercase border-b border-white/10 pb-4">
              {currentPage === 1 ? 'Seu Top Deputados:' : `Resultados (Pág. ${currentPage}):`}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {resultados.map((politico, index) => {
                // ATUALIZAÇÃO 3: Cálculo da Posição Global no Ranking (Ex: Pág 2 começa no #13)
                const posicaoGlobal = (currentPage - 1) * ITENS_POR_PAGINA + index + 1;

                return (
                  <div
                    key={politico.idApi}
                    className="border border-white/10 bg-[#001b3d] p-5 rounded-2xl shadow-lg hover:border-white/30 transition-all flex flex-col group"
                  >
                    {/* Ranking e Score */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-white/10 text-white text-sm font-bold px-3 py-1 rounded-md">
                        #{posicaoGlobal}
                      </span>
                      <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-bold px-3 py-1 rounded-md flex items-center gap-1">
                        🔥 {politico.scoreFit} match{politico.scoreFit > 1 ? 'es' : ''}
                      </span>
                    </div>

                    {/* Imagem */}
                    {politico.foto ? (
                      <img
                        src={politico.foto}
                        alt={politico.nome}
                        className="w-full h-52 rounded-xl object-cover object-top mb-4 grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-52 bg-white/5 rounded-xl mb-4 flex items-center justify-center text-white/30">
                        Sem foto
                      </div>
                    )}

                    {/* Dados Básicos */}
                    <h3 className="text-xl font-bold truncate mb-2 text-white" title={politico.nome}>
                      {politico.nome}
                    </h3>
                    <div className="text-sm text-white/70 space-y-1">
                      <p><strong className="text-white">Estado:</strong> {politico.estado}</p>
                      <p><strong className="text-white">Partido:</strong> {politico.partido}</p>
                    </div>

                    {/* JUSTIFICATIVAS */}
                    {politico.justificativas && politico.justificativas.length > 0 && (
                      <details className="mt-4 border-t border-white/10 pt-3 group/details">
                        <summary className="text-sm font-bold text-yellow-400 cursor-pointer hover:text-white transition-colors list-none flex items-center gap-2">
                          <svg className="w-4 h-4 transition-transform group-open/details:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Ver pautas em comum
                        </summary>
                        
                        <div className="mt-3 max-h-40 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                          {politico.justificativas.map((just, idx) => (
                            <div key={idx} className="bg-white/5 rounded-lg p-2.5">
                              <span className="block text-xs font-bold text-yellow-200 mb-1 uppercase tracking-wider">{just.pec}</span>
                              <p className="text-[11px] text-white/70 leading-relaxed line-clamp-3" title={just.ementa}>
                                {just.ementa}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                  </div>
                );
              })}
            </div>

            {/* ATUALIZAÇÃO 4: Botões de Paginação */}
            <div className="mt-12 flex items-center justify-center gap-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="px-6 py-3 bg-[#001b3d] text-yellow-400 border border-yellow-400/30 rounded-lg font-bold transition-all hover:bg-yellow-400/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              
              <span className="text-white/60 font-medium">
                Página {currentPage}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!hasMore || loading}
                className="px-6 py-3 bg-[#001b3d] text-yellow-400 border border-yellow-400/30 rounded-lg font-bold transition-all hover:bg-yellow-400/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}