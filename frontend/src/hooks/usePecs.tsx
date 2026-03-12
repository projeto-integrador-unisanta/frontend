import { useEffect, useState } from 'react';
import { pecsService } from '../services/pecsService';
import { type PEC } from '../models/pec';

export function usePecs() {
  const [pecs, setPecs] = useState<PEC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarPecs() {
      try {
        const data = await pecsService.listarPecs();
        setPecs(data);
      } catch (err) {
        setError('Erro ao carregar PECs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarPecs();
  }, []);

  return {
    pecs,
    loading,
    error,
  };
}
