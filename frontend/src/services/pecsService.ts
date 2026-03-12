import { api } from './api';
import { type PEC } from '../models/pec';

export const pecsService = {
  async listarPecs(): Promise<PEC[]> {
    const response = await api.get('/pecs');
    return response.data;
  },
};
