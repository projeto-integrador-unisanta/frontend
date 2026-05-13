import { useEffect, useState } from 'react';
import { compassService } from '../services/compassService';
import type { DeputadoCompass } from '../models/deputadoCompass';

export function useCompassDeputado(idApi: number | string | undefined) {
  const [compass, setCompass] = useState<DeputadoCompass | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idApi) return;
    let cancelled = false;

    async function carregar() {
      try {
        setLoading(true);
        setError(null);
        const data = await compassService.porDeputado(Number(idApi));
        if (!cancelled) setCompass(data);
      } catch (err) {
        console.error('Erro ao carregar compass do deputado:', err);
        if (!cancelled) setError('Não foi possível carregar o compass.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelled = true;
    };
  }, [idApi]);

  return { compass, loading, error };
}
