import { api } from './api';
import { type Partido } from '../models/partido';

export const partidosService = {
  async listarPartidos(): Promise<Partido[]> {
    const response = await api.get<Partido[]>('/partidos');
    return response.data;
  },
};
