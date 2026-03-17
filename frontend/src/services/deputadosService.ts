import { api } from './api';
import type { DeputadoPagina } from '../models/deputadoPagina';

export const deputadosService = {
  // Adicionamos o parâmetro pagina (com padrão 1)
  async listarDeputados(pagina: number = 1): Promise<DeputadoPagina> {
    // A chamada agora envia ?pagina=X
    const response = await api.get(`/deputados?page=${pagina}`);
    return response.data;
  },
};
