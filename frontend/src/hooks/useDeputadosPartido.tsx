import { useState, useEffect, useMemo } from 'react';
import { deputadosPartidoService } from '../services/deputadosPartidoService';
import { type Deputado } from '../models/deputado';

export function useDeputadosPartido(
  siglaPartido: string,
  uf: string,
  buscaNome: string,
) {
  // Mantemos como 'any' ou uma interface de resposta para aceitar o objeto da API
  const [dadosApi, setDadosApi] = useState<any>(null);
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
        setDadosApi(dados);
      } catch (err) {
        setError('Não foi possível carregar os deputados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [siglaPartido]);

  // 2. Extraímos a lista base (Array) do objeto da API
  const listaBase = useMemo(() => {
    // Se dadosApi já for um array, usa ele. Se for objeto, busca a propriedade .deputados
    if (Array.isArray(dadosApi)) return dadosApi;
    return dadosApi?.deputados || [];
  }, [dadosApi]);

  // 3. Filtro Combinado Local
  const deputadosFiltrados = useMemo(() => {
    return listaBase.filter((dep: Deputado) => {
      const matchNome =
        dep.nomeUrna?.toLowerCase().includes(buscaNome.toLowerCase()) ?? false;

      const matchUF = uf === 'Todos' || dep.estado === uf;

      return matchNome && matchUF;
    });
  }, [listaBase, uf, buscaNome]);

  return {
    deputados: deputadosFiltrados,
    totalOriginal: listaBase.length, // Agora acessível e seguro
    loading,
    error,
  };
}
