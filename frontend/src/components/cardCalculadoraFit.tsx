import { useState, useEffect } from 'react';

// Tipagens baseadas no que configuramos no backend
interface Tag {
  id: string;
  label: string;
  description: string;
}

interface PoliticoFit {
  idApi: number;
  nome: string;
  foto: string | null;
  partido: string;
  estado: string;
  scoreFit: number;
}

export function CalculadoraFit() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [resultados, setResultados] = useState<PoliticoFit[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Busca as tags assim que a tela abre
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

  // 2. Controla o clique nas tags (seleciona/deseleciona)
  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // 3. Envia as tags pro backend e pega o ranking
  const calcularFit = async () => {
    if (selectedTags.length === 0) {
      alert('Selecione pelo menos uma pauta!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://backend-de23aa.fly.dev/fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: selectedTags }),
      });
      const data = await res.json();
      setResultados(data);
    } catch (error) {
      console.error('Erro ao calcular fit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Descubra seu Fit Político</h1>
      <p className="text-gray-600 mb-6">
        Selecione as pautas que você mais concorda e descubra quais deputados votam de acordo com o que você pensa.
      </p>

      {/* SEÇÃO 1: SELEÇÃO DE TAGS */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Pautas Disponíveis:</h2>
        
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500">Carregando pautas...</p>
          ) : (
            tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  title={tag.description} // Tooltip nativo mostrando a explicação pra leigos
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    isSelected
                      ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })
          )}
        </div>

        <button
          onClick={calcularFit}
          disabled={loading || selectedTags.length === 0}
          className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculando afinidade...' : 'Calcular Meu Match'}
        </button>
      </div>

      {/* SEÇÃO 2: RESULTADO DOS POLÍTICOS */}
      {resultados.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Seu Top 10:</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resultados.map((politico, index) => (
              <div
                key={politico.idApi}
                className="border border-solid border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col h-full"
              >
                {/* Cabeçalho do Card com a Posição e Score */}
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    🔥 {politico.scoreFit} match{politico.scoreFit > 1 ? 'es' : ''}
                  </span>
                </div>

                {politico.foto ? (
                  <img
                    src={politico.foto}
                    alt={politico.nome}
                    className="w-full h-48 rounded-md object-cover object-top mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400">
                    Sem foto
                  </div>
                )}

                <h3 className="text-lg font-bold truncate" title={politico.nome}>
                  {politico.nome}
                </h3>

                <div className="text-sm text-gray-700 mt-auto pt-2 space-y-1">
                  <p><strong>Partido:</strong> {politico.partido}</p>
                  <p><strong>Estado:</strong> {politico.estado}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}