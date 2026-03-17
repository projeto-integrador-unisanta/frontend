import { useState, useEffect, useMemo } from 'react';
import { deputadosEstadoService } from '../services/deputadosEstadoService';
import { type Deputado } from '../models/deputado';

export function useDeputadosEstado(
  siglaEstado: string,
  partido: string,
  buscaNome: string,
) {
  // 1. Defina o estado inicial como um array vazio
  const [dadosApi, setDadosApi] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      if (siglaEstado === 'Todos') return; // Evita busca inválida

      try {
        setLoading(true);
        setError(null);
        const dados =
          await deputadosEstadoService.listarDeputadosPorEstado(siglaEstado);

        // Se a API retorna o array direto, salvamos ele todo
        setDadosApi(Array.isArray(dados) ? dados : []);
      } catch (err) {
        setError('Não foi possível carregar os deputados.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [siglaEstado]);

  // 2. CORREÇÃO AQUI: dadosApi já É a lista
  const listaBase = useMemo(() => {
    return Array.isArray(dadosApi) ? dadosApi : [];
  }, [dadosApi]);

  // 3. Filtro Combinado Local
  const deputadosFiltrados = useMemo(() => {
    return listaBase.filter((dep: Deputado) => {
      const matchNome =
        dep.nomeUrna?.toLowerCase().includes(buscaNome.toLowerCase()) ?? false;

      // O campo no seu JSON é 'partido' (Ex: "PL", "PT")
      // Certifique-se que a variável 'partido' vinda do select também seja a sigla em caixa alta
      const matchPartido = partido === 'Todos' || dep.partido === partido;

      return matchNome && matchPartido;
    });
  }, [listaBase, partido, buscaNome]);

  return {
    deputados: deputadosFiltrados,
    totalOriginal: listaBase.length,
    loading,
    error,
  };
}
