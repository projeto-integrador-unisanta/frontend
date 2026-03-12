import { useEffect, useState } from 'react';
import { estadosService } from '../services/estadosService';
import { type Estado } from '../models/estado';

/**
 * Hook personalizado para gerenciar a lista de Estados brasileiros.
 * Ele centraliza a lógica de busca (fetch) e o estado de carregamento.
 */
export function useEstados() {
  // Armazena a lista de estados retornada pela API
  const [estados, setEstados] = useState<Estado[]>([]);
  // Controla se a requisição ainda está em andamento
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        // Chama o serviço que faz o GET na API /estados
        const data = await estadosService.listarEstados();
        setEstados(data);
      } catch (err) {
        console.error('Erro ao carregar estados:', err);
      } finally {
        // Finaliza o estado de carregamento independente de sucesso ou erro
        setLoading(false);
      }
    }
    carregar();
  }, []); // Executa apenas uma vez ao montar o componente

  return { estados, loading };
}
