import { useState, useEffect } from 'react';
import {
  mapDeputadoToCharts,
  mapIdeologiaProbabilidades,
} from '../components/mapDeputadoToCharts';

import { ScoreCard } from '../components/scoreCard';
import { RadarCategorias } from '../components/radarCategorias';
import { PieVotos } from '../components/pieVotos';
import { BarCategorias } from '../components/barChart';
import { IdeologiaDistribuicao } from '../components/IdeologiaDistribuicao';
import { HistoricoVotacoes } from '../components/historicoVotacoes';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import type { Deputado } from '../models/deputado';
import { useDeputadoCompleto } from '../hooks/useDeputadoExpandido';

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const dados = location.state as Deputado | null;

  const { ideologia, ideal, loading, error } = useDeputadoCompleto(
    dados?.idApi || '',
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!dados) return <p>Sem dados</p>;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar</p>;
  if (!ideologia || !ideal) return <p>Sem dados suficientes</p>;

  const { categorias, votos } = mapDeputadoToCharts(ideologia);
  const ideologiaData = mapIdeologiaProbabilidades(ideal);
  const votosParaHistorico = dados.votos_recentes || [];

  const handlePecClick = (pecIdentificacao: string) => {
    navigate(`/pecs?busca=${encodeURIComponent(pecIdentificacao)}`);
  };

  const hasData =
    isMounted && categorias?.length > 0 && ideologiaData?.length > 0;
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#001b3d] transition-colors duration-300">
      <Header />
      <div className="space-y-6 bg-gray-100 dark:bg-[#001b3d] min-h-screen transition-colors duration-300">
        {/* ================= CARD PRINCIPAL ================= */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/10 p-6 rounded-2xl shadow border border-transparent dark:border-white/10">
          <div className="flex items-start">
            <div className="relative z-10 flex-shrink-0">
              {dados.fotoUrl && (
                <img
                  src={dados.fotoUrl}
                  alt={dados.nomeUrna}
                  className="w-40 h-56 rounded-2xl object-cover shadow-2xl border-4 border-white dark:border-white/20"
                />
              )}
            </div>

            <div className="relative z-0 -ml-18 pt-2">
              <div className="w-62 h-52 bg-white dark:bg-white/0 shadow-inner flex items-center justify-center border border-gray-100 dark:border-white/10">
                <ScoreCard
                  score={ideologia.ideologia.score}
                  classificacao={ideologia.ideologia.classificacao}
                />
              </div>
            </div>

            <div className="flex-1 pt-4 ml-10">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                {dados.nomeUrna}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                Deputado Federal | {dados.partido} - {dados.estado}
              </p>
              {dados.email && (
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                  {dados.email.toLowerCase()}
                </p>
              )}
            </div>

            <div className="w-full lg:w-[400px] flex-shrink-0 min-w-0">
              <div className="h-[250px] flex flex-col">
                <span className="text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-2">
                  Perfil de Atuação
                </span>
                <div className="flex-1 min-h-0">
                  {hasData ? (
                    <RadarCategorias data={categorias} />
                  ) : (
                    <div className="h-full" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LINHA 1 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-4 bg-white/5 dark:bg-white/5 p-6 rounded-2xl shadow flex flex-col ">
            <HistoricoVotacoes
              votos={votosParaHistorico}
              onPecClick={handlePecClick}
              className="w-full h-[300px]"
            />
          </div>

          <div className="md:col-span-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 2. Proporção de Votos */}
            <div className="lg:col-span-4 bg-white dark:bg-white/5 p-4 rounded-2xl shadow flex flex-col items-center border border-transparent dark:border-white/10">
              <h2 className="font-bold mb-2 text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-widest self-start border-b border-gray-100 dark:border-white/10 w-full pb-1">
                Proporção de Votos
              </h2>
              <div className="flex-1 flex items-center justify-center w-full overflow-hidden min-h-[250px]">
                {hasData ? (
                  <PieVotos data={votos} />
                ) : (
                  <div className="h-full" />
                )}
              </div>
            </div>

            {/* 3. Distribuição Ideológica */}
            <div className="lg:col-span-8 bg-white dark:bg-white/5 p-4 rounded-2xl shadow flex flex-col border border-transparent dark:border-white/10">
              <h2 className="font-bold text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-widest mb-1 border-b border-gray-100 dark:border-white/10 pb-1">
                Distribuição Ideológica
              </h2>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-3 uppercase font-bold">
                Probabilidade baseada nos votos
              </p>
              <div className="flex-1 w-full overflow-hidden min-h-[250px]">
                {hasData && ideologiaData.length > 0 ? (
                  <IdeologiaDistribuicao data={ideologiaData} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs animate-pulse">
                    Carregando...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= LINHA 2: BARRA CATEGORIAS ================= */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow border border-transparent dark:border-white/10">
          <h2 className="font-semibold mb-6 text-lg border-b border-gray-100 dark:border-white/10 pb-2 text-gray-900 dark:text-white">
            Desempenho por Categorias
          </h2>
          <div className="h-[400px] w-full">
            {hasData ? (
              <BarCategorias data={categorias} />
            ) : (
              <div className="h-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
