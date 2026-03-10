import { api } from './api';
import { type Deputado } from '../models/deputado';

export const deputadosService = {
  async listarDeputados(): Promise<Deputado[]> {
    const response = await api.get('/deputados');
    return response.data;
  },
};
