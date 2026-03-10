export interface Estado {
  id: number;
  sigla: string; // Ex: 'SP', 'RJ'
  nome: string;
  regiao: string | null;
}
