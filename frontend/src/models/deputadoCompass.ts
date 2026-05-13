export interface Coordenada2D {
  x: number;
  y: number;
}

export interface DeputadoCompass {
  id: number;
  idApi: number;
  nomeUrna: string;
  fotoUrl: string | null;
  partido: string | null;
  estado: string | null;
  compass: {
    x: number;
    y: number;
    quadrante: string;
    base_partido: Coordenada2D;
    score_votos: Coordenada2D;
    alinhamento: number;
    peso_comportamento: Coordenada2D;
    votos_relevantes: number;
  };
}

export interface CompassBulkResponse {
  deputados: DeputadoCompass[];
  cacheado_em: string;
  total: number;
}
