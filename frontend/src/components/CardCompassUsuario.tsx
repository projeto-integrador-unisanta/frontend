import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UsuarioCompass } from '../services/compassService';
import { useCompassDeputados } from '../hooks/useCompassDeputados';

interface Props {
  compass: UsuarioCompass['compass'];
}

// Mesmos destaques da página /espectro — mantemos só os mais
// reconhecíveis pra não poluir o mapa.
const DESTAQUES_DEPUTADOS = [
  'Nikolas Ferreira',
  'Erika Hilton',
  'Guilherme Boulos',
  'André Janones',
  'Eduardo Bolsonaro',
  'Carlos Jordy',
  'Sâmia Bomfim',
  'Glauber Braga',
  'Tabata Amaral',
  'Kim Kataguiri',
  'Marcel Van Hattem',
  'Cabo Daciolo',
  'Gleisi Hoffmann',
  'Lindbergh Farias',
  'Zé Trovão',
  'Bia Kicis',
  'Sóstenes Cavalcante',
  'Marcelo Freixo',
  'Ivan Valente',
  'Carla Zambelli',
];

function corQuadrante(x: number, y: number) {
  if (x < 5 && y > 5) return '#ef4444';
  if (x >= 5 && y > 5) return '#3b82f6';
  if (x < 5 && y <= 5) return '#10b981';
  return '#a855f7';
}

function paraSvg(v: number, total: number) {
  return (v / 10) * total;
}

export function CardCompassUsuario({ compass }: Props) {
  const navigate = useNavigate();
  const { deputados, loading } = useCompassDeputados();
  const { x, y, quadrante, votos_relevantes } = compass;

  const corUsuario = corQuadrante(x, y);
  const size = 560;
  const cx = paraSvg(x, size);
  const cy = size - paraSvg(y, size);

  const semResposta = votos_relevantes === 0;

  // Filtra deputados em destaque pra não poluir o mapa.
  const destaques = useMemo(() => {
    const set = new Set(
      DESTAQUES_DEPUTADOS.map((n) => n.toLowerCase().trim()),
    );
    return deputados.filter((d) =>
      set.has((d.nomeUrna ?? '').toLowerCase().trim()),
    );
  }, [deputados]);

  return (
    <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 transition-colors mb-10">
      <header className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧭</span>
          <div>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
              Seu lugar no Espectro Político 2D
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              {semResposta
                ? 'Sem respostas suficientes para calcular sua posição'
                : `Você está em: ${quadrante}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/espectro')}
          className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-yellow-600 dark:hover:text-brandAccent transition-colors shrink-0"
        >
          Ver mapa completo →
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 items-start">
        {/* Compass */}
        <div className="relative w-full">
          <div className="text-center text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 mb-2">
            Autoritário
          </div>
          <div className="flex items-stretch gap-1">
            <div className="flex items-center">
              <div
                className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300"
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
            >
              {/* Quadrantes */}
              <rect x={0}        y={0}        width={size / 2} height={size / 2} fill="#fee2e2" />
              <rect x={size / 2} y={0}        width={size / 2} height={size / 2} fill="#dbeafe" />
              <rect x={0}        y={size / 2} width={size / 2} height={size / 2} fill="#d1fae5" />
              <rect x={size / 2} y={size / 2} width={size / 2} height={size / 2} fill="#ede9fe" />

              {/* Grid */}
              {Array.from({ length: 9 }).map((_, i) => {
                const v = ((i + 1) / 10) * size;
                return (
                  <g key={i}>
                    <line x1={v} y1={0} x2={v} y2={size} stroke="#9ca3af" strokeWidth={0.3} />
                    <line x1={0} y1={v} x2={size} y2={v} stroke="#9ca3af" strokeWidth={0.3} />
                  </g>
                );
              })}

              {/* Eixos centrais */}
              <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke="#374151" strokeWidth={1.5} />
              <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke="#374151" strokeWidth={1.5} />

              {/* Labels dos quadrantes (com baixa opacidade) */}
              <text x={size / 4}       y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill="#7f1d1d" opacity={0.35}>
                ESQ. AUTORITÁRIA
              </text>
              <text x={(size * 3) / 4} y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e3a8a" opacity={0.35}>
                DIR. AUTORITÁRIA
              </text>
              <text x={size / 4}       y={size - 12} textAnchor="middle" fontSize="11" fontWeight="800" fill="#065f46" opacity={0.35}>
                ESQ. LIBERTÁRIA
              </text>
              <text x={(size * 3) / 4} y={size - 12} textAnchor="middle" fontSize="11" fontWeight="800" fill="#581c87" opacity={0.35}>
                DIR. LIBERTÁRIA
              </text>

              {/* Deputados em destaque — pontos pequenos sem label,
                  só pra dar sentido de "onde os outros estão". */}
              {destaques.map((d) => {
                const dx = paraSvg(d.compass.x, size);
                const dy = size - paraSvg(d.compass.y, size);
                const cor = corQuadrante(d.compass.x, d.compass.y);
                return (
                  <g key={d.idApi}>
                    <title>
                      {d.nomeUrna} ({d.partido} — {d.estado})
                    </title>
                    <circle
                      cx={dx}
                      cy={dy}
                      r={5}
                      fill={cor}
                      opacity={0.5}
                      stroke="white"
                      strokeWidth={1}
                    />
                  </g>
                );
              })}

              {/* Ponto do usuário — GRANDE, dourado, label VOCÊ */}
              {!semResposta && (
                <g>
                  {/* Anel de "halo" pra destacar */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={22}
                    fill="none"
                    stroke="#facc15"
                    strokeWidth={2}
                    opacity={0.4}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={16}
                    fill="white"
                    stroke="#facc15"
                    strokeWidth={3}
                  />
                  <circle cx={cx} cy={cy} r={12} fill={corUsuario} />
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={900}
                    fill="white"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                  >
                    VOCÊ
                  </text>
                </g>
              )}
            </svg>

            <div className="flex items-center">
              <div
                className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300"
                style={{ writingMode: 'vertical-rl' }}
              >
                Direita
              </div>
            </div>
          </div>
          <div className="text-center text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 mt-2">
            Libertário
          </div>
        </div>

        {/* Painel lateral */}
        <div className="space-y-4">
          {semResposta ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
              Você pulou todas as perguntas — sem dados pra calcular sua
              posição. Refaça o quiz e responda Concordo ou Discordo em
              pelo menos algumas.
            </p>
          ) : (
            <>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 block">
                  Sua posição
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

              <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                  Os pontos coloridos são alguns deputados de destaque,
                  posicionados pelo mesmo modelo que calculou o seu
                  ponto. Compare maçã com maçã.
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                  Calculado a partir de {votos_relevantes} respostas
                  com peso ideológico.
                  {loading && ' Carregando deputados...'}
                </p>
              </div>
            </>
          )}

          {/* Legenda */}
          <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 block">
              Legenda
            </span>
            <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 border-2 border-yellow-500" />
              Você
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="inline-block w-3 h-3 rounded-full bg-gray-400 opacity-60" />
              Deputado em destaque
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
