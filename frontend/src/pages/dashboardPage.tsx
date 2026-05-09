import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  mapDeputadoToCharts,
  mapIdeologiaProbabilidades,
} from '../components/mapDeputadoToCharts';
import { ScoreCard } from '../components/scoreCard';
import { RadarCategorias } from '../components/radarCategorias';
import { PieVotos } from '../components/pieVotos';
import { BarCategorias } from '../components/barChart';
import { IdeologiaDistribuicao } from '../components/IdeologiaDistribuicao';
import { HistoricoVotacoes } from '../components/historicoVotacoes';
import { PecPreviewModal } from '../components/pecPreviewModal';
import { Header } from '../components/Header';
import type { Deputado } from '../models/deputado';
import type { PEC } from '../models/pec';
import { useDeputadoCompleto } from '../hooks/useDeputadoExpandido';
import { pecsService } from '../services/pecsService';
import {
  matchService,
  FIT_TAGS_STORAGE_KEY,
  type MatchResultado,
} from '../services/matchService';
import { coberturaService } from '../services/coberturaService';
import { CoberturaBanner } from '../components/coberturaBanner';

function findPecByLabel(pecs: PEC[], label: string): PEC | null {
  if (!label) return null;
  const byName = pecs.find(
    (p) => p.nome_popular && p.nome_popular.toLowerCase() === label.toLowerCase(),
  );
  if (byName) return byName;
  const m = label.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) {
    const numero = Number(m[1]);
    const ano = Number(m[2]);
    return (
      pecs.find((p) => p.numero === numero && p.ano === ano) || null
    );
  }
  return null;
}

function ResumoExecutivo({ bullets }: { bullets: string[] }) {
  if (!bullets || bullets.length === 0) return null;
  return (
    <section className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-400/5 dark:to-[#001529] border border-yellow-400/40 dark:border-yellow-400/20 rounded-2xl p-6 md:p-8 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📋</span>
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
          Resumo Executivo
        </h2>
      </div>
      <ul className="space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 dark:bg-brandAccent text-[#002B5B] dark:text-gray-900 font-black text-xs flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
              {b}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MatchCard({
  resultado,
  nomeDeputado,
  onLimpar,
}: {
  resultado: MatchResultado;
  nomeDeputado: string;
  onLimpar: () => void;
}) {
  const pct = resultado.percentual;
  const cor =
    pct >= 70
      ? 'from-green-500 to-emerald-600'
      : pct >= 40
        ? 'from-yellow-500 to-amber-600'
        : 'from-red-500 to-rose-600';
  const rotulo =
    pct >= 70
      ? 'Alto match'
      : pct >= 40
        ? 'Match parcial'
        : 'Baixo match';

  if (resultado.totalVotos === 0) {
    return (
      <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Seu match
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Não há votos do deputado nas pautas que você selecionou no quiz.
          </p>
        </div>
        <button
          onClick={onLimpar}
          className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-yellow-600 dark:hover:text-brandAccent transition-colors"
        >
          Limpar perfil
        </button>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-lg bg-gradient-to-br ${cor}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div className="flex-1">
          <span className="text-xs font-black uppercase tracking-widest opacity-80">
            🎯 Seu match com {nomeDeputado}
          </span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-5xl md:text-6xl font-black tabular-nums leading-none">
              {pct.toFixed(0)}%
            </span>
            <span className="text-base font-bold opacity-90">
              de afinidade
            </span>
          </div>
          <p className="text-sm mt-3 opacity-90 font-medium">
            {rotulo} · {resultado.votosAlinhados} de {resultado.totalVotos}{' '}
            votos alinhados com o seu perfil do quiz.
          </p>
        </div>
        <button
          onClick={onLimpar}
          className="text-[10px] font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity self-start md:self-center"
        >
          Limpar perfil
        </button>
      </div>
    </section>
  );
}

function CategoriasFallback({
  data,
}: {
  data: { subject: string; nota: number }[];
}) {
  if (!data.length) {
    return (
      <p className="text-sm text-gray-400 italic">Sem dados suficientes</p>
    );
  }
  return (
    <div className="w-full space-y-4 px-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-2">
        Poucas categorias para gerar o radar — exibindo barras horizontais.
      </p>
      {data.map((c) => {
        const pct = Math.max(0, Math.min(100, (c.nota / 10) * 100));
        const cor =
          c.nota >= 7
            ? 'bg-green-500'
            : c.nota >= 5
              ? 'bg-yellow-500'
              : 'bg-red-500';
        return (
          <div key={c.subject}>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {c.subject}
              </span>
              <span className="text-lg font-black text-gray-900 dark:text-white tabular-nums">
                {c.nota.toFixed(1)}
                <span className="text-xs text-gray-400 ml-1">/10</span>
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${cor} transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({
  rotulo,
  valor,
  sufixo,
  destaque,
}: {
  rotulo: string;
  valor: string | number;
  sufixo?: string;
  destaque?: 'verde' | 'vermelho' | 'cinza' | 'amarelo';
}) {
  const cor =
    destaque === 'verde'
      ? 'text-green-600 dark:text-green-400'
      : destaque === 'vermelho'
        ? 'text-red-600 dark:text-red-400'
        : destaque === 'amarelo'
          ? 'text-yellow-600 dark:text-brandAccent'
          : 'text-gray-900 dark:text-white';

  return (
    <div className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-5 transition-colors">
      <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
        {rotulo}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-black tabular-nums ${cor}`}>
          {valor}
        </span>
        {sufixo && (
          <span className="text-sm text-gray-400 dark:text-gray-500 font-bold">
            {sufixo}
          </span>
        )}
      </div>
    </div>
  );
}

function PainelChart({
  titulo,
  legenda,
  children,
}: {
  titulo: string;
  legenda?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors flex flex-col">
      <header className="mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
          {titulo}
        </h2>
        {legenda && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
            {legenda}
          </p>
        )}
      </header>
      <div className="flex-1 flex items-center justify-center min-h-[260px]">
        {children}
      </div>
    </div>
  );
}

function EstadoVazio({
  titulo,
  mensagem,
  onVoltar,
}: {
  titulo: string;
  mensagem: string;
  onVoltar: () => void;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#001b3d]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
            {titulo}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{mensagem}</p>
          <button
            onClick={onVoltar}
            className="px-6 py-3 bg-yellow-400 dark:bg-brandAccent text-[#002B5B] dark:text-gray-900 font-extrabold rounded-xl hover:bg-yellow-500 transition-colors uppercase tracking-wide text-sm"
          >
            ← Voltar para Políticos
          </button>
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#001b3d]">
      <Header />
      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-6">
        <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        <div className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-8 flex gap-6">
          <div className="w-32 h-44 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-2/3 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-40 bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const dados = location.state as Deputado | null;
  const { ideologia, ideal, loading, error } = useDeputadoCompleto(
    dados?.idApi || '',
  );

  const [isMounted, setIsMounted] = useState(false);
  const [pecsCache, setPecsCache] = useState<PEC[]>([]);
  const [pecSelecionada, setPecSelecionada] = useState<{
    pec: PEC | null;
    raw: string;
    voto?: string;
    data?: string;
  } | null>(null);
  const [match, setMatch] = useState<MatchResultado | null>(null);
  const [mediaCamara, setMediaCamara] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    coberturaService
      .obter()
      .then((c) => {
        if (!cancelled) setMediaCamara(c.media_votos_por_deputado);
      })
      .catch((err) => console.error('Erro ao buscar cobertura média:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    pecsService
      .listarPecs()
      .then((data) => {
        if (!cancelled) setPecsCache(data || []);
      })
      .catch((err) => console.error('Erro ao carregar PECs:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dados?.idApi) return;
    let cancelled = false;
    try {
      const raw = localStorage.getItem(FIT_TAGS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const tags: string[] = parsed?.tags ?? [];
      if (!Array.isArray(tags) || tags.length === 0) return;

      matchService
        .calcular(dados.idApi, tags)
        .then((res) => {
          if (!cancelled) setMatch(res);
        })
        .catch((err) => console.error('Erro ao calcular match:', err));
    } catch (err) {
      console.warn('Perfil do quiz inválido em localStorage:', err);
    }
    return () => {
      cancelled = true;
    };
  }, [dados?.idApi]);

  const limparPerfilQuiz = () => {
    localStorage.removeItem(FIT_TAGS_STORAGE_KEY);
    setMatch(null);
  };

  const voltar = () => navigate('/politicos');

  if (!dados) {
    return (
      <EstadoVazio
        titulo="Nenhum deputado selecionado"
        mensagem="Volte para a lista e escolha um político para visualizar o dashboard."
        onVoltar={voltar}
      />
    );
  }

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <EstadoVazio
        titulo="Erro ao carregar dados"
        mensagem={error || 'Não foi possível buscar as métricas deste deputado.'}
        onVoltar={voltar}
      />
    );
  }

  if (!ideologia || !ideal) {
    return (
      <EstadoVazio
        titulo="Dados insuficientes"
        mensagem="Este deputado ainda não tem informações suficientes no nosso banco para gerar uma análise."
        onVoltar={voltar}
      />
    );
  }

  const { categorias, votos } = mapDeputadoToCharts(ideologia);
  const ideologiaData = mapIdeologiaProbabilidades(ideal);
  const votosParaHistorico = dados.votos_recentes || [];

  const handlePecClick = (pecIdentificacao: string) => {
    const voto = votosParaHistorico.find((v) => v.pec === pecIdentificacao);
    setPecSelecionada({
      pec: findPecByLabel(pecsCache, pecIdentificacao),
      raw: pecIdentificacao,
      voto: voto?.voto,
      data: voto?.data,
    });
  };

  const navegarParaPec = (busca: string) => {
    setPecSelecionada(null);
    navigate(`/pecs?busca=${encodeURIComponent(busca)}`);
  };

  const hasCharts =
    isMounted && categorias?.length > 0 && ideologiaData?.length > 0;

  const { score, classificacao, base_partido, alinhamento } = ideologia.ideologia;
  const { total_votos, sim, nao, abstencao } = ideologia.estatisticas;
  const pctSim = total_votos > 0 ? (sim / total_votos) * 100 : 0;
  const pctNao = total_votos > 0 ? (nao / total_votos) * 100 : 0;
  const pctAbst = total_votos > 0 ? (abstencao / total_votos) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#001b3d] transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 space-y-6">
        <button
          onClick={voltar}
          className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-brandAccent transition-colors"
        >
          ← Voltar para Políticos
        </button>

        {/* BANNER DE COBERTURA — alerta neutro, foca em limitação dos dados.
            Renderiza mesmo se 'confianca' não vier do back (compat. retroativa). */}
        <CoberturaBanner
          totalVotos={total_votos}
          votosRelevantes={ideologia.confianca?.votos_relevantes ?? 0}
          mediaCamara={mediaCamara}
          nivelConfianca={
            ideologia.confianca?.nivel ??
            (total_votos < 30 ? 'baixa' : 'alta')
          }
        />

        {/* HERO: identificação do deputado */}
        <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 transition-colors">
          <div className="flex flex-col sm:flex-row gap-6">
            {dados.fotoUrl ? (
              <img
                src={dados.fotoUrl}
                alt={dados.nomeUrna}
                className="w-32 h-44 sm:w-36 sm:h-48 rounded-xl object-cover object-top border-2 border-gray-100 dark:border-white/10 shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-32 h-44 sm:w-36 sm:h-48 rounded-xl bg-gray-100 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0">
                Sem foto
              </div>
            )}

            <div className="flex-1 min-w-0">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Deputado Federal
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2 leading-tight tracking-tight">
                {dados.nomeUrna}
              </h1>

              <div className="flex flex-wrap gap-2 mt-4">
                {dados.partido && (
                  <span className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-brandAccent text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-md">
                    {dados.partido}
                  </span>
                )}
                {dados.estado && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-md">
                    {dados.estado}
                  </span>
                )}
              </div>

              {dados.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 break-all font-medium">
                  📧 {dados.email.toLowerCase()}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* MATCH com perfil do usuário (vem do quiz /fit) */}
        {match && (
          <MatchCard
            resultado={match}
            nomeDeputado={dados.nomeUrna}
            onLimpar={limparPerfilQuiz}
          />
        )}

        {/* RESUMO EXECUTIVO */}
        {ideologia.resumo && ideologia.resumo.length > 0 && (
          <ResumoExecutivo bullets={ideologia.resumo} />
        )}

        {/* SCORE */}
        <ScoreCard
          score={score}
          classificacao={classificacao}
          basePartido={base_partido}
          alinhamento={alinhamento}
          confianca={ideologia.confianca}
        />

        {/* ESTATÍSTICAS */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-3">
            Atividade Parlamentar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              rotulo="Votos registrados"
              valor={total_votos}
              destaque="amarelo"
            />
            <StatCard
              rotulo="A favor"
              valor={`${pctSim.toFixed(0)}%`}
              sufixo={`(${sim})`}
              destaque="verde"
            />
            <StatCard
              rotulo="Contra"
              valor={`${pctNao.toFixed(0)}%`}
              sufixo={`(${nao})`}
              destaque="vermelho"
            />
            <StatCard
              rotulo="Abstenções"
              valor={`${pctAbst.toFixed(0)}%`}
              sufixo={`(${abstencao})`}
              destaque="cinza"
            />
          </div>
        </section>

        {/* GRÁFICOS LADO A LADO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PainelChart
            titulo="Perfil por categoria"
            legenda="Fidelidade partidária em cada área temática (0–10)"
          >
            {hasCharts && categorias.length >= 3 ? (
              <div className="w-full h-[320px]">
                <RadarCategorias data={categorias} />
              </div>
            ) : hasCharts && categorias.length > 0 ? (
              <CategoriasFallback data={categorias} />
            ) : (
              <p className="text-sm text-gray-400 italic">
                Sem dados suficientes
              </p>
            )}
          </PainelChart>

          <PainelChart
            titulo="Distribuição ideológica"
            legenda="Probabilidade do deputado em cada espectro político"
          >
            {hasCharts && ideologiaData.length > 0 ? (
              <div className="w-full h-[320px]">
                <IdeologiaDistribuicao data={ideologiaData} />
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Sem dados suficientes
              </p>
            )}
          </PainelChart>
        </section>

        {/* PROPORÇÃO DE VOTOS + BARRAS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PainelChart
            titulo="Proporção Sim x Não"
            legenda="Considerando todas as votações"
          >
            {votos.length > 0 ? (
              <div className="w-full">
                <PieVotos data={votos} />
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Sem dados suficientes
              </p>
            )}
          </PainelChart>

          <div className="lg:col-span-2">
            <PainelChart
              titulo="Notas por categoria"
              legenda="Quanto maior, mais fiel à linha do partido naquela área"
            >
              {hasCharts && categorias.length > 0 ? (
                <div className="w-full h-[340px]">
                  <BarCategorias data={categorias} />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Sem dados suficientes
                </p>
              )}
            </PainelChart>
          </div>
        </section>

        {/* HISTÓRICO */}
        <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors">
          <header className="mb-4 pb-4 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
                Histórico de votações
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                Clique em uma PEC para ver detalhes e o placar completo
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              {votosParaHistorico.length} registros
            </span>
          </header>
          {votosParaHistorico.length > 0 ? (
            <HistoricoVotacoes
              votos={votosParaHistorico}
              onPecClick={handlePecClick}
            />
          ) : (
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 italic py-12">
              Nenhum voto recente registrado para este deputado.
            </p>
          )}
        </section>
      </main>

      {pecSelecionada && (
        <PecPreviewModal
          pec={pecSelecionada.pec}
          pecRaw={pecSelecionada.raw}
          voto={pecSelecionada.voto}
          data={pecSelecionada.data}
          onClose={() => setPecSelecionada(null)}
          onVerCompleta={navegarParaPec}
        />
      )}
    </div>
  );
}
