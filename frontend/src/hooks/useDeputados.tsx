import { useEffect, useState, useMemo } from 'react';
import { deputadosService } from '../services/deputadosService';
import { type Deputado } from '../models/deputado';

const CACHE_KEY = '@meu-app:deputados-completo';
const QUARENTA_E_OITO_HORAS = 48 * 60 * 60 * 1000; // milissegundos

export function useDeputados(buscaNome: string) {
  const [listaCompleta, setListaCompleta] = useState<Deputado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const agora = new Date().getTime();
        const cacheSalvo = localStorage.getItem(CACHE_KEY);

        if (cacheSalvo) {
          const { dados, timestamp } = JSON.parse(cacheSalvo);

          // Verifica se ainda está dentro do prazo de 48h
          if (agora - timestamp < QUARENTA_E_OITO_HORAS) {
            setListaCompleta(dados);
            setLoading(false);
            return;
          }
        }

        // Se não houver cache ou se ele expirou, busca da API
        const totalPaginas = 14;
        const promessas = Array.from({ length: totalPaginas }, (_, i) =>
          deputadosService.listarDeputados(i + 1),
        );

        const resultados = await Promise.all(promessas);
        const todosDeputados = resultados.flatMap((res) => res.deputados || []);

        // Salva com o timestamp atual
        const objetoParaCache = {
          dados: todosDeputados,
          timestamp: agora,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(objetoParaCache));
        setListaCompleta(todosDeputados);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao atualizar base de dados.');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const deputadosFiltrados = useMemo(() => {
    if (!buscaNome.trim()) return listaCompleta;
    return listaCompleta.filter((dep) =>
      dep.nomeUrna?.toLowerCase().includes(buscaNome.toLowerCase()),
    );
  }, [listaCompleta, buscaNome]);

  return {
    deputados: deputadosFiltrados,
    loading,
    error,
  };
}
