import { api } from './api';
import { type Deputado } from '../models/deputado';

export const deputadosPartidoService = {
  async listarDeputadosPorPartido(sigla?: string): Promise<Deputado[]> {
    // Se a sigla for 'Todos' ou não existir, busca a lista geral
    const endpoint =
      sigla && sigla !== 'Todos' ? `/deputados/partido/${sigla}` : '/deputados';

    const response = await api.get<Deputado[]>(endpoint);
    return response.data;
  },
};
