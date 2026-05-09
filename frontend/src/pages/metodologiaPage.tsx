import { Header } from '../components/Header';

interface ExemploTag {
  tag: string;
  peso: number;
  rotulo: string;
}

const TAGS_DIREITA: ExemploTag[] = [
  { tag: 'liberalismo-economico', peso: 2.0, rotulo: 'Liberalismo Econômico' },
  { tag: 'estado-minimo', peso: 2.0, rotulo: 'Estado Mínimo' },
  { tag: 'pro-vida', peso: 2.0, rotulo: 'Pró-vida' },
  { tag: 'pauta-bolsonarista', peso: 2.0, rotulo: 'Pauta Bolsonarista' },
  { tag: 'conservadorismo', peso: 1.8, rotulo: 'Conservadorismo' },
  { tag: 'austeridade-fiscal', peso: 1.5, rotulo: 'Austeridade Fiscal' },
  { tag: 'freio-institucional', peso: 1.5, rotulo: 'Freio Institucional' },
  { tag: 'reforma-estado', peso: 1.0, rotulo: 'Reforma do Estado' },
  { tag: 'anti-establishment', peso: 0.8, rotulo: 'Antissistema' },
];

const TAGS_ESQUERDA: ExemploTag[] = [
  { tag: 'estado-forte', peso: -2.0, rotulo: 'Estado Forte' },
  { tag: 'progressismo', peso: -1.8, rotulo: 'Progressismo' },
  { tag: 'assistencialismo', peso: -1.5, rotulo: 'Assistencialismo' },
  { tag: 'intervencionismo', peso: -1.5, rotulo: 'Intervencionismo' },
  { tag: 'politica-identitaria', peso: -1.5, rotulo: 'Política Identitária' },
  { tag: 'populismo-fiscal', peso: -1.0, rotulo: 'Populismo Fiscal' },
  { tag: 'direitos-trabalhistas', peso: -1.0, rotulo: 'Direitos Trabalhistas' },
  { tag: 'direitos-sociais', peso: -0.8, rotulo: 'Direitos Sociais' },
  { tag: 'meio-ambiente', peso: -0.8, rotulo: 'Meio Ambiente' },
  { tag: 'pauta-de-costumes', peso: -0.8, rotulo: 'Pauta de Costumes' },
];

function Secao({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
        <span className="text-sm font-black text-yellow-600 dark:text-brandAccent uppercase tracking-widest">
          {numero}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {titulo}
        </h2>
      </div>
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 p-6 bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/10 rounded-xl font-mono text-center text-gray-900 dark:text-white text-sm md:text-base overflow-x-auto">
      {children}
    </div>
  );
}

function TagPeso({ tag, peso, rotulo }: ExemploTag) {
  const direita = peso > 0;
  return (
    <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/5">
      <div>
        <span className="font-bold text-gray-900 dark:text-white text-sm">
          {rotulo}
        </span>
        <span className="block text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
          {tag}
        </span>
      </div>
      <span
        className={`font-mono font-extrabold text-sm px-3 py-1 rounded-md ${
          direita
            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
        }`}
      >
        {peso > 0 ? '+' : ''}
        {peso.toFixed(1)}
      </span>
    </div>
  );
}

export function MetodologiaPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#001b3d] flex flex-col transition-colors duration-300">
      <Header />

      <main className="max-w-4xl mx-auto py-12 px-4 flex-1 w-full">
        <header className="mb-16">
          <span className="inline-block bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 dark:text-brandAccent text-xs font-black uppercase tracking-widest px-3 py-1 rounded mb-4">
            Transparência
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-gray-900 dark:text-white">
            COMO CALCULAMOS A IDEOLOGIA
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl font-medium leading-relaxed">
            Toda análise política aqui é gerada por código aberto. Esta
            página explica passo a passo como cada número aparece — sem
            mágica, sem chute. Se você não concordar com algum peso ou
            critério, vai ver exatamente onde mudar.
          </p>
        </header>

        <Secao numero="01" titulo="O que estamos medindo">
          <p>
            Todo deputado recebe um <strong>score de 0 a 10</strong> que
            representa seu posicionamento ideológico:
          </p>
          <div className="grid grid-cols-3 gap-3 my-6 text-center">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="text-2xl font-black text-red-600 dark:text-red-400">
                0
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mt-1">
                Esquerda
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-300/30 dark:bg-white/5 border border-gray-300 dark:border-white/10">
              <div className="text-2xl font-black text-gray-700 dark:text-gray-300">
                5
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mt-1">
                Centro
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                10
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mt-1">
                Direita
              </div>
            </div>
          </div>
          <p>
            O score é construído a partir de duas fontes: o{' '}
            <strong>partido</strong> ao qual o deputado é filiado e o{' '}
            <strong>histórico real de votos</strong> dele em propostas com
            tags ideológicas. Os dois pesam de forma diferente dependendo
            de quantos votos relevantes existem — explicamos isso na
            Seção 4.
          </p>
        </Secao>

        <Secao numero="02" titulo="Pesos das tags ideológicas">
          <p>
            Cada Proposta de Emenda à Constituição (PEC) é etiquetada com{' '}
            <em>tags</em> temáticas (ex: "pro-vida", "estado-forte",
            "liberalismo-economico"). Cada tag recebe um peso numérico:
          </p>
          <ul className="list-disc list-inside space-y-2 my-4 ml-4">
            <li>
              <strong className="text-blue-600 dark:text-blue-400">
                Peso positivo
              </strong>{' '}
              → tag associada à direita (ex: <code>pro-vida</code> =
              +2.0)
            </li>
            <li>
              <strong className="text-red-600 dark:text-red-400">
                Peso negativo
              </strong>{' '}
              → tag associada à esquerda (ex:{' '}
              <code>estado-forte</code> = −2.0)
            </li>
            <li>
              <strong>Peso zero</strong> → tag neutra ou técnica (ex:{' '}
              <code>orcamento</code>, <code>diplomacia</code>)
            </li>
          </ul>
          <p>
            A magnitude (1.0, 1.5, 2.0…) representa o quanto a tag é
            <em> identificadora</em> ideologicamente. <code>pro-vida</code>{' '}
            é mais discriminante do que <code>anti-establishment</code>,
            por isso pesa mais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                ▲ Direita
              </h3>
              <div className="space-y-2">
                {TAGS_DIREITA.map((t) => (
                  <TagPeso key={t.tag} {...t} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-3">
                ▼ Esquerda
              </h3>
              <div className="space-y-2">
                {TAGS_ESQUERDA.map((t) => (
                  <TagPeso key={t.tag} {...t} />
                ))}
              </div>
            </div>
          </div>
        </Secao>

        <Secao numero="03" titulo="Score real pelos votos">
          <p>
            Para cada voto do deputado, transformamos a resposta em
            sinal numérico:
          </p>
          <Formula>
            sinal = +1 (Sim) | −1 (Não) | 0 (Abstenção)
          </Formula>
          <p>
            Aí, para cada tag presente na proposta votada, calculamos a
            contribuição daquele voto ao score:
          </p>
          <Formula>contribuição = sinal × peso_da_tag</Formula>
          <p>
            Somamos todas as contribuições e normalizamos para a escala
            0–10:
          </p>
          <Formula>
            score_votos = (Σ contribuição + Σ |peso|) / (2 · Σ |peso|) × 10
          </Formula>
          <div className="my-6 p-6 bg-yellow-50 dark:bg-yellow-400/5 border-l-4 border-yellow-400 rounded-r-xl">
            <p className="font-bold text-gray-900 dark:text-white mb-2">
              💡 Por que isso importa
            </p>
            <p className="text-sm">
              O sistema antigo só contava se o deputado disse "Sim" ou
              "Não", <strong>sem olhar do que era a proposta</strong>. Um
              deputado de direita que vota "Não" numa pauta progressista
              é <em>alinhado</em> com a direita, e o cálculo precisa
              reconhecer isso. A nossa fórmula olha ao mesmo tempo a
              direção do voto e a direção ideológica da pauta.
            </p>
          </div>
        </Secao>

        <Secao numero="04" titulo="Bayesian Shrinkage: misturando partido e votos">
          <p>
            Um problema clássico: e se um deputado votou em pouquíssimas
            pautas ideológicas? O <code>score_votos</code> dele vira
            ruído estatístico. Por outro lado, se ele tem milhares de
            votos relevantes, o partido dele importa cada vez menos —
            ele já provou no que acredita.
          </p>
          <p>
            A solução é o <strong>Bayesian shrinkage</strong>: o score
            final é uma média ponderada entre o partido (
            <em>prior</em>) e os votos (<em>evidência</em>), onde o peso
            depende de quantas tags relevantes o deputado acumulou:
          </p>
          <Formula>
            score = base_partido · K/(K+n) + score_votos · n/(K+n)
          </Formula>
          <p>
            Onde <code>n</code> é a soma dos pesos das tags votadas e{' '}
            <code>K = 20</code> é a constante de "smoothing". Quando
            <code> n = K</code>, partido e votos pesam metade-metade.
            Quando <code>n &gt;&gt; K</code>, o comportamento real
            domina.
          </p>

          <div className="my-6 p-6 bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 rounded-xl">
            <p className="font-bold text-gray-900 dark:text-white mb-3">
              📊 Exemplo prático
            </p>
            <p className="text-sm mb-3">
              Deputado do PL (base = 9) com poucos votos relevantes
              (n = 5):
            </p>
            <p className="text-sm font-mono ml-4 mb-2 text-gray-700 dark:text-gray-300">
              score = 9 × 20/25 + score_votos × 5/25
            </p>
            <p className="text-sm font-mono ml-4 mb-3 text-gray-700 dark:text-gray-300">
              score ≈ 7.2 + 0.2 × score_votos
            </p>
            <p className="text-sm">
              → o partido pesa <strong>80%</strong>. Conforme ele acumula
              votos relevantes, esse peso cai naturalmente.
            </p>
          </div>
        </Secao>

        <Secao numero="05" titulo="Alinhamento partidário">
          <p>
            O alinhamento mede o quanto o deputado vota{' '}
            <em>conforme a base ideológica</em> do próprio partido.
            Um trânsfuga ideológico (ex: deputado do PT votando como se
            fosse do PL) terá alinhamento baixo, mesmo que o partido seja
            de esquerda.
          </p>
          <Formula>
            alinhamento = max(0, 10 − |base_partido − score_votos|)
          </Formula>
          <p>
            10 = perfeitamente fiel ao partido. 0 = vota o oposto da
            base.
          </p>
        </Secao>

        <Secao numero="06" titulo="Notas por categoria">
          <p>
            Cada tag pertence a uma categoria temática (Bem-estar Social,
            Economia, Política e Governança, etc.). A nota da categoria
            (0–10) representa <strong>fidelidade partidária na área</strong>:
            quantos dos votos do deputado, naquela categoria, foram na
            direção esperada do partido dele.
          </p>
          <Formula>
            nota_categoria = (votos_alinhados / votos_totais) × 10
          </Formula>
          <p>
            Por isso o radar do dashboard mostra "alto" (≥7), "médio"
            (≥5) e "baixo": é a leitura de onde o deputado é mais ou
            menos fiel à linha do partido.
          </p>
        </Secao>

        <Secao numero="07" titulo="Probabilidade ideológica">
          <p>
            Pegamos o <code>score</code> final e calculamos a chance dele
            pertencer a cada um dos 5 espectros (Extrema Esquerda,
            Esquerda, Centro, Direita, Extrema Direita). O cálculo usa
            distância inversa em relação aos pontos âncora 1, 3, 5, 7, 9:
          </p>
          <Formula>
            peso_espectro = 1 / (|score − ancora| + 0.5)
          </Formula>
          <p>
            Os pesos são normalizados para somar 100%. O resultado vira
            uma distribuição de probabilidade — quanto mais perto de uma
            âncora, maior a chance daquele espectro.
          </p>
        </Secao>

        <Secao numero="08" titulo="Limitações que reconhecemos">
          <ul className="list-disc list-inside space-y-3 ml-4">
            <li>
              <strong>Tags são geradas por humanos.</strong> A
              classificação de cada PEC nas tags ideológicas envolve
              julgamento. Tentamos ser conservadores — pesos altos só
              em pautas claramente identificadoras.
            </li>
            <li>
              <strong>Peso do partido pode envelhecer.</strong> Partidos
              mudam de orientação ao longo do tempo. A tabela em{' '}
              <code>partidos.ts</code> precisa ser revista
              periodicamente.
            </li>
            <li>
              <strong>Abstenções valem zero.</strong> Não distinguimos
              quem estava ausente por estratégia política de quem
              simplesmente não estava lá. Isso pode ser refinado no
              futuro.
            </li>
            <li>
              <strong>Eixo único.</strong> Reduzir um deputado a um
              número de 0 a 10 é uma simplificação grande. Por isso
              também mostramos as notas por categoria e o
              alinhamento — três visões em vez de uma só.
            </li>
            <li>
              <strong>Cobertura das PECs.</strong> Só conseguimos
              analisar o que o deputado votou em PECs do nosso banco.
              Quem entrou recentemente na Câmara, ou quem se ausenta
              muito, terá perfil mais influenciado pelo partido.
            </li>
          </ul>
        </Secao>

        <Secao numero="09" titulo="Onde ver o código">
          <p>
            Toda a lógica está em três arquivos do backend:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 font-mono text-sm">
            <li>
              <code>src/lib/score.ts</code> — pesos das tags e cálculo do
              score por votos
            </li>
            <li>
              <code>src/lib/ideologia.ts</code> — Bayesian shrinkage,
              alinhamento, probabilidades
            </li>
            <li>
              <code>src/lib/partidos.ts</code> — tabela de bases
              ideológicas dos partidos
            </li>
          </ul>
          <p className="mt-4">
            Tudo TypeScript puro. Sem ML, sem caixa-preta. É só ler.
          </p>
        </Secao>

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500 italic">
            Projeto Integrador II — Universidade Santa Cecília
          </p>
        </footer>
      </main>
    </div>
  );
}
