import { type PEC } from '../models/pec';

interface Props {
  pec: PEC;
  onClick?: (pec: PEC) => void;
}

export function CardPec({ pec, onClick }: Props) {
  return (
    <div
      onClick={() => onClick?.(pec)}
      className="border border-solid border-gray-300 p-6 rounded-lg  shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
              {pec.siglaTipo} {pec.numero}/{pec.ano}
            </span>
            {pec.nome_popular && (
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {pec.nome_popular}
              </span>
            )}
          </div>
          {pec.temaPrincipal && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {pec.temaPrincipal}
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold mb-3 text-gray-900 leading-tight">
          {pec.nome_popular 
            ? `${pec.nome_popular} (${pec.numero}/${pec.ano})` 
            : `Proposta de Emenda à Constituição ${pec.numero}/${pec.ano}`}
        </h2>

        <p className="text-sm text-gray-700 mb-4 line-clamp-4 italic" title={pec.ementa}>
          "{pec.ementa}"
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <a
          href={pec.urlInteiroTeor}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          Ver Texto na Íntegra
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <span className="text-gray-400 text-xs">Clique para ver votos</span>
      </div>
    </div>
  );
}
