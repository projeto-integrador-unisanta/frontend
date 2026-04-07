export interface CategoriaDesempenho {
  categoria: string;
  nota: number;
}

export interface IdeologiaInfo {
  score: number;
  classificacao: string;
  base_partido: number;
  alinhamento: number;
}

export interface EstatisticasVotos {
  total_votos: number;
  sim: number;
  nao: number;
  abstencao: number;
}

export interface MetricaExpandida {
  deputado: string;
  partido: string;
  estado: string;
  ideologia: IdeologiaInfo;
  categorias: CategoriaDesempenho[];
  estatisticas: EstatisticasVotos;
}
