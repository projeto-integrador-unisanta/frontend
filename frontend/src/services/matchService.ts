import { api } from './api';

export interface MatchResultado {
  percentual: number;
  votosAlinhados: number;
  totalVotos: number;
  tagsAvaliadas: {
    tag: string;
    alinhados: number;
    total: number;
    tinhaPesoIdeologico: boolean;
  }[];
}

export const FIT_TAGS_STORAGE_KEY = '@fiscaliza:fit-tags-agree';

export const matchService = {
  async calcular(idApi: number, tags: string[]): Promise<MatchResultado> {
    const response = await api.post<MatchResultado>(
      `/deputados/${idApi}/match`,
      { tags },
    );
    return response.data;
  },
};
