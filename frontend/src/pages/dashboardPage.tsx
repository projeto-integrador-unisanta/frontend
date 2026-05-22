import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mapDeputadoToCharts } from '../components/mapDeputadoToCharts';
import { ScoreCard } from '../components/scoreCard';
import { PieVotos } from '../components/pieVotos';
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
import { CardCompassDeputado } from '../components/CardCompassDeputado';

const CATEGORIAS_NOMES = [
  'Bem-estar social',
  'Economia e trabalho',
  'Justiça, leis e segurança',
  'Política e governança',
  'Meio ambiente e recursos naturais',
  'Infraestrutura e urbanização',
  'Direitos humanos e sociedade',
  'Relações internacionais',
  'Ciência, tecnologia e informação',
  'Cultura, esporte e lazer',
  'Pauta Bolsonarista',
  'Pauta Governo',
];

const getCategoriaMock = (pecNome: string) => {
  if (!pecNome) return 'Geral';
  const nomeLower = pecNome.toLowerCase();
  if (nomeLower.includes('tributária') || nomeLower.includes('imposto'))
    return 'Economia e trabalho';
  if (nomeLower.includes('reforma')) return 'Política e governança';
  if (nomeLower.includes('armas') || nomeLower.includes('liberdade'))
    return 'Pauta Bolsonarista';
  if (nomeLower.includes('social') || nomeLower.includes('incentivo'))
    return 'Pauta Governo';

  const hash = pecNome.length % CATEGORIAS_NOMES.length;
  return CATEGORIAS_NOMES[hash];
};

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

function classificarAlinhamento(nota: number): {
  rotulo: string;
  cor: string;
  corTexto: string;
} {
  if (nota >= 8.5)
    return {
      rotulo: 'Quase sempre alinhado',
      cor: 'bg-green-500',
      corTexto: 'text-green-600 dark:text-green-400',
    };
  if (nota >= 7)
    return {
      rotulo: 'Frequentemente alinhado',
      cor: 'bg-green-500',
      corTexto: 'text-green-600 dark:text-green-400',
    };
  if (nota >= 5)
    return {
      rotulo: 'Posição mista',
      cor: 'bg-yellow-500',
      corTexto: 'text-yellow-600 dark:text-yellow-400',
    };
  if (nota >= 3)
    return {
      rotulo: 'Frequentemente diverge',
      cor: 'bg-orange-500',
      corTexto: 'text-orange-600 dark:text-orange-400',
    };
  return {
    rotulo: 'Quase sempre diverge',
    cor: 'bg-red-500',
    corTexto: 'text-red-600 dark:text-red-400',
  };
}

function AlinhamentoPorArea({
  categorias,
  nomePartido,
}: {
  categorias: { subject: string; nota: number; status: string }[];
  nomePartido: string;
}) {
  if (!categorias || categorias.length === 0) {
    return (
      <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors">
        <p className="text-sm text-gray-400 italic text-center">
          Sem dados suficientes para análise por área.
        </p>
      </section>
    );
  }

  const ordenadas = [...categorias].sort((a, b) => b.nota - a.nota);

  return (
    <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 md:p-8 transition-colors">
      <header className="mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎯</span>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
            Alinhamento com o partido por área
          </h2>
        </div>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          Mostra o quanto o deputado vota seguindo a linha do{' '}
          {nomePartido ? (
            <span className="font-black text-gray-700 dark:text-gray-200">
              {nomePartido}
            </span>
          ) : (
            'partido'
          )}{' '}
          em cada tema. Verde indica que vota junto com o partido na maioria das
          vezes; vermelho indica que costuma divergir.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ordenadas.map((c) => {
          const { rotulo, cor, corTexto } = classificarAlinhamento(c.nota);
          const pct = Math.max(0, Math.min(100, (c.nota / 10) * 100));
          return (
            <div
              key={c.subject}
              className="bg-gray-50 dark:bg-[#001b3d]/50 border border-gray-100 dark:border-white/5 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-3 gap-3">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug">
                  {c.subject}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${corTexto}`}
                >
                  {rotulo}
                </span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cor} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed italic">
          ℹ️ A análise compara cada voto do deputado com a posição majoritária do
          partido em cada tema. Categorias sem votos registrados não aparecem.
        </p>
      </footer>
    </section>
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
  const [showAllCategorias, setShowAllCategorias] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);

  const scrollParaHistorico = () => {
    const el = document.getElementById('secao-historico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const votosParaHistorico = useMemo(() => dados?.votos_recentes || [], [dados]);

  const votosPorCategoria = useMemo(() => {
    if (!votosParaHistorico || votosParaHistorico.length === 0) return [];

    const agrupamento: Record<string, { sim: number; nao: number }> = {};

    votosParaHistorico.forEach((v) => {
      const cat = getCategoriaMock(v.pec);
      if (!agrupamento[cat]) {
        agrupamento[cat] = { sim: 0, nao: 0 };
      }
      if (v.voto === 'Sim') agrupamento[cat].sim++;
      else if (v.voto === 'Não') agrupamento[cat].nao++;
    });

    return Object.entries(agrupamento)
      .map(([nome, counts]) => {
        const total = counts.sim + counts.nao;
        return {
          nome,
          total,
          votos: [
            {
              name: 'Sim',
              value: counts.sim,
              percent: total > 0 ? (counts.sim / total) * 100 : 0,
            },
            {
              name: 'Não',
              value: counts.nao,
              percent: total > 0 ? (counts.nao / total) * 100 : 0,
            },
          ],
        };
      })
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [votosParaHistorico]);

  const handlePecClick = (pecIdentificacao: string) => {
    const voto = votosParaHistorico.find((v) => v.pec === pecIdentificacao);
    setPecSelecionada({
      pec: findPecByLabel(pecsCache, pecIdentificacao),
      raw: pecIdentificacao,
      voto: voto?.voto,
      data: voto?.data,
    });
  };

  const votosFiltrados = useMemo(() => {
    if (!filtroCategoria) return votosParaHistorico;
    return votosParaHistorico.filter(
      (v) => getCategoriaMock(v.pec) === filtroCategoria,
    );
  }, [votosParaHistorico, filtroCategoria]);

  const navegarParaPec = (busca: string) => {
    setPecSelecionada(null);
    navigate(`/pecs?busca=${encodeURIComponent(busca)}`);
  };

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

  const { categorias } = mapDeputadoToCharts(ideologia);

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

        {/* BANNER DE COBERTURA */}
        <CoberturaBanner
          totalVotos={total_votos}
          votosRelevantes={ideologia.confianca?.votos_relevantes ?? 0}
          mediaCamara={mediaCamara}
          nivelConfianca={
            ideologia.confianca?.nivel ??
            (total_votos < 30 ? 'baixa' : 'alta')
          }
        />

        {/* HERO */}
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

        {/* MATCH */}
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

        {/* COMPASS 2D — espectro bidimensional + confiança por eixo */}
        <CardCompassDeputado
          idApi={dados.idApi}
          nomeDeputado={dados.nomeUrna}
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

        {/* VOTOS POR CATEGORIA - AGORA EXPANSÍVEL E PRINCIPAL */}
        {votosPorCategoria && votosPorCategoria.length > 0 && (
          <section className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors">
            <header className="mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
                Distribuição de Votos por Categoria
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                Como o deputado se posicionou em cada área temática
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(showAllCategorias
                ? votosPorCategoria
                : votosPorCategoria.slice(0, 3)
              ).map((cat) => (
                <button
                  key={cat.nome}
                  onClick={() => {
                    setFiltroCategoria(cat.nome);
                    scrollParaHistorico();
                  }}
                  className={`bg-gray-50 dark:bg-[#001b3d]/50 border rounded-2xl p-5 flex flex-col items-center transition-all group text-left w-full ${
                    filtroCategoria === cat.nome
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-gray-100 dark:border-white/5 hover:border-blue-400/30'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 text-center h-8 flex items-center line-clamp-2 leading-tight">
                    {cat.nome}
                  </span>

                  <div className="w-full relative pointer-events-none">
                    <PieVotos
                      data={cat.votos}
                      height={150}
                      innerRadius={45}
                      outerRadius={65}
                    />
                  </div>

                  <div className="grid grid-cols-2 w-full mt-4 border-t border-gray-100 dark:border-white/5 pt-4">
                    <div className="flex flex-col items-center border-r border-gray-100 dark:border-white/5">
                      <span className="text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-tighter">
                        Sim
                      </span>
                      <span className="text-lg font-black text-gray-900 dark:text-white tabular-nums">
                        {cat.votos[0]?.value || 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">
                        Não
                      </span>
                      <span className="text-lg font-black text-gray-900 dark:text-white tabular-nums">
                        {cat.votos[1]?.value || 0}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-[9px] font-bold text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver PECs desta pauta →
                  </div>
                </button>
              ))}
            </div>

            {votosPorCategoria.length > 3 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAllCategorias(!showAllCategorias)}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  {showAllCategorias
                    ? '↑ Mostrar Menos'
                    : `↓ Ver mais ${votosPorCategoria.length - 3} categorias`}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ALINHAMENTO POR ÁREA — substitui as antigas seções de perfil/distribuição/notas */}
        {isMounted && (
          <AlinhamentoPorArea
            categorias={categorias}
            nomePartido={dados.partido || ''}
          />
        )}

        {/* HISTÓRICO */}
        <section
          id="secao-historico"
          className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors scroll-mt-6"
        >
          <header className="mb-4 pb-4 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">
                  Histórico de votações
                </h2>
                {filtroCategoria && (
                  <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-md flex items-center gap-2">
                    {filtroCategoria}
                    <button
                      onClick={() => setFiltroCategoria(null)}
                      className="hover:text-blue-800 dark:hover:text-white transition-colors"
                      title="Limpar filtro"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                {filtroCategoria
                  ? `Mostrando apenas votos em "${filtroCategoria}"`
                  : 'Clique em uma PEC para ver detalhes e o placar completo'}
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/5">
              {votosFiltrados.length} registros{' '}
              {filtroCategoria && `de ${votosParaHistorico.length}`}
            </span>
          </header>

          {votosFiltrados.length > 0 ? (
            <HistoricoVotacoes
              votos={votosFiltrados}
              onPecClick={handlePecClick}
              getCategoriaMock={getCategoriaMock}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                Nenhum voto encontrado para esta categoria.
              </p>
              {filtroCategoria && (
                <button
                  onClick={() => setFiltroCategoria(null)}
                  className="mt-4 text-xs font-black uppercase tracking-widest text-blue-500 hover:underline"
                >
                  Ver todos os votos
                </button>
              )}
            </div>
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
