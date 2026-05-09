import { Link } from 'react-router-dom';

type Props = {
  score: number;
  classificacao: string;
  basePartido?: number;
  alinhamento?: number;
  confianca?: {
    nivel: 'alta' | 'moderada' | 'baixa';
    votos_relevantes: number;
  };
};

const FAIXAS = [
  { label: 'Esq.', from: 0, to: 2, color: 'bg-red-700' },
  { label: 'Esq.', from: 2, to: 4, color: 'bg-red-500' },
  { label: 'Centro', from: 4, to: 6, color: 'bg-gray-400' },
  { label: 'Dir.', from: 6, to: 8, color: 'bg-blue-500' },
  { label: 'Dir.', from: 8, to: 10, color: 'bg-blue-700' },
];

function classificacaoCor(score: number): string {
  if (score < 2) return 'text-red-700 dark:text-red-400';
  if (score < 4) return 'text-red-500 dark:text-red-400';
  if (score <= 6) return 'text-gray-700 dark:text-gray-300';
  if (score <= 8) return 'text-blue-500 dark:text-blue-400';
  return 'text-blue-700 dark:text-blue-400';
}

const CONFIANCA_STYLE: Record<
  'alta' | 'moderada' | 'baixa',
  { rotulo: string; cor: string }
> = {
  alta: {
    rotulo: 'Alta confiança',
    cor: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
  },
  moderada: {
    rotulo: 'Confiança moderada',
    cor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  },
  baixa: {
    rotulo: 'Baixa confiança',
    cor: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
  },
};

export function ScoreCard({
  score,
  classificacao,
  basePartido,
  alinhamento,
  confianca,
}: Props) {
  const posPercent = Math.max(0, Math.min(100, (score / 10) * 100));
  const corClassif = classificacaoCor(score);
  const confEstilo = confianca ? CONFIANCA_STYLE[confianca.nivel] : null;

  return (
    <div className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-500">
            Score Ideológico
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-none tabular-nums">
              {score.toFixed(1)}
            </span>
            <span className="text-base text-gray-400 dark:text-gray-500 font-bold">
              / 10
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`text-sm font-extrabold uppercase tracking-wider ${corClassif}`}
            >
              {classificacao.trim()}
            </span>
            {confEstilo && confianca && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[10px] font-extrabold uppercase tracking-widest ${confEstilo.cor}`}
                title={`Score baseado em ${confianca.votos_relevantes} votos em pautas ideológicas relevantes`}
              >
                ● {confEstilo.rotulo} · {confianca.votos_relevantes}{' '}
                {confianca.votos_relevantes === 1 ? 'voto' : 'votos'}
              </span>
            )}
          </div>
        </div>

        <Link
          to="/metodologia"
          className="text-xs font-bold uppercase tracking-widest text-yellow-600 dark:text-brandAccent hover:underline self-start md:self-auto"
        >
          Como calculamos? →
        </Link>
      </div>

      <div className="relative">
        <div className="flex h-3 rounded-full overflow-hidden">
          {FAIXAS.map((f, i) => (
            <div key={i} className={`flex-1 ${f.color} opacity-30`} />
          ))}
        </div>

        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700"
          style={{ left: `${posPercent}%` }}
        >
          <div className="w-5 h-5 rounded-full bg-white border-4 border-gray-900 dark:border-white shadow-lg" />
        </div>

        <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
          <span>0 · Esquerda</span>
          <span>5 · Centro</span>
          <span>Direita · 10</span>
        </div>
      </div>

      {(basePartido !== undefined || alinhamento !== undefined) && (
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
          {basePartido !== undefined && (
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                Base do partido
              </span>
              <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                {basePartido.toFixed(1)}
                <span className="text-xs text-gray-400 ml-1">/10</span>
              </span>
            </div>
          )}
          {alinhamento !== undefined && (
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                Alinhamento partidário
              </span>
              <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                {alinhamento.toFixed(1)}
                <span className="text-xs text-gray-400 ml-1">/10</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
