import { api } from './api';
import { type PEC } from '../models/pec';
import { type VotosPEC } from '../models/pecVotos';

export const pecsService = {
  async listarPecs(): Promise<PEC[]> {
    const response = await api.get('/pecs');
    return response.data;
  },

  async buscarVotos(numero: number, ano: number): Promise<VotosPEC> {
    const response = await api.get(`/pec/${numero}/${ano}/votos`);
    return response.data;
  },
};
