import { type MetricaExpandida } from '../models/deputadoIdeologia';

export function mapDeputadoToCharts(ideologia: MetricaExpandida) {
  const total = ideologia.estatisticas.total_votos;

  return {
    categorias: ideologia.categorias.map((c) => ({
      subject: c.categoria,
      nota: c.nota,
      status: c.nota >= 7 ? 'alto' : c.nota >= 5 ? 'medio' : 'baixo',
    })),

    votos: [
      {
        name: 'Sim',
        value: ideologia.estatisticas.sim,
        percent: (ideologia.estatisticas.sim / total) * 100,
      },
      {
        name: 'Não',
        value: ideologia.estatisticas.nao,
        percent: (ideologia.estatisticas.nao / total) * 100,
      },
    ],
  };
}

export function mapIdeologiaProbabilidades(data: any) {
  const probs = data.ideologia.probabilidades;

  return [
    { name: 'Extrema Esquerda', value: probs.extrema_esquerda },
    { name: 'Esquerda', value: probs.esquerda },
    { name: 'Centro', value: probs.centro },
    { name: 'Direita', value: probs.direita },
    { name: 'Extrema Direita', value: probs.extrema_direita },
  ];
}
