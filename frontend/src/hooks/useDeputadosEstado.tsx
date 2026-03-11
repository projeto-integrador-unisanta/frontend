import { useState, useEffect, useMemo } from 'react';
import { deputadosEstadoService } from '../services/deputadosEstadoService';
import { type Deputado } from '../models/deputado';

export function useDeputados(
  siglaEstado: string,
  partido: string,
  buscaNome: string,
) {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Busca os dados da API sempre que o ESTADO mudar
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);
        const dados =
          await deputadosEstadoService.listarDeputadosPorEstado(siglaEstado);
        setDeputados(dados);
      } catch (err) {
        setError('Não foi possível carregar os deputados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [siglaEstado]); // Só dispara o fetch se o partido mudar

  // 2. Filtro Combinado Local (Performance otimizada com useMemo)
  const deputadosFiltrados = useMemo(() => {
    return deputados.filter((dep) => {
      const matchNome = dep.nomeUrna
        .toLowerCase()
        .includes(buscaNome.toLowerCase());
      const matchUF = partido === 'Todos' || dep.partido === partido;

      return matchNome && matchUF;
    });
  }, [deputados, partido, buscaNome]); // Recalcula se a lista original, partido ou Nome mudarem

  return {
    deputados: deputadosFiltrados,
    totalOriginal: deputados.length,
    loading,
    error,
  };
}
