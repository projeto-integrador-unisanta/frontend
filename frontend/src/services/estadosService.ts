import { api } from './api';
import { type Estado } from '../models/estado';

export const estadosService = {
  async listarEstados(): Promise<Estado[]> {
    const response = await api.get<Estado[]>('/estados');
    return response.data;
  },
};
