import { useEffect, useState } from 'react';
import { partidosService } from '../services/partidosService';
import { type Partido } from '../models/partido';

/**
 * Hook personalizado para gerenciar a lista de Partidos Políticos.
 * Utilizado para popular componentes de seleção (filtros).
 */
export function usePartidos() {
  // Armazena a lista de partidos (ex: PT, PL, PSDB...)
  const [partidos, setPartidos] = useState<Partido[]>([]);
  // Controla o estado de carregamento para exibir spinners ou skeletons
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        // Chama o serviço que faz o GET na API /partidos
        const data = await partidosService.listarPartidos();
        setPartidos(data);
      } catch (err) {
        console.error('Erro ao carregar partidos:', err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []); // Executa apenas uma vez ao montar o componente

  return { partidos, loading };
}
