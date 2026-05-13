import { api } from './api';
import type {
  CompassBulkResponse,
  DeputadoCompass,
} from '../models/deputadoCompass';

export type RespostaQuiz = 'agree' | 'disagree' | 'skip';

export interface UsuarioCompass {
  compass: {
    x: number;
    y: number;
    quadrante: string;
    votos_relevantes: number;
    peso_total: { x: number; y: number };
    probabilidades: {
      esquerda_autoritaria: number;
      direita_autoritaria: number;
      esquerda_libertaria: number;
      direita_libertaria: number;
    };
  };
}

export const compassService = {
  async listarTodos(): Promise<CompassBulkResponse> {
    const response = await api.get<CompassBulkResponse>('/deputados/compass');
    return response.data;
  },

  async porDeputado(idApi: number): Promise<DeputadoCompass> {
    const response = await api.get<DeputadoCompass>(
      `/deputados/${idApi}/compass`,
    );
    return response.data;
  },

  async porRespostasQuiz(
    respostas: Record<string, RespostaQuiz>,
  ): Promise<UsuarioCompass> {
    // O endpoint vive em `tagsRoutes`, que é montado FORA do
    // `.group("/api")` no backend (junto com /fit e /tags). Por isso
    // não dá pra usar o axios `api` (cuja baseURL termina em /api) —
    // a URL precisa ser absoluta sem o prefixo.
    const res = await fetch(
      'https://backend-de23aa.fly.dev/fit/compass',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respostas }),
      },
    );
    if (!res.ok) {
      throw new Error(`Falha ao calcular compass: HTTP ${res.status}`);
    }
    return res.json();
  },
};
