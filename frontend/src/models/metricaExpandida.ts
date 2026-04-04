import type { pecDeputados } from './pecDeputado';

export type metricaExpandida = {
  deputado: {
    id: number;
    nomeUrna: string;
    fotoUrl: string;
    email: string;
    partido: string;
    estado: string;
    votos_recentes: pecDeputados[];
  };
  partido: string;
  estado: string;
  ideologia: {
    score: number;
    classificacao: string;
    base_partido?: number;
    alinhamento?: number;

    probabilidades?: {
      extrema_esquerda: number;
      esquerda: number;
      centro: number;
      direita: number;
      extrema_direita: number;
    };
  };
  categorias: {
    categoria: string;
    nota: number;
  }[];
  estatisticas: {
    total_votos: number;
    sim: number;
    nao: number;
    abstencao: number;
  };
};
