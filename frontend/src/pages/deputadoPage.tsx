import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import type { Deputado } from '../models/deputado';
import { useState, useMemo } from 'react';
import { HistoricoVotacoes } from '../components/historicoVotacoes';

const CATEGORIAS_NOMES = [
  'Bem-estar social',
  'Economia e trabalho',
  'Justiça, leis e segurança',
  'Política e governança',
  'Meio ambiente e recursos naturais',
  'Infraestrutura e urbanização',
  'Direitos humanos e sociedade',
  'Relações internacionais',
  'Ciência, tecnologia e informação',
  'Cultura, esporte e lazer',
];

const getCategoriaMock = (pecNome: string) => {
  if (pecNome.includes('Tributária') || pecNome.includes('Imposto'))
    return 'Economia e trabalho';
  if (pecNome.includes('Reforma')) return 'Política e governança';
  const hash = pecNome.length % CATEGORIAS_NOMES.length;
  return CATEGORIAS_NOMES[hash];
};

export function DeputadoPage() {
  const location = useLocation();
  const dados = location.state as Deputado;
  const navigate = useNavigate();
  const [buscaVoto, setBuscaVoto] = useState('');

  if (!dados) return null;

  const votosReais = dados.votos_recentes || [];

  // Cálculos de Métricas
  const { listaTemas, participacao, topDoisTemas } = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalVotos = 0;

    CATEGORIAS_NOMES.forEach((cat) => (counts[cat] = 0));

    votosReais.forEach((v: any) => {
      const catEfetiva = v.categoria || getCategoriaMock(v.pec);
      if (counts[catEfetiva] !== undefined) {
        counts[catEfetiva] += 0.1;
      }
      totalVotos += 0.1;
    });

    const todosTemas = Object.entries(counts)
      .filter(([_, valor]) => valor > 0)
      .map(([nome, valor]) => ({
        nome,
        valor: Math.min(10, valor).toFixed(2),
      }))
      .sort((a, b) => Number(b.valor) - Number(a.valor));

    return {
      listaTemas: todosTemas,
      topDoisTemas: todosTemas.slice(0, 2),
      participacao: Math.min(10, totalVotos).toFixed(2),
    };
  }, [votosReais]);

  const votosUnicos = Array.from(
    new Map(votosReais.map((v) => [v.pec, v])).values(),
  );

  const votosFiltrados = votosUnicos.filter((v) =>
    v.pec.toLowerCase().includes(buscaVoto.toLowerCase()),
  );

  const handlePecClick = (pecIdentificacao: string) => {
    navigate(`/pecs?busca=${encodeURIComponent(pecIdentificacao)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#001b3d] transition-colors duration-300">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 flex flex-col">
        {/* CABEÇALHO ATUALIZADO */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 p-6 flex-shrink-0">
          <div className="flex-shrink-0">
            {dados.fotoUrl && (
              <img
                src={dados.fotoUrl}
                alt={dados.nomeUrna}
                className="w-32 h-44 rounded-2xl object-cover shadow-xl border-4 border-white dark:border-white/10"
              />
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              {/* Lado Esquerdo: Info Básica */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter dark:text-white mb-1">
                  {dados.nomeUrna}
                </h1>
                <p className="text-blue-600 dark:text-brandAccent font-black tracking-widest uppercase text-[10px] mb-1">
                  Deputado Federal | {dados.partido} - {dados.estado}
                </p>
                {dados.email && (
                  <p className="text-gray-400 dark:text-white/40 font-bold text-[10px] uppercase">
                    {dados.email.toLowerCase()}
                  </p>
                )}
              </div>

              {/* Lado Direito: Top Métricas no Header */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-blue-600 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20">
                  <p className="text-[8px] font-black text-blue-100 uppercase tracking-widest">
                    Participação
                  </p>
                  <p className="text-xl font-black text-white leading-none">
                    {participacao}
                  </p>
                </div>
                {topDoisTemas.map((tema) => (
                  <div
                    key={tema.nome}
                    className="bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10"
                  >
                    <p className="text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest line-clamp-1">
                      {tema.nome}
                    </p>
                    <p className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none">
                      {tema.valor}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-0">
          {/* VOTOS (ESQUERDA) */}
          <HistoricoVotacoes
            votos={votosUnicos}
            onPecClick={handlePecClick}
            getCategoriaMock={getCategoriaMock}
          />
          {/* MÉTRICAS COMPLETAS (DIREITA) */}
          <section className="lg:col-span-4 flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-5 self-start">
            <h4 className="flex-shrink-0 text-[11px] font-black uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-white/10 pb-3 text-gray-400">
              Métricas Detalhadas
            </h4>

            <div className="flex flex-col gap-2">
              {listaTemas.map((m) => (
                <div
                  key={m.nome}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#001b3d]"
                >
                  <span className="text-[10px] font-black uppercase tracking-tight text-gray-500 dark:text-gray-400">
                    {m.nome}
                  </span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {m.valor}
                  </span>
                </div>
              ))}
              <div className="mt-2 bg-blue-600 px-4 py-3 rounded-xl border border-blue-400 text-white shadow-lg shadow-blue-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    Participação Geral
                  </span>
                  <span className="text-xl font-black">{participacao}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
