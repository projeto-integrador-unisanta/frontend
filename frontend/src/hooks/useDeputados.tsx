import { useEffect, useState } from 'react';
import { deputadosService } from '../services/deputadosService';
import { type Deputado } from '../models/deputado';

export function useDeputados() {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDeputados() {
      try {
        const data = await deputadosService.listarDeputados();
        setDeputados(data);
      } catch (err) {
        setError('Erro ao carregar deputados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDeputados();
  }, []);

  return {
    deputados,
    loading,
    error,
  };
}
