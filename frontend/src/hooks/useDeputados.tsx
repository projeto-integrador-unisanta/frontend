import { useEffect, useState, useMemo } from 'react';
import { deputadosService } from '../services/deputadosService';
import type { DeputadoPagina } from '../models/deputadoPagina';

export function useDeputados() {
  const [dadosApi, setDadosApi] = useState<DeputadoPagina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDeputados() {
      try {
        setLoading(true);
        const data = await deputadosService.listarDeputados();
        setDadosApi(data);
      } catch (err) {
        setError('Erro ao carregar deputados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDeputados();
  }, []);

  // Extraímos o array para que a Page não precise saber a estrutura do objeto da API
  const deputados = useMemo(() => {
    return dadosApi?.deputados || [];
  }, [dadosApi]);

  return {
    deputados, // Retorna apenas o array bruto
    deputadosPagina: dadosApi, // Retorna o objeto completo caso precise de metadados
    loading,
    error,
  };
}
