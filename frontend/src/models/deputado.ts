export interface Deputado {
  id: number;
  idApi: number;
  idLegislatura: number;
  uriApi?: string | null;
  nomeUrna: string;
  nomeCompleto?: string | null; //
  cargo?: string | null; //
  estadoId?: number | null; //
  partidoId?: number | null; //
  email?: string | null; //
  fotoUrl?: string | null; //
  ativo: boolean | null; // null se não preenchido, mas tem default true no DB
  atualizadoEm: Date | null;
}
