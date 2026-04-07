import type { pecDeputados } from './pecDeputado';

export interface Deputado {
  id: number;
  idApi: number;
  nomeUrna: string;
  fotoUrl: string;
  email: string;
  partido: string;
  estado: string;
  votos_recentes: pecDeputados[];
}
