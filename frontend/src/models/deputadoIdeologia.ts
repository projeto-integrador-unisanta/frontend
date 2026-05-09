export interface CategoriaDesempenho {
  categoria: string;
  nota: number;
}

export interface IdeologiaInfo {
  score: number;
  classificacao: string;
  base_partido: number;
  alinhamento: number;
  score_votos?: number;
}

export interface ConfiancaInfo {
  nivel: 'alta' | 'moderada' | 'baixa';
  peso_comportamento: number;
  votos_relevantes: number;
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
  confianca?: ConfiancaInfo;
  resumo?: string[];
  categorias: CategoriaDesempenho[];
  estatisticas: EstatisticasVotos;
}
