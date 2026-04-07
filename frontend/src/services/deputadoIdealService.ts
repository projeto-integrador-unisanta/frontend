import { api } from './api';
import type { MetricaExpandida } from '../models/deputadoIdeal';

export const deputadoIdealService = {
  async deputadoIdeal(idApi: string): Promise<MetricaExpandida> {
    const endpoint = `/deputados/${idApi}/ideologia/probabilidade`;
    const response = await api.get<MetricaExpandida>(endpoint);
    return response.data;
  },
};
