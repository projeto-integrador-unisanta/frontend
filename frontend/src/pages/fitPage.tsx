import { useState, useEffect } from 'react';
import { Header } from '../components/Header';

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
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [resultados, setResultados] = useState<PoliticoFit[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITENS_POR_PAGINA = 12;

  // NOVO ESTADO: Controla qual político está com o Modal aberto
  const [politicoSelecionado, setPoliticoSelecionado] = useState<PoliticoFit | null>(null);

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

  const calcularFit = async (pageNumber = 1) => {
    if (selectedTags.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch(`https://backend-de23aa.fly.dev/fit?page=${pageNumber}&limit=${ITENS_POR_PAGINA}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: selectedTags }),
      });
      const data = await res.json();
      
      setResultados(data.deputados || []);
      setCurrentPage(data.pagina_atual || 1);
      setHasMore((data.resultados_nesta_pagina || 0) === ITENS_POR_PAGINA);
    } catch (error) {
      console.error('Erro ao calcular fit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      calcularFit(currentPage + 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      calcularFit(currentPage - 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleCalcularNovo = () => {
    calcularFit(1);
  };

  // Função para fechar o modal se o usuário apertar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPoliticoSelecionado(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="max-w-6xl mx-auto py-12 px-4 flex-1 w-full">
        {/* CABEÇALHO */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-gray-900">
          DESCUBRA SEU MATCH POLÍTICO
        </h1>
        <p className="text-gray-600 mb-10 text-lg max-w-3xl">
          Selecione as pautas com as quais você mais se identifica e descubra quais deputados votam de acordo com o que você pensa.
        </p>

        {/* BLOCO DE TAGS */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-wider">
            Selecione suas pautas:
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {tags.length === 0 ? (
              <p className="text-sm text-gray-400">Carregando pautas...</p>
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
                        ? 'bg-yellow-400 text-[#002B5B] border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)]' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-400 hover:text-yellow-600'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })
            )}
          </div>

          <button
            onClick={handleCalcularNovo}
            disabled={loading || selectedTags.length === 0}
            className="mt-8 w-full md:w-auto px-10 py-4 bg-yellow-400 text-[#002B5B] font-extrabold rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed uppercase tracking-wide shadow-sm"
          >
            {loading ? 'Calculando afinidade...' : 'Calcular Meu Match'}
          </button>
        </div>

        {/* BLOCO DE RESULTADOS */}
        {resultados.length > 0 && (
          <div className="animate-fade-in" id="resultados-grid">
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight uppercase border-b border-gray-200 pb-4 text-gray-900">
              {currentPage === 1 ? 'Seu Top Deputados:' : `Resultados (Pág. ${currentPage}):`}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {resultados.map((politico, index) => {
                const posicaoGlobal = (currentPage - 1) * ITENS_POR_PAGINA + index + 1;

                return (
                  <div
                    key={politico.idApi}
                    onClick={() => setPoliticoSelecionado(politico)} // ABRE O MODAL AQUI
                    className="border border-gray-200 bg-white p-5 rounded-2xl shadow-sm hover:border-yellow-400 hover:shadow-md transition-all flex flex-col group cursor-pointer"
                  >
                    {/* Ranking e Score */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-md">
                        #{posicaoGlobal}
                      </span>
                      <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-600 text-sm font-bold px-3 py-1 rounded-md flex items-center gap-1">
                        🔥 {politico.scoreFit}
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
                      <div className="w-full h-52 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-400">
                        Sem foto
                      </div>
                    )}

                    {/* Dados Básicos */}
                    <h3 className="text-xl font-bold truncate mb-2 text-gray-900" title={politico.nome}>
                      {politico.nome}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p><strong className="text-gray-900">Estado:</strong> {politico.estado}</p>
                      <p><strong className="text-gray-900">Partido:</strong> {politico.partido}</p>
                    </div>

                    {/* Botão Fake pra indicar clique */}
                    <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                      <span className="text-sm font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">
                        Ver Justificativa →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginação */}
            <div className="mt-12 flex items-center justify-center gap-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="px-6 py-3 bg-white text-yellow-600 border border-gray-200 rounded-lg font-bold transition-all hover:border-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              
              <span className="text-gray-500 font-medium">
                Página {currentPage}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!hasMore || loading}
                className="px-6 py-3 bg-white text-yellow-600 border border-gray-200 rounded-lg font-bold transition-all hover:border-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* MODAL DE JUSTIFICATIVA                       */}
      {/* ========================================== */}
      {politicoSelecionado && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setPoliticoSelecionado(null)} // Clicar fora fecha o modal
        >
          <div 
            className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal feche ele
          >
            {/* Botão Fechar (X) */}
            <button 
              onClick={() => setPoliticoSelecionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
              {politicoSelecionado.foto ? (
                <img src={politicoSelecionado.foto} alt="foto" className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-yellow-400 flex items-center justify-center text-gray-400">Sem foto</div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{politicoSelecionado.nome}</h2>
                <p className="text-gray-600">
                  {politicoSelecionado.partido} - {politicoSelecionado.estado}
                </p>
                <span className="inline-block mt-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 text-xs font-bold px-2 py-1 rounded">
                  🔥 Match em {politicoSelecionado.scoreFit} pautas
                </span>
              </div>
            </div>

            {/* Conteúdo com Scroll (Justificativas) */}
            <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Pautas Votadas em Comum:
            </h3>
            
            <div className="overflow-y-auto pr-2 flex-1 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {politicoSelecionado.justificativas?.length > 0 ? (
                politicoSelecionado.justificativas.map((just, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <span className="block text-sm font-bold text-yellow-600 mb-2 uppercase">
                      {just.pec}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {just.ementa}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">Nenhuma justificativa detalhada encontrada.</p>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}