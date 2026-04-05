import { type metricaExpandida } from '../models/metricaExpandida';
import { ScoreCard } from './scoreCard';

interface PerfilDeputadoProps {
  deputado: metricaExpandida;
}

export function PerfilDeputado({ deputado }: PerfilDeputadoProps) {
  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10">
        {/* 1. SEÇÃO DA FOTO */}
        <div className="flex-shrink-0">
          {deputado.deputado.fotoUrl ? (
            <img
              src={deputado.deputado.fotoUrl}
              alt={deputado.deputado.nomeUrna}
              className="w-36 h-48 md:w-44 md:h-60 rounded-2xl object-cover shadow-lg border-4 border-white dark:border-slate-800"
            />
          ) : (
            <div className="w-36 h-48 md:w-44 md:h-60 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
        </div>

        {/* 2. SEÇÃO DO SCORE (Centralizada verticalmente com o conteúdo) */}
        <div className="flex-shrink-0 flex items-center justify-center p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl min-w-[180px] border border-gray-100 dark:border-white/5">
          <ScoreCard
            score={deputado.ideologia.score}
            classificacao={deputado.ideologia.classificacao}
          />
        </div>

        {/* 3. SEÇÃO DE INFORMAÇÕES PESSOAIS */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            {deputado.deputado.nomeUrna}
          </h1>

          <div className="mt-3 space-y-1">
            <p className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400">
              Deputado Federal
            </p>
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-300">
              {deputado.partido} — {deputado.estado}
            </p>

            {deputado.deputado.email && (
              <p className="text-sm md:text-md text-gray-400 dark:text-gray-500 font-mono mt-4 truncate max-w-xs md:max-w-none mx-auto md:mx-0">
                {deputado.deputado.email.toLowerCase()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
