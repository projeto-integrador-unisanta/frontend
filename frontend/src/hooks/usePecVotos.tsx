import { useState } from 'react';
import { pecsService } from '../services/pecsService';
import { type VotosPEC } from '../models/pecVotos';

export function usePecVotos() {
  const [votos, setVotos] = useState<VotosPEC | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarVotos = async (numero: number, ano: number) => {
    setLoading(true);
    setError(null);
    setVotos(null);
    try {
      const data = await pecsService.buscarVotos(numero, ano);
      console.log(`Dados recebidos para PEC ${numero}/${ano}:`, data);
      setVotos(data);
    } catch (err) {
      setError('Erro ao carregar votos da PEC');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limparVotos = () => {
    setVotos(null);
    setError(null);
  };

  return {
    votos,
    loading,
    error,
    carregarVotos,
    limparVotos,
  };
}
