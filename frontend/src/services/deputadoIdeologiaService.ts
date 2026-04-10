import { api } from './api';
import type { MetricaExpandida } from '../models/deputadoIdeologia';

export const deputadoIdeologiaService = {
  async deputadoIdeologia(idApi: number): Promise<MetricaExpandida> {
    const endpoint = `/deputados/${idApi}/ideologia-completa`;
    const response = await api.get<MetricaExpandida>(endpoint);
    return response.data;
  },
};
