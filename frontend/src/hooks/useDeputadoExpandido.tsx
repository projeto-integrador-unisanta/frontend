import { useEffect, useState } from 'react';
import { deputadoIdeologiaService } from '../services/deputadoIdeologiaService';
import { deputadoIdealService } from '../services/deputadoIdealService';

import type { MetricaExpandida as Ideologia } from '../models/deputadoIdeologia';
import type { MetricaExpandida as Ideal } from '../models/deputadoIdeal';

export function useDeputadoCompleto(idApi: number | '') {
  const [ideologia, setIdeologia] = useState<Ideologia | null>(null);
  const [ideal, setIdeal] = useState<Ideal | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!idApi) return;

      const [ideologiaRes, idealRes] = await Promise.all([
        deputadoIdeologiaService.deputadoIdeologia(idApi),
        deputadoIdealService.deputadoIdeal(idApi),
      ]);

      setIdeologia(ideologiaRes);
      setIdeal(idealRes);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados do deputado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!idApi) return;

    fetchAll();
  }, [idApi]);

  return {
    ideologia,
    ideal,
    loading,
    error,
    refetch: fetchAll,
  };
}
