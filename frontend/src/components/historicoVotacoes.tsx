import React, { useState, useMemo } from 'react';

// Tipagem para os dados de votação
export interface Voto {
  pec: string;
  data: string;
  voto: 'Sim' | 'Não' | string;
  categoria?: string;
}

interface HistoricoVotacoesProps {
  votos: Voto[];
  onPecClick?: (pec: string) => void;
  getCategoriaMock?: (pec: string) => string;
  className?: string;
}

export const HistoricoVotacoes: React.FC<HistoricoVotacoesProps> = ({
  votos,
  onPecClick,
  getCategoriaMock,
  className = '',
}) => {
  const [buscaVoto, setBuscaVoto] = useState('');

  // Lógica de filtro memorizada para performance
  const votosFiltrados = useMemo(() => {
    return votos.filter(
      (v) =>
        v.pec.toLowerCase().includes(buscaVoto.toLowerCase()) ||
        v.categoria?.toLowerCase().includes(buscaVoto.toLowerCase()),
    );
  }, [votos, buscaVoto]);

  return (
    <section
      className={`lg:col-span-8 flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 ${className}`}
    >
      <div className="flex-shrink-0 flex items-center justify-between mb-3 border-b border-gray-100 dark:border-white/10 pb-2">
        <h1 className="font-bold mb-2 text-gray-700 dark:text-gray-300 uppercase text-[10px] tracking-widest self-start border-b w-full pb-1">
          Histórico de Votações
        </h1>
        <input
          type="text"
          placeholder="Filtrar..."
          value={buscaVoto}
          onChange={(e) => setBuscaVoto(e.target.value)}
          className="text-[12px] bg-gray-100 dark:bg-[#001b3d] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1 w-32 outline-none font-bold dark:text-white focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="overflow-y-auto pr-1 custom-scrollbar max-h-[420px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2 pr-3">
          {votosFiltrados.map((v, index) => (
            <button
              key={`${v.pec}-${index}`}
              onClick={() => onPecClick?.(v.pec)}
              className="flex flex-col p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-blue-400/50 bg-gray-50 dark:bg-[#001b3d]/50 transition-all text-left group"
            >
              <div className="flex justify-between items-start mb-1 gap-2 w-full">
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase">
                  {v.categoria ||
                    (getCategoriaMock ? getCategoriaMock(v.pec) : 'Geral')}
                </span>
                <span className="text-[8px] text-gray-400 font-bold whitespace-nowrap">
                  {v.data}
                </span>
              </div>

              <p className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase line-clamp-1 mb-1">
                {v.pec}
              </p>

              <span
                className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase w-fit ${
                  v.voto === 'Sim'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}
              >
                {v.voto}
              </span>
            </button>
          ))}

          {votosFiltrados.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-400 text-xs italic">
              Nenhum resultado encontrado.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
