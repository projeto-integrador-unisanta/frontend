import { useEffect } from 'react';
import type { PEC } from '../models/pec';

interface Props {
  pec: PEC | null;
  pecRaw: string | null;
  voto?: string;
  data?: string;
  onClose: () => void;
  onVerCompleta: (busca: string) => void;
}

export function PecPreviewModal({
  pec,
  pecRaw,
  voto,
  data,
  onClose,
  onVerCompleta,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!pecRaw) return null;

  const titulo = pec?.nome_popular || pecRaw;
  const sigla = pec ? `${pec.siglaTipo} ${pec.numero}/${pec.ano}` : pecRaw;
  const ementa = pec?.ementa || null;
  const tema = pec?.temaPrincipal || null;

  const corVoto =
    voto === 'Sim'
      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30'
      : voto === 'Não'
        ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
        : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <header className="mb-6 pr-10 border-b border-gray-100 dark:border-white/10 pb-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {sigla}
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 leading-tight">
            {titulo}
          </h2>

          <div className="flex flex-wrap gap-2 mt-3">
            {voto && (
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-md border text-xs font-extrabold uppercase tracking-wider ${corVoto}`}
              >
                Voto: {voto}
              </span>
            )}
            {data && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold text-gray-600 dark:text-gray-400">
                📅 {data}
              </span>
            )}
            {tema && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-yellow-400/30 bg-yellow-400/10 text-yellow-600 dark:text-brandAccent text-xs font-extrabold uppercase tracking-wider">
                {tema}
              </span>
            )}
          </div>
        </header>

        <div className="overflow-y-auto pr-2 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-2">
            Sobre esta PEC
          </h3>
          {ementa ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {ementa}
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              Não temos um resumo desta PEC no nosso banco. Clique em "Ver
              completa" para ver os detalhes na página de PECs.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-extrabold rounded-xl transition-colors uppercase tracking-wide text-xs"
          >
            Fechar
          </button>
          <button
            onClick={() => onVerCompleta(pecRaw)}
            className="flex-1 px-6 py-3 bg-yellow-400 dark:bg-brandAccent text-[#002B5B] dark:text-gray-900 font-extrabold rounded-xl hover:bg-yellow-500 transition-colors uppercase tracking-wide text-xs"
          >
            Ver PEC completa →
          </button>
        </div>
      </div>
    </div>
  );
}
