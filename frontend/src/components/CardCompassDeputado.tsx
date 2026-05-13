import { useNavigate } from 'react-router-dom';
import { useCompassDeputado } from '../hooks/useCompassDeputado';

interface Props {
  idApi: number | string | undefined;
  nomeDeputado: string;
}

function corQuadrante(x: number, y: number) {
  if (x < 5 && y > 5) return '#ef4444';
  if (x >= 5 && y > 5) return '#3b82f6';
  if (x < 5 && y <= 5) return '#10b981';
  return '#a855f7';
}

function paraSvg(v: number, total: number) {
  return (v / 10) * total;
}

export function CardCompassDeputado({ idApi, nomeDeputado }: Props) {
  const navigate = useNavigate();
  const { compass, loading, error } = useCompassDeputado(idApi);

  if (loading) {
    return (
      <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🧭</span>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
              Espectro 2D
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Carregando compass...
            </p>
          </div>
        </div>
        <div className="h-64 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
      </section>
    );
  }

  if (error || !compass) return null;

  const { x, y } = compass.compass;
  const cor = corQuadrante(x, y);
  const size = 320;
  const cx = paraSvg(x, size);
  const cy = size - paraSvg(y, size);

  // Mostra também o ponto âncora do partido pra usuário ver o
  // "trajeto" do prior (partido) até o posicionamento real.
  const base = compass.compass.base_partido;
  const baseCx = paraSvg(base.x, size);
  const baseCy = size - paraSvg(base.y, size);

  const confiancaX = Math.round(compass.compass.peso_comportamento.x * 100);
  const confiancaY = Math.round(compass.compass.peso_comportamento.y * 100);

  return (
    <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 transition-colors">
      <header className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧭</span>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
              Espectro 2D
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {compass.compass.quadrante}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/espectro')}
          className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-yellow-600 dark:hover:text-brandAccent transition-colors"
        >
          Ver mapa completo →
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Mini compass */}
        <div className="relative">
          <div className="text-center text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">
            Autoritário
          </div>
          <div className="flex items-stretch gap-1">
            <div className="flex items-center">
              <div
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                Esquerda
              </div>
            </div>
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-auto border border-gray-300 dark:border-white/20 rounded"
              style={{ maxWidth: size }}
            >
              <rect x={0}        y={0}        width={size / 2} height={size / 2} fill="#fee2e2" />
              <rect x={size / 2} y={0}        width={size / 2} height={size / 2} fill="#dbeafe" />
              <rect x={0}        y={size / 2} width={size / 2} height={size / 2} fill="#d1fae5" />
              <rect x={size / 2} y={size / 2} width={size / 2} height={size / 2} fill="#ede9fe" />
              <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke="#374151" strokeWidth={1.5} />
              <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke="#374151" strokeWidth={1.5} />

              {/* Base do partido — círculo aberto/fantasma */}
              <circle
                cx={baseCx}
                cy={baseCy}
                r={6}
                fill="none"
                stroke={cor}
                strokeWidth={2}
                strokeDasharray="3,3"
                opacity={0.5}
              />
              <text
                x={baseCx + 10}
                y={baseCy + 4}
                fontSize={10}
                fill="#6b7280"
                fontWeight={600}
              >
                {compass.partido}
              </text>

              {/* Linha conectando partido ao deputado — visualiza o
                  trajeto do prior pro posterior */}
              <line
                x1={baseCx}
                y1={baseCy}
                x2={cx}
                y2={cy}
                stroke={cor}
                strokeWidth={1}
                strokeDasharray="2,2"
                opacity={0.4}
              />

              {/* Ponto do deputado */}
              <circle cx={cx} cy={cy} r={10} fill="white" stroke={cor} strokeWidth={2.5} />
              <circle cx={cx} cy={cy} r={7} fill={cor} />
            </svg>
            <div className="flex items-center">
              <div
                className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400"
                style={{ writingMode: 'vertical-rl' }}
              >
                Direita
              </div>
            </div>
          </div>
          <div className="text-center text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">
            Libertário
          </div>
        </div>

        {/* Stats lateral */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
              Posição
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Eixo X
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                  {x.toFixed(1)}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500">
                  {x < 5 ? 'Esquerda' : 'Direita'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Eixo Y
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                  {y.toFixed(1)}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500">
                  {y > 5 ? 'Autoritário' : 'Libertário'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
              Confiança (comportamento real vs. partido)
            </span>
            <div className="space-y-2">
              <BarraConfianca rotulo="X" valor={confiancaX} cor="bg-blue-500" />
              <BarraConfianca rotulo="Y" valor={confiancaY} cor="bg-purple-500" />
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 italic leading-relaxed">
              Quanto desse ponto vem dos votos reais do deputado (vs. herdado
              da base do partido).{' '}
              {compass.compass.votos_relevantes} votos relevantes no banco.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
              Alinhamento com o partido (2D)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
                {compass.compass.alinhamento.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-bold">
                / 10
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              10 = fiel à base do partido nos dois eixos.{' '}
              {compass.compass.alinhamento >= 7
                ? 'Posicionamento muito próximo da base.'
                : compass.compass.alinhamento >= 4
                  ? 'Posição mista em relação ao partido.'
                  : `${nomeDeputado.split(' ')[0]} é um trânsfuga ideológico no espaço 2D.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BarraConfianca({
  rotulo,
  valor,
  cor,
}: {
  rotulo: string;
  valor: number;
  cor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-4">
        {rotulo}
      </span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${cor} transition-all duration-700`}
          style={{ width: `${Math.max(0, Math.min(100, valor))}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-600 dark:text-gray-400 tabular-nums w-10 text-right">
        {valor}%
      </span>
    </div>
  );
}
