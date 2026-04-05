import { type metricaExpandida } from '../models/metricaExpandida';
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
import { useNavigate } from 'react-router-dom';
import { use } from 'react';
import { Header } from '../components/Header';

type Props = {
  deputado: metricaExpandida;
};

export function Dashboard({ deputado }: Props) {
  const { categorias, votos } = mapDeputadoToCharts(deputado);
  const ideologiaData = mapIdeologiaProbabilidades(deputado);
  const votosParaHistorico = deputado.deputado.votos_recentes || [];
  const navigate = useNavigate();

  const handlePecClick = (pecIdentificacao: string) => {
    navigate(`/pecs?busca=${encodeURIComponent(pecIdentificacao)}`);
  };

  return (
    // Alterado: bg-gray-100 -> dark:bg-[#001b3d]
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#001b3d] transition-colors duration-300">
      <Header />
      <div className="space-y-6 bg-gray-100 dark:bg-[#001b3d] min-h-screen transition-colors duration-300">
        {/* ================= CARD PRINCIPAL (FOTO + SCORE + Radar) ================= */}
        {/* Alterado: Adicionado dark:from-white/5 dark:to-white/10 e borda sutil */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/10 p-6 rounded-2xl shadow border border-transparent dark:border-white/10">
          <div className="flex items-start">
            <div className="relative z-10 flex-shrink-0">
              {deputado.deputado.fotoUrl && (
                <img
                  src={deputado.deputado.fotoUrl}
                  alt={deputado.deputado.nomeUrna}
                  className="w-40 h-56 rounded-2xl object-cover shadow-2xl border-4 border-white dark:border-white/20"
                />
              )}
            </div>

            <div className="relative z-0 -ml-18 pt-2">
              {/* Alterado: bg-white -> dark:bg-[#001b3d] */}
              <div className="w-62 h-52 bg-white dark:bg-white/0  shadow-inner flex items-center justify-center border border-gray-100 dark:border-white/10">
                <ScoreCard
                  score={deputado.ideologia.score}
                  classificacao={deputado.ideologia.classificacao}
                />
              </div>
            </div>

            <div className="flex-1 pt-4 ml-10">
              {/* Alterado: text-gray-900 -> dark:text-white */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                {deputado.deputado.nomeUrna}
              </h1>
              {/* Alterado: text-gray-500 -> dark:text-gray-400 */}
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                Deputado Federal | {deputado.partido} - {deputado.estado}
              </p>

              {deputado.deputado.email && (
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                  {deputado.deputado.email.toLowerCase()}
                </p>
              )}
            </div>

            {/* No Dashboard, onde você chama o RadarCategorias */}
            <div className="w-full lg:w-[400px] flex-shrink-0 min-w-0">
              <div className="h-[250px] flex flex-col">
                {' '}
                {/* Aumentei um pouco a altura para acomodar as labels */}
                <span className="text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-2">
                  Perfil de Atuação
                </span>
                <div className="flex-1 min-h-0">
                  {/* Garanta que dentro de <RadarCategorias> o ResponsiveContainer tenha minWidth={0} */}
                  <RadarCategorias data={categorias} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LINHA 1: PIE E IDEOLOGIA (LADO A LADO) ================= */}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* COLUNA 1: Histórico */}
          {/* Alterado: bg-white -> dark:bg-white/5 e borda */}
          <div className="md:col-span-4 bg-white/5 dark:bg-white/5 p-6 rounded-2xl shadow flex flex-col ">
            <HistoricoVotacoes
              votos={votosParaHistorico}
              onPecClick={handlePecClick}
              className="w-full h-[300px]"
            />
          </div>

          <div className="md:col-span-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 2. Proporção de Votos */}
            {/* Alterado: bg-white -> dark:bg-white/5 */}
            <div className="lg:col-span-4 bg-white dark:bg-white/5 p-4 rounded-2xl shadow flex flex-col items-center border border-transparent dark:border-white/10">
              <h2 className="font-bold mb-2 text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-widest self-start border-b border-gray-100 dark:border-white/10 w-full pb-1">
                Proporção de Votos
              </h2>
              <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                <PieVotos data={votos} />
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
                <IdeologiaDistribuicao data={ideologiaData} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= LINHA 2: BARRA CATEGORIAS (LARGURA TOTAL) ================= */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow border border-transparent dark:border-white/10">
          <h2 className="font-semibold mb-6 text-lg border-b border-gray-100 dark:border-white/10 pb-2 text-gray-900 dark:text-white">
            Desempenho por Categorias
          </h2>
          <div className="h-[400px] w-full">
            <BarCategorias data={categorias} />
          </div>
        </div>
      </div>
    </div>
  );
}
