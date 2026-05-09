import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { FIT_TAGS_STORAGE_KEY } from '../services/matchService';

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

type Resposta = 'agree' | 'disagree' | 'skip';
type Step = 'intro' | 'quiz' | 'result';

interface Pergunta {
  tag: string;
  titulo: string;
  texto: string;
}

const PERGUNTAS: Pergunta[] = [
  {
    tag: 'pro-vida',
    titulo: 'Aborto',
    texto: 'Você é contra o aborto e defende a vida desde a concepção?',
  },
  {
    tag: 'progressismo',
    titulo: 'Mudanças sociais',
    texto:
      'Você apoia mudanças sociais, novas liberdades e a quebra de tradições antigas?',
  },
  {
    tag: 'conservadorismo',
    titulo: 'Valores tradicionais',
    texto:
      'Você defende a família tradicional, a religião e os costumes clássicos da sociedade?',
  },
  {
    tag: 'liberalismo-economico',
    titulo: 'Liberdade econômica',
    texto:
      'As empresas devem operar com o mínimo de regras e impostos possíveis?',
  },
  {
    tag: 'estado-minimo',
    titulo: 'Tamanho do governo',
    texto:
      'O governo deve ser pequeno, cuidando apenas do essencial (segurança e justiça) e deixando o resto com empresas privadas?',
  },
  {
    tag: 'estado-forte',
    titulo: 'Estado provedor',
    texto:
      'O governo deve ser grande, cobrar mais impostos e cuidar de várias áreas da economia e da sociedade?',
  },
  {
    tag: 'assistencialismo',
    titulo: 'Programas sociais',
    texto:
      'O governo deve oferecer auxílios, bolsas e ajuda financeira para famílias de baixa renda?',
  },
  {
    tag: 'direitos-trabalhistas',
    titulo: 'Direitos trabalhistas',
    texto:
      'A CLT, férias, 13º salário e a proteção de quem trabalha precisam ser preservados?',
  },
  {
    tag: 'direitos-sociais',
    titulo: 'Direitos sociais',
    texto:
      'O governo deve garantir saúde, educação, segurança e moradia para todos os cidadãos?',
  },
  {
    tag: 'meio-ambiente',
    titulo: 'Meio ambiente',
    texto:
      'Proteger a natureza, os animais e combater o desmatamento deve ser uma prioridade nacional?',
  },
  {
    tag: 'politica-identitaria',
    titulo: 'Pautas identitárias',
    texto:
      'Você apoia políticas voltadas a grupos específicos, como movimentos negros, mulheres e LGBTQIA+?',
  },
  {
    tag: 'pauta-bolsonarista',
    titulo: 'Bolsonarismo',
    texto:
      'Você concorda com as pautas e ideias defendidas por Jair Bolsonaro e seus apoiadores?',
  },
  {
    tag: 'anti-establishment',
    titulo: 'Antissistema',
    texto: 'Você é contra o "sistema" e os políticos tradicionais?',
  },
  {
    tag: 'freio-institucional',
    titulo: 'Limite ao STF',
    texto:
      'O Congresso deve ter poder para limitar e frear decisões do STF?',
  },
  {
    tag: 'modernizacao-estado',
    titulo: 'Modernização',
    texto:
      'O governo deve usar tecnologia e cortar burocracia para funcionar de forma mais rápida e barata?',
  },
];

const API_BASE = 'https://backend-de23aa.fly.dev';
const ITENS_POR_PAGINA = 12;

export function FitPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('intro');
  const [tagsValidas, setTagsValidas] = useState<Set<string> | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, Resposta>>({});

  const [tagsFit, setTagsFit] = useState<string[]>([]);
  const [resultados, setResultados] = useState<PoliticoFit[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [politicoSelecionado, setPoliticoSelecionado] =
    useState<PoliticoFit | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`${API_BASE}/tags`);
        const data: { id: string }[] = await res.json();
        setTagsValidas(new Set(data.map((t) => t.id)));
      } catch (err) {
        console.error('Erro ao buscar tags:', err);
        setTagsValidas(new Set());
      }
    }
    fetchTags();
  }, []);

  const perguntas = useMemo(() => {
    if (!tagsValidas || tagsValidas.size === 0) return PERGUNTAS;
    const filtradas = PERGUNTAS.filter((p) => tagsValidas.has(p.tag));
    return filtradas.length > 0 ? filtradas : PERGUNTAS;
  }, [tagsValidas]);

  const totalPerguntas = perguntas.length;
  const perguntaAtual = perguntas[currentIdx];
  const respostaAtual = perguntaAtual ? respostas[perguntaAtual.tag] : undefined;
  const progresso = totalPerguntas > 0 ? ((currentIdx + 1) / totalPerguntas) * 100 : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPoliticoSelecionado(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const calcularFit = async (tags: string[], page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/fit?page=${page}&limit=${ITENS_POR_PAGINA}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags }),
        },
      );
      const data = await res.json();
      setResultados(data.deputados || []);
      setCurrentPage(data.pagina_atual || 1);
      setHasMore((data.resultados_nesta_pagina || 0) === ITENS_POR_PAGINA);
    } catch (err) {
      console.error('Erro ao calcular fit:', err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const finalizarQuiz = async (respostasFinais: Record<string, Resposta>) => {
    const tagsAgrees = Object.entries(respostasFinais)
      .filter(([, v]) => v === 'agree')
      .map(([k]) => k);

    try {
      if (tagsAgrees.length > 0) {
        localStorage.setItem(
          FIT_TAGS_STORAGE_KEY,
          JSON.stringify({ tags: tagsAgrees, salvoEm: Date.now() }),
        );
      } else {
        localStorage.removeItem(FIT_TAGS_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Não foi possível salvar perfil do quiz:', err);
    }

    setTagsFit(tagsAgrees);
    setStep('result');

    if (tagsAgrees.length === 0) {
      setResultados([]);
      setCurrentPage(1);
      setHasMore(false);
      return;
    }
    await calcularFit(tagsAgrees, 1);
  };

  const responder = (resposta: Resposta) => {
    if (!perguntaAtual) return;
    const novasRespostas = { ...respostas, [perguntaAtual.tag]: resposta };
    setRespostas(novasRespostas);

    if (currentIdx < totalPerguntas - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finalizarQuiz(novasRespostas);
    }
  };

  const voltar = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const reiniciarQuiz = () => {
    setStep('intro');
    setCurrentIdx(0);
    setRespostas({});
    setResultados([]);
    setTagsFit([]);
    setCurrentPage(1);
    setHasMore(false);
  };

  const handleNextPage = () => {
    if (hasMore) {
      calcularFit(tagsFit, currentPage + 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      calcularFit(tagsFit, currentPage - 1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#001b3d] flex flex-col transition-colors duration-300">
      <Header />

      <main className="max-w-4xl mx-auto py-12 px-4 flex-1 w-full">
        {step === 'intro' && (
          <section className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-gray-900 dark:text-white">
              DESCUBRA SEU MATCH POLÍTICO
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg max-w-3xl font-medium">
              Responda algumas perguntas sobre temas importantes do país e
              veja quais deputados mais combinam com o que você pensa,
              baseado em como eles votaram de verdade no Congresso.
            </p>

            <div className="bg-white dark:bg-[#001529] p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">🗳️</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Como funciona?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Vamos te fazer{' '}
                    <strong className="text-gray-900 dark:text-white">
                      {totalPerguntas} perguntas
                    </strong>{' '}
                    sobre temas como economia, costumes, meio ambiente e
                    direitos. Em cada uma, escolha entre{' '}
                    <strong className="text-gray-900 dark:text-white">
                      Concordo
                    </strong>
                    ,{' '}
                    <strong className="text-gray-900 dark:text-white">
                      Discordo
                    </strong>{' '}
                    ou{' '}
                    <strong className="text-gray-900 dark:text-white">
                      Pular
                    </strong>
                    . No final, vamos te mostrar os deputados cujos votos
                    mais batem com as pautas que você concorda.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep('quiz')}
                disabled={!tagsValidas}
                className="mt-4 w-full md:w-auto px-10 py-4 bg-yellow-400 dark:bg-brandAccent text-[#002B5B] dark:text-gray-900 font-extrabold rounded-xl hover:bg-yellow-500 dark:hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-sm"
              >
                {tagsValidas ? 'Começar o Teste' : 'Carregando...'}
              </button>
            </div>
          </section>
        )}

        {step === 'quiz' && perguntaAtual && (
          <section className="animate-fade-in">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Pergunta {currentIdx + 1} de {totalPerguntas}
                </span>
                <span className="text-sm font-bold text-yellow-600 dark:text-brandAccent">
                  {Math.round(progresso)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 dark:bg-brandAccent transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#001529] p-8 md:p-12 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
              <span className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-brandAccent text-xs font-black uppercase tracking-widest px-3 py-1 rounded mb-6">
                {perguntaAtual.titulo}
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 leading-snug">
                {perguntaAtual.texto}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => responder('agree')}
                  className={`px-6 py-5 rounded-xl font-extrabold uppercase tracking-wide transition-all border-2 ${
                    respostaAtual === 'agree'
                      ? 'bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'bg-white dark:bg-[#001b3d] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  ✓ Concordo
                </button>
                <button
                  onClick={() => responder('skip')}
                  className={`px-6 py-5 rounded-xl font-extrabold uppercase tracking-wide transition-all border-2 ${
                    respostaAtual === 'skip'
                      ? 'bg-gray-400 border-gray-400 text-white'
                      : 'bg-white dark:bg-[#001b3d] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  ↷ Pular
                </button>
                <button
                  onClick={() => responder('disagree')}
                  className={`px-6 py-5 rounded-xl font-extrabold uppercase tracking-wide transition-all border-2 ${
                    respostaAtual === 'disagree'
                      ? 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : 'bg-white dark:bg-[#001b3d] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  ✕ Discordo
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={voltar}
                disabled={currentIdx === 0}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 font-bold transition-all hover:text-yellow-600 dark:hover:text-brandAccent disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Voltar
              </button>
              <button
                onClick={reiniciarQuiz}
                className="px-6 py-3 text-gray-500 dark:text-gray-500 text-sm font-bold transition-all hover:text-gray-700 dark:hover:text-gray-300"
              >
                Recomeçar
              </button>
            </div>
          </section>
        )}

        {step === 'result' && (
          <section className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  SEU MATCH POLÍTICO
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  {tagsFit.length > 0
                    ? `Baseado em ${tagsFit.length} pauta${tagsFit.length > 1 ? 's' : ''} que você concorda.`
                    : 'Você não concordou com nenhuma pauta para gerar o match.'}
                </p>
              </div>
              <button
                onClick={reiniciarQuiz}
                className="px-6 py-3 bg-white dark:bg-[#001529] text-yellow-600 dark:text-brandAccent border border-gray-200 dark:border-white/10 rounded-lg font-bold transition-all hover:border-yellow-400 dark:hover:border-brandAccent uppercase tracking-wide text-sm"
              >
                Refazer o Teste
              </button>
            </div>

            {loading ? (
              <div className="bg-white dark:bg-[#001529] p-12 rounded-2xl border border-gray-200 dark:border-white/10 text-center">
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Calculando seu match político...
                </p>
              </div>
            ) : resultados.length === 0 ? (
              <div className="bg-white dark:bg-[#001529] p-12 rounded-2xl border border-gray-200 dark:border-white/10 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {tagsFit.length === 0
                    ? 'Marque pelo menos uma pauta como "Concordo" para gerarmos seu match.'
                    : 'Nenhum deputado encontrado com base nas suas respostas.'}
                </p>
                <button
                  onClick={reiniciarQuiz}
                  className="px-8 py-3 bg-yellow-400 dark:bg-brandAccent text-[#002B5B] dark:text-gray-900 font-extrabold rounded-xl hover:bg-yellow-500 transition-colors uppercase tracking-wide"
                >
                  Refazer
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold mb-8 tracking-tight uppercase border-b border-gray-200 dark:border-white/10 pb-4 text-gray-900 dark:text-white">
                  {currentPage === 1
                    ? 'Top Deputados'
                    : `Resultados (Pág. ${currentPage})`}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {resultados.map((politico, index) => {
                    const posicaoGlobal =
                      (currentPage - 1) * ITENS_POR_PAGINA + index + 1;

                    return (
                      <div
                        key={politico.idApi}
                        onClick={() => setPoliticoSelecionado(politico)}
                        className="border border-gray-200 dark:border-white/10 bg-white dark:bg-[#001529] p-5 rounded-2xl shadow-sm hover:border-yellow-400 dark:hover:border-brandAccent hover:shadow-md transition-all flex flex-col group cursor-pointer"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="bg-gray-100 dark:bg-[#001b3d] text-gray-700 dark:text-gray-300 text-sm font-bold px-3 py-1 rounded-md">
                            #{posicaoGlobal}
                          </span>
                          <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-600 dark:text-brandAccent text-sm font-bold px-3 py-1 rounded-md flex items-center gap-1">
                            🔥 {politico.scoreFit}
                          </span>
                        </div>

                        {politico.foto ? (
                          <img
                            src={politico.foto}
                            alt={politico.nome}
                            className="w-full h-52 rounded-xl object-cover object-top mb-4 grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                          />
                        ) : (
                          <div className="w-full h-52 bg-gray-50 dark:bg-[#001b3d] rounded-xl mb-4 flex items-center justify-center text-gray-400">
                            Sem foto
                          </div>
                        )}

                        <h3
                          className="text-xl font-bold truncate mb-2 text-gray-900 dark:text-white"
                          title={politico.nome}
                        >
                          {politico.nome}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                          <p>
                            <strong className="text-gray-900 dark:text-white">
                              Estado:
                            </strong>{' '}
                            {politico.estado}
                          </p>
                          <p>
                            <strong className="text-gray-900 dark:text-white">
                              Partido:
                            </strong>{' '}
                            {politico.partido}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 text-center">
                          <span className="text-sm font-bold text-yellow-600 dark:text-brandAccent group-hover:text-yellow-700 dark:group-hover:text-yellow-500 transition-colors">
                            Ver Justificativa →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || loading}
                    className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#001529] text-yellow-600 dark:text-brandAccent border border-gray-200 dark:border-white/10 rounded-lg font-bold transition-all hover:border-yellow-400 dark:hover:border-brandAccent disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Anterior
                  </button>

                  <span className="text-gray-500 dark:text-gray-400 font-bold">
                    Página {currentPage}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore || loading}
                    className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-[#001529] text-yellow-600 dark:text-brandAccent border border-gray-200 dark:border-white/10 rounded-lg font-bold transition-all hover:border-yellow-400 dark:hover:border-brandAccent disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Próxima →
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </main>

      {politicoSelecionado && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
          onClick={() => setPoliticoSelecionado(null)}
        >
          <div
            className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPoliticoSelecionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-white/10 pb-6">
              {politicoSelecionado.foto ? (
                <img
                  src={politicoSelecionado.foto}
                  alt="foto"
                  className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 border-2 border-yellow-400 flex items-center justify-center text-gray-400">
                  Sem foto
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {politicoSelecionado.nome}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {politicoSelecionado.partido} - {politicoSelecionado.estado}
                </p>
                <span className="inline-block mt-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-brandAccent text-xs font-bold px-2 py-1 rounded">
                  🔥 Match em {politicoSelecionado.scoreFit} pautas
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Pautas Votadas em Comum:
            </h3>

            <div className="overflow-y-auto pr-2 flex-1 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {politicoSelecionado.justificativas?.length > 0 ? (
                politicoSelecionado.justificativas.map((just, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPoliticoSelecionado(null);
                      navigate(`/pecs?busca=${encodeURIComponent(just.pec)}`);
                    }}
                    className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-white/5 hover:border-yellow-200 dark:hover:border-brandAccent hover:bg-yellow-50/50 dark:hover:bg-white/5 transition-all group"
                  >
                    <span className="block text-sm font-black text-gray-400 dark:text-gray-500 uppercase group-hover:text-yellow-600 dark:group-hover:text-brandAccent transition-colors mb-2">
                      {just.pec}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                      {just.ementa}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic">
                  Nenhuma justificativa detalhada encontrada.
                </p>
              )}
            </div>

            <button
              onClick={() => setPoliticoSelecionado(null)}
              className="mt-6 w-full bg-gray-900 dark:bg-brandAccent text-white dark:text-gray-900 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors shadow-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
