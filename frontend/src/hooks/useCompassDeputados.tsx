import { useEffect, useState } from 'react';
import { compassService } from '../services/compassService';
import type { DeputadoCompass } from '../models/deputadoCompass';

const CACHE_KEY = '@meu-app:compass-deputados';
const SEIS_HORAS = 6 * 60 * 60 * 1000;

export function useCompassDeputados() {
  const [deputados, setDeputados] = useState<DeputadoCompass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const agora = Date.now();
        const cacheSalvo = localStorage.getItem(CACHE_KEY);

        if (cacheSalvo) {
          const { dados, timestamp } = JSON.parse(cacheSalvo);
          if (agora - timestamp < SEIS_HORAS) {
            setDeputados(dados);
            setLoading(false);
            return;
          }
        }

        const response = await compassService.listarTodos();
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ dados: response.deputados, timestamp: agora }),
        );
        setDeputados(response.deputados);
      } catch (err) {
        console.error('Erro ao carregar compass:', err);
        setError('Erro ao carregar dados do compass político.');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  return { deputados, loading, error };
}
