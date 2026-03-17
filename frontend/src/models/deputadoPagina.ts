import type { Deputado } from './deputado';

export interface DeputadoPagina {
  pagina_atual: number;
  itens_por_pagina: number;
  resultados_nesta_pagina: number;
  deputados: Deputado[];
}
