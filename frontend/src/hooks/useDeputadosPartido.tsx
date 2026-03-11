import { useState, useEffect, useMemo } from 'react';
import { deputadosPartidoService } from '../services/deputadosPartidoService';
import { type Deputado } from '../models/deputado';

export function useDeputados(
  siglaPartido: string,
  uf: string,
  buscaNome: string,
) {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Busca os dados da API sempre que o PARTIDO mudar
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);
        const dados =
          await deputadosPartidoService.listarDeputadosPorPartido(siglaPartido);
        setDeputados(dados);
      } catch (err) {
        setError('Não foi possível carregar os deputados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [siglaPartido]); // Só dispara o fetch se o partido mudar

  // 2. Filtro Combinado Local (Performance otimizada com useMemo)
  const deputadosFiltrados = useMemo(() => {
    return deputados.filter((dep) => {
      const matchNome = dep.nomeUrna
        .toLowerCase()
        .includes(buscaNome.toLowerCase());
      const matchUF = uf === 'Todos' || dep.estado === uf;

      return matchNome && matchUF;
    });
  }, [deputados, uf, buscaNome]); // Recalcula se a lista original, UF ou Nome mudarem

  return {
    deputados: deputadosFiltrados,
    totalOriginal: deputados.length,
    loading,
    error,
  };
}
