import { type metricaExpandida } from '../models/metricaExpandida';

export function mapDeputadoToCharts(data: metricaExpandida) {
  const total = data.estatisticas.total_votos;

  return {
    categorias: data.categorias.map((c) => ({
      subject: c.categoria,
      nota: c.nota,
      status: c.nota >= 7 ? 'alto' : c.nota >= 5 ? 'medio' : 'baixo',
    })),

    votos: [
      {
        name: 'Sim',
        value: data.estatisticas.sim,
        percent: (data.estatisticas.sim / total) * 100,
      },
      {
        name: 'Não',
        value: data.estatisticas.nao,
        percent: (data.estatisticas.nao / total) * 100,
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
