export interface SessaoVotacao {
  id_sessao: string;
  sessao_descricao: string;
  data_votacao: string;
  deputado: string;
  partido: string;
  estado: string;
  voto: string;
  // Campos de resumo (se ainda vierem na mesma linha)
  sim?: number;
  nao?: number;
  abstencao?: number;
  total_votos?: number;
}

export interface VotosPEC {
  status: string;
  total_votos_historicos: number;
  votos: SessaoVotacao[];
}
