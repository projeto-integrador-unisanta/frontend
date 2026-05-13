import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useCompassDeputados } from '../hooks/useCompassDeputados';
import type { DeputadoCompass } from '../models/deputadoCompass';

// Ponto plotado no compass. Coordenadas em escala 0–10 (centro = 5),
// igual ao backend. Vem direto do endpoint /deputados/compass.
interface Ponto {
  id: string;
  nome: string;
  x: number;
  y: number;
  partido?: string | null;
  estado?: string | null;
  fotoUrl?: string | null;
  quadrante?: string;
  alinhamento?: number;
  votosRelevantes?: number;
  // confiança média (0..1): quanto desse ponto é comportamento real
  // de votação vs. herdado do partido.
  pesoComportamento?: number;
  // dados completos do deputado, pra navegar ao dashboard
  deputado: DeputadoCompass;
}

// Deputados que merecem destaque por reconhecimento público.
// Vão ser cruzados por NOME com a resposta do endpoint /deputados/compass.
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

const RANGE_MIN = 0;
const RANGE_MAX = 10;

// ──────────────────────────────────────────────
// Label deconfliction
// ──────────────────────────────────────────────

interface LabelLayout {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

const LABEL_FS = 11;
const LABEL_CW = 6.0; // estimated char width at 11px
const LABEL_LH = LABEL_FS + 3;
const DOT_EFF_R = 11; // dot visual radius incl. stroke
const LABEL_PAD = 4;

function computeLabelLayouts(pontos: Ponto[], size: number): Map<string, LabelLayout> {
  const pts = pontos.map((p) => ({
    id: p.id,
    cx: paraSvg(p.x, size),
    cy: size - paraSvg(p.y, size),
    w: p.nome.length * LABEL_CW + 6,
  }));

  // [dx, dy, textAnchor] — offsets from dot center to text baseline
  const CANDS: Array<[number, number, LabelLayout['anchor']]> = [
    [DOT_EFF_R + LABEL_PAD,  LABEL_FS / 2,               'start' ],  // right-mid
    [DOT_EFF_R + LABEL_PAD, -(LABEL_FS + 2),              'start' ],  // right-up
    [DOT_EFF_R + LABEL_PAD,  LABEL_FS + LABEL_PAD + 2,   'start' ],  // right-down
    [-(DOT_EFF_R + LABEL_PAD),  LABEL_FS / 2,            'end'   ],  // left-mid
    [-(DOT_EFF_R + LABEL_PAD), -(LABEL_FS + 2),          'end'   ],  // left-up
    [0, -(DOT_EFF_R + LABEL_PAD + 2),                    'middle'],  // above
    [0,  DOT_EFF_R + LABEL_PAD + LABEL_FS,               'middle'],  // below
    [-(DOT_EFF_R + LABEL_PAD),  LABEL_FS + LABEL_PAD + 2, 'end'  ],  // left-down
  ];

  // Each placed label is stored as [x, y, w, h] (top-left origin)
  type BBox = [number, number, number, number];
  const placed: BBox[] = [];
  const result = new Map<string, LabelLayout>();

  for (const pt of pts) {
    let bestScore = Infinity;
    let bestLayout: LabelLayout = {
      x: pt.cx + DOT_EFF_R + LABEL_PAD,
      y: pt.cy + LABEL_FS / 2,
      anchor: 'start',
    };
    let bestBox: BBox = [
      pt.cx + DOT_EFF_R + LABEL_PAD,
      pt.cy - LABEL_FS / 2,
      pt.w,
      LABEL_LH,
    ];

    for (const [dx, dy, anchor] of CANDS) {
      const tx = pt.cx + dx;
      const ty = pt.cy + dy;

      let bx: number;
      if (anchor === 'start') bx = tx;
      else if (anchor === 'end') bx = tx - pt.w;
      else bx = tx - pt.w / 2;
      const by = ty - LABEL_FS;

      let score = 0;

      // Penalty for going out of the SVG viewport
      if (bx < 2 || bx + pt.w > size - 2) score += 80;
      if (by < 2 || by + LABEL_LH > size - 2) score += 80;

      // Penalty for overlapping a dot circle
      for (const other of pts) {
        if (other.id === pt.id) continue;
        const nx = Math.max(bx, Math.min(other.cx, bx + pt.w));
        const ny = Math.max(by, Math.min(other.cy, by + LABEL_LH));
        const d2 = (nx - other.cx) ** 2 + (ny - other.cy) ** 2;
        if (d2 < (DOT_EFF_R + 2) ** 2) score += 4;
      }

      // Penalty for overlapping an already-placed label
      for (const [px, py, pw, ph] of placed) {
        const xOvlp = bx < px + pw + 1 && bx + pt.w + 1 > px;
        const yOvlp = by < py + ph + 1 && by + LABEL_LH + 1 > py;
        if (xOvlp && yOvlp) score += 15;
      }

      if (score < bestScore) {
        bestScore = score;
        bestLayout = { x: tx, y: ty, anchor };
        bestBox = [bx, by, pt.w, LABEL_LH];
      }
    }

    placed.push(bestBox);
    result.set(pt.id, bestLayout);
  }

  return result;
}

// ──────────────────────────────────────────────

function corDoPonto(x: number, y: number) {
  if (x < 5 && y > 5) return '#ef4444'; // esq autoritária
  if (x >= 5 && y > 5) return '#3b82f6'; // dir autoritária
  if (x < 5 && y <= 5) return '#10b981'; // esq libertária
  return '#a855f7'; // dir libertária
}

function paraSvg(v: number, total: number) {
  return ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * total;
}

interface PontoProps {
  ponto: Ponto;
  size: number;
  hovered: string | null;
  setHovered: (n: string | null) => void;
  onClick?: (p: Ponto) => void;
  labelLayout?: LabelLayout;
  showLabel: boolean;
}

function PontoSvg({ ponto, size, hovered, setHovered, onClick, labelLayout, showLabel }: PontoProps) {
  const cx = paraSvg(ponto.x, size);
  const cy = size - paraSvg(ponto.y, size); // inverte Y porque autoritário fica em cima
  const cor = corDoPonto(ponto.x, ponto.y);
  const isHovered = hovered === ponto.id;
  const r = isHovered ? 9 : 6;

  // Default label anchor (right of dot) — used when hovered
  const defLx = cx + DOT_EFF_R + LABEL_PAD;
  const defLy = cy + LABEL_FS / 2;

  // Pre-computed deconflicted position (or fall back to default)
  const lx = labelLayout?.x ?? defLx;
  const ly = labelLayout?.y ?? defLy;
  const anchor = labelLayout?.anchor ?? 'start';

  // Draw a thin leader line when the label was pushed away from the dot
  const displaced =
    labelLayout != null &&
    Math.hypot(lx - defLx, ly - defLy) > 18;

  return (
    <g
      onMouseEnter={() => setHovered(ponto.id)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => onClick?.(ponto)}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={cx} cy={cy} r={r + 2} fill="white" stroke={cor} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={r} fill={cor} />

      {/* Static label — shown only in destaque mode or on hover */}
      {(showLabel || isHovered) && (
        <>
          {/* Thin connector when label was displaced from default position */}
          {displaced && !isHovered && (
            <line
              x1={cx}
              y1={cy}
              x2={lx}
              y2={ly}
              stroke={cor}
              strokeWidth={0.8}
              opacity={0.4}
              style={{ pointerEvents: 'none' }}
            />
          )}
          <text
            x={isHovered ? defLx : lx}
            y={isHovered ? defLy : ly}
            fontSize={isHovered ? 13 : LABEL_FS}
            fontWeight={isHovered ? 800 : 600}
            fill="#111827"
            textAnchor={isHovered ? 'start' : anchor}
            className="dark:fill-white"
            style={{ pointerEvents: 'none', textShadow: '0 0 3px white, 0 0 3px white' }}
          >
            {ponto.nome}
          </text>
        </>
      )}

      {isHovered && (
        <foreignObject x={cx + 12} y={cy + 8} width={260} height={130}>
          <div className="bg-white dark:bg-[#001529] text-[11px] p-2 rounded-lg border border-gray-300 dark:border-white/20 shadow-lg space-y-1">
            <div className="flex items-center gap-2">
              {ponto.fotoUrl && (
                <img
                  src={ponto.fotoUrl}
                  alt={ponto.nome}
                  className="w-8 h-10 object-cover rounded"
                />
              )}
              <div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {ponto.nome}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-[10px]">
                  {ponto.partido && ponto.estado
                    ? `${ponto.partido} — ${ponto.estado}`
                    : ponto.partido || ''}
                </div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-gray-600 dark:text-gray-400">
              x: {ponto.x.toFixed(1)} • y: {ponto.y.toFixed(1)}
              {ponto.quadrante ? ` • ${ponto.quadrante}` : ''}
            </div>
            {ponto.pesoComportamento !== undefined && (
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                Confiança: {Math.round(ponto.pesoComportamento * 100)}%{' '}
                ({ponto.votosRelevantes} votos relevantes)
              </div>
            )}
            <div className="text-[10px] font-bold text-blue-600 dark:text-brandAccent pt-1 border-t border-gray-100 dark:border-white/10 mt-1">
              Clique para ver o dashboard →
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

function deputadoParaPonto(d: DeputadoCompass): Ponto {
  // Confiança média entre os dois eixos — heurística simples pra
  // mostrar no tooltip "quanto desse ponto vem do voto vs. partido".
  const conf =
    (d.compass.peso_comportamento.x + d.compass.peso_comportamento.y) / 2;
  return {
    id: `dep-${d.idApi}`,
    nome: d.nomeUrna,
    x: d.compass.x,
    y: d.compass.y,
    partido: d.partido,
    estado: d.estado,
    fotoUrl: d.fotoUrl,
    quadrante: d.compass.quadrante,
    alinhamento: d.compass.alinhamento,
    votosRelevantes: d.compass.votos_relevantes,
    pesoComportamento: conf,
    deputado: d,
  };
}

export function EspectroPage() {
  const navigate = useNavigate();
  const { deputados: deputadosCompass, loading, error } = useCompassDeputados();
  const [hovered, setHovered] = useState<string | null>(null);
  const [modoDestaque, setModoDestaque] = useState(true);

  // Navega pro dashboard do deputado. O Dashboard espera o objeto
  // Deputado completo via location.state. O compass tem todos os
  // campos exceto votos_recentes — o Dashboard lida com o vazio.
  const irParaDashboard = (p: Ponto) => {
    const d = p.deputado;
    navigate('/dashboard', {
      state: {
        id: d.id,
        idApi: d.idApi,
        nomeUrna: d.nomeUrna,
        fotoUrl: d.fotoUrl ?? '',
        email: '',
        partido: d.partido,
        estado: d.estado,
        votos_recentes: [],
      },
    });
  };

  const pontos = useMemo<Ponto[]>(() => {
    const destaquesSet = new Set(
      DESTAQUES_DEPUTADOS.map((n) => n.toLowerCase().trim()),
    );

    const deputadosFiltrados = modoDestaque
      ? deputadosCompass.filter((d) =>
          destaquesSet.has((d.nomeUrna ?? '').toLowerCase().trim()),
        )
      : deputadosCompass;

    return deputadosFiltrados.map(deputadoParaPonto);
  }, [deputadosCompass, modoDestaque]);

  const size = 720;

  // Em destaque mode os ~36 pontos cabem com labels — roda
  // deconfliction. Em modo "todos os deputados" (500+) labels ficam
  // ilegíveis de qualquer jeito, então só mostra no hover.
  const mostrarLabels = modoDestaque;
  const labelLayouts = useMemo(
    () => (mostrarLabels ? computeLabelLayouts(pontos, size) : new Map<string, LabelLayout>()),
    [pontos, size, mostrarLabels],
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#001b3d] flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <header className="mb-8">
          <span className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-brandAccent text-xs font-black uppercase tracking-widest px-3 py-1 rounded mb-3">
            Visualização
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white mb-3">
            ESPECTRO POLÍTICO 2D
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            O mapa abaixo segue o modelo do <em>Political Compass</em>: além do
            eixo Esquerda–Direita (econômico), introduz um segundo eixo de
            Autoritarismo–Libertarismo. Cada ponto é um deputado, posicionado
            automaticamente pelo backend a partir dos votos reais em PECs
            (modelo 2D com Bayesian shrinkage por eixo).
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={modoDestaque}
              onChange={(e) => setModoDestaque(e.target.checked)}
              className="rounded"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Apenas deputados em destaque ({DESTAQUES_DEPUTADOS.length})
            </span>
          </label>

          {loading && (
            <span className="text-xs text-gray-500 dark:text-gray-400 italic ml-2">
              Calculando compass de todos os deputados...
            </span>
          )}
          {error && (
            <span className="text-xs text-red-500 ml-2">{error}</span>
          )}
        </div>

        <div className="bg-white dark:bg-[#001529] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-4 md:p-8">
          <div className="relative w-full" style={{ maxWidth: size }}>
            <div className="text-center text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-2">
              Autoritário
            </div>
            <div className="flex items-stretch gap-2">
              <div className="flex items-center">
                <div
                  className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  Esquerda
                </div>
              </div>

              <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-auto border border-gray-300 dark:border-white/20"
              >
                {/* Quadrantes: y < 5 (libertário) embaixo, y > 5 (autoritário) em cima.
                    Mas SVG: y cresce pra baixo → autoritário fica no top do SVG (y svg pequeno).
                    Quadrante superior-esquerdo = esq autoritária (vermelho)
                    Quadrante superior-direito = dir autoritária (azul)
                    Quadrante inferior-esquerdo = esq libertária (verde)
                    Quadrante inferior-direito = dir libertária (roxo)
                */}
                <rect x={0}        y={0}        width={size / 2} height={size / 2} fill="#fee2e2" />
                <rect x={size / 2} y={0}        width={size / 2} height={size / 2} fill="#dbeafe" />
                <rect x={0}        y={size / 2} width={size / 2} height={size / 2} fill="#d1fae5" />
                <rect x={size / 2} y={size / 2} width={size / 2} height={size / 2} fill="#ede9fe" />

                {Array.from({ length: 9 }).map((_, i) => {
                  const v = ((i + 1) / 10) * size;
                  return (
                    <g key={i}>
                      <line x1={v} y1={0} x2={v} y2={size} stroke="#9ca3af" strokeWidth={0.3} />
                      <line x1={0} y1={v} x2={size} y2={v} stroke="#9ca3af" strokeWidth={0.3} />
                    </g>
                  );
                })}

                <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke="#374151" strokeWidth={2} />
                <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke="#374151" strokeWidth={2} />

                <text x={size / 4}       y={30} textAnchor="middle" fontSize="14" fontWeight="800" fill="#7f1d1d" opacity={0.4}>
                  ESQUERDA AUTORITÁRIA
                </text>
                <text x={(size * 3) / 4} y={30} textAnchor="middle" fontSize="14" fontWeight="800" fill="#1e3a8a" opacity={0.4}>
                  DIREITA AUTORITÁRIA
                </text>
                <text x={size / 4}       y={size - 14} textAnchor="middle" fontSize="14" fontWeight="800" fill="#065f46" opacity={0.4}>
                  ESQUERDA LIBERTÁRIA
                </text>
                <text x={(size * 3) / 4} y={size - 14} textAnchor="middle" fontSize="14" fontWeight="800" fill="#581c87" opacity={0.4}>
                  DIREITA LIBERTÁRIA
                </text>

                {/* Pontos: renderiza primeiro os não-hovered, depois o hovered por cima */}
                {pontos
                  .filter((p) => p.id !== hovered)
                  .map((p) => (
                    <PontoSvg
                      key={p.id}
                      ponto={p}
                      size={size}
                      hovered={hovered}
                      setHovered={setHovered}
                      onClick={irParaDashboard}
                      labelLayout={labelLayouts.get(p.id)}
                      showLabel={mostrarLabels}
                    />
                  ))}
                {pontos
                  .filter((p) => p.id === hovered)
                  .map((p) => (
                    <PontoSvg
                      key={p.id}
                      ponto={p}
                      size={size}
                      hovered={hovered}
                      setHovered={setHovered}
                      onClick={irParaDashboard}
                      labelLayout={labelLayouts.get(p.id)}
                      showLabel={mostrarLabels}
                    />
                  ))}
              </svg>

              <div className="flex items-center">
                <div
                  className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  Direita
                </div>
              </div>
            </div>
            <div className="text-center text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mt-2">
              Libertário
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/40">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-900 dark:text-red-300">
                Esq. Autoritária
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                Dir. Autoritária
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/40">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-green-900 dark:text-green-300">
                Esq. Libertária
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-900/40">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                Dir. Libertária
              </span>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-4">
            Deputados plotados ({pontos.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {pontos.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => irParaDashboard(p)}
                title="Ver dashboard do deputado"
                className={`bg-white dark:bg-[#001529] border rounded-xl p-3 flex items-center gap-3 transition-all cursor-pointer ${
                  hovered === p.id
                    ? 'border-blue-500 dark:border-brandAccent shadow-md scale-[1.02]'
                    : 'border-gray-200 dark:border-white/10'
                }`}
              >
                {p.fotoUrl ? (
                  <img
                    src={p.fotoUrl}
                    alt={p.nome}
                    className="w-10 h-12 object-cover rounded"
                  />
                ) : (
                  <div
                    className="w-10 h-12 rounded flex items-center justify-center text-white font-black text-xs"
                    style={{ backgroundColor: corDoPonto(p.x, p.y) }}
                  >
                    {p.nome.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {p.nome}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
                    {p.partido && p.estado
                      ? `${p.partido} • ${p.estado}`
                      : p.partido || ''}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
                    ({p.x.toFixed(1)}, {p.y.toFixed(1)})
                    {p.quadrante ? ` ${p.quadrante.split(' ').map((w) => w[0]).join('')}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-400/5 border-l-4 border-yellow-400 rounded-r-xl">
          <p className="font-bold text-gray-900 dark:text-white mb-2">
            Sobre a metodologia
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            x e y são calculados pelo backend usando{' '}
            <strong>peso dual por tag</strong> e{' '}
            <strong>Bayesian shrinkage por eixo</strong>: cada tag de PEC tem
            um peso no eixo econômico e outro no eixo libertário/autoritário,
            e a confiança em cada eixo cresce conforme o deputado acumula votos
            em pautas relevantes naquele eixo. Detalhes em{' '}
            <a href="/metodologia" className="text-blue-600 dark:text-brandAccent underline">
              Metodologia
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
