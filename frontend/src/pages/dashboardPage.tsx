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

type Props = {
  deputado: metricaExpandida;
};

export function Dashboard({ deputado }: Props) {
  const { categorias, votos } = mapDeputadoToCharts(deputado);
  const ideologiaData = mapIdeologiaProbabilidades(deputado);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* ================= CARD PRINCIPAL (FOTO + SCORE + Radar) ================= */}
      <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow">
        <div className="flex items-start">
          <div className="relative z-10 flex-shrink-0">
            {deputado.deputado.fotoUrl && (
              <img
                src={deputado.deputado.fotoUrl}
                alt={deputado.deputado.nomeUrna}
                className="w-40 h-56 rounded-2xl object-cover shadow-2xl border-4 border-white"
              />
            )}
          </div>

          <div className="relative z-0 -ml-18 pt-2">
            <div className="w-62 h-52 bg-white  shadow-inner flex items-center justify-center border border-gray-100">
              <ScoreCard
                score={deputado.ideologia.score}
                classificacao={deputado.ideologia.classificacao}
              />
            </div>
          </div>

          <div className="flex-1 pt-4 ml-10">
            <h1 className="text-3xl font-bold text-gray-900 leading-none">
              {deputado.deputado.nomeUrna}
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Deputado Federal | {deputado.partido} - {deputado.estado}
            </p>

            {deputado.deputado.email && (
              <p className="text-lg text-gray-500 mt-2">
                {deputado.deputado.email.toLowerCase()}
              </p>
            )}
          </div>

          <div className="w-[350px] ml-4">
            <div className="h-[250px] flex flex-col">
              <span className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">
                Perfil de Atuação
              </span>
              <RadarCategorias data={categorias} />
            </div>
          </div>
        </div>
      </div>
      {/* ================= LINHA 1: PIE E IDEOLOGIA (LADO A LADO) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
          <h2 className="font-semibold mb-4 text-lg">Distribuição de Votos</h2>
          <PieVotos data={votos} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2 text-lg">
            Distribuição Ideológica
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Probabilidade baseada nos votos
          </p>
          <div className="h-[220px]">
            <IdeologiaDistribuicao data={ideologiaData} />
          </div>
        </div>
      </div>

      {/* ================= LINHA 2: BARRA CATEGORIAS (LARGURA TOTAL) ================= */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-6 text-lg border-b pb-2">
          Desempenho por Categorias
        </h2>
        <div className="h-[400px] w-full">
          <BarCategorias data={categorias} />
        </div>
      </div>
    </div>
  );
}
