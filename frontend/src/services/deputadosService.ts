import { api } from './api';
import type { DeputadoPagina } from '../models/deputadoPagina';

export const deputadosService = {
  async listarDeputados(): Promise<DeputadoPagina> {
    const response = await api.get('/deputados');
    return response.data;
  },
};
