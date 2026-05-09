import { api } from './api';

export interface CoberturaResposta {
  media_votos_por_deputado: number;
  total_deputados_com_voto: number;
  total_votos: number;
  cacheado_em: string;
}

const CACHE_KEY = '@fiscaliza:cobertura-media';
const TTL_MS = 60 * 60 * 1000; // 1h

interface Cached {
  data: CoberturaResposta;
  fetchedAt: number;
}

export const coberturaService = {
  async obter(): Promise<CoberturaResposta> {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed: Cached = JSON.parse(raw);
        if (Date.now() - parsed.fetchedAt < TTL_MS) {
          return parsed.data;
        }
      }
    } catch {
      // ignora cache inválido
    }

    const response = await api.get<CoberturaResposta>(
      '/estatisticas/cobertura',
    );
    try {
      const cached: Cached = {
        data: response.data,
        fetchedAt: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch {
      // ignora falha de localStorage
    }
    return response.data;
  },
};
