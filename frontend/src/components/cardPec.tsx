import { type PEC } from '../models/pec';

interface Props {
  pec: PEC;
  onClick?: (pec: PEC) => void;
}

export function CardPec({ pec, onClick }: Props) {
  return (
    <button
      onClick={() => onClick?.(pec)}
      className="w-full text-left bg-white dark:bg-[#001529] border border-gray-100 dark:border-white/10 p-6 rounded-2xl hover:border-blue-200 dark:hover:border-brandAccent hover:shadow-md transition-all group flex flex-col h-full relative"
    >
      <div className="flex justify-between items-start mb-4 w-full">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-blue-600 dark:text-brandAccent uppercase tracking-widest block">
            {pec.siglaTipo} {pec.numero}/{pec.ano}
          </span>
          {pec.nome_popular && (
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-tight group-hover:text-blue-600 dark:group-hover:text-brandAccent transition-colors">
              {pec.nome_popular}
            </h2>
          )}
        </div>
        {pec.temaPrincipal && (
          <span className="text-[9px] font-bold px-2 py-1 bg-gray-50 dark:bg-[#001b3d] text-gray-500 dark:text-gray-400 rounded-md uppercase tracking-tighter transition-colors">
            {pec.temaPrincipal}
          </span>
        )}
      </div>

      <h2 className={`text-sm font-bold text-gray-900 dark:text-white mb-3 leading-tight ${pec.nome_popular ? 'hidden' : 'block'}`}>
        Proposta de Emenda à Constituição {pec.numero}/{pec.ano}
      </h2>

      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-4 leading-relaxed italic mb-6 flex-1 pr-2 transition-colors">
        "{pec.ementa}"
      </p>

      <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex justify-between items-center w-full mt-auto transition-colors">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Clique para ver votos
          </span>
          {pec.urlInteiroTeor && (
            <a
              href={pec.urlInteiroTeor}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[9px] font-black text-blue-400 dark:text-brandAccent hover:text-blue-600 dark:hover:text-yellow-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              Íntegra
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <svg 
          className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-brandAccent transform group-hover:translate-x-1 transition-all" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
