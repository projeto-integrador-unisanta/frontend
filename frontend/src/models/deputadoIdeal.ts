export interface ProbabilidadesIdeologicas {
  extrema_esquerda: number;
  esquerda: number;
  centro: number;
  direita: number;
  extrema_direita: number;
}

export interface IdeologiaInfo {
  score: number;
  classificacao: string;
  probabilidades: ProbabilidadesIdeologicas;
  base_partido?: number;
  alinhamento?: number;
}

export interface MetricaExpandida {
  deputado: string;
  partido: string;
  estado: string;
  ideologia: IdeologiaInfo;
}
