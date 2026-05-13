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

// Pesos do eixo Y (libertário ↔ autoritário). Mesma convenção:
//   peso > 0 → puxa o ponto pra cima (autoritário)
//   peso < 0 → puxa o ponto pra baixo (libertário)
const TAGS_AUTORITARIO: ExemploTag[] = [
  { tag: 'pauta-bolsonarista', peso: +1.8, rotulo: 'Pauta Bolsonarista' },
  { tag: 'lei-e-ordem', peso: +1.8, rotulo: 'Lei e Ordem' },
  { tag: 'pro-vida', peso: +1.5, rotulo: 'Pró-vida' },
  { tag: 'vigilancia-estado', peso: +1.5, rotulo: 'Vigilância Estatal' },
  { tag: 'conservadorismo', peso: +1.0, rotulo: 'Conservadorismo' },
  { tag: 'freio-institucional', peso: +1.0, rotulo: 'Freio Institucional' },
  { tag: 'estado-forte', peso: +1.0, rotulo: 'Estado Forte' },
  { tag: 'controle-institucional', peso: +0.8, rotulo: 'Controle Institucional' },
  { tag: 'corporativismo', peso: +0.5, rotulo: 'Corporativismo' },
  { tag: 'intervencionismo', peso: +0.5, rotulo: 'Intervencionismo' },
];

const TAGS_LIBERTARIO: ExemploTag[] = [
  { tag: 'liberdade-civil', peso: -1.8, rotulo: 'Liberdade Civil' },
  { tag: 'estado-minimo', peso: -1.5, rotulo: 'Estado Mínimo' },
  { tag: 'progressismo', peso: -1.0, rotulo: 'Progressismo' },
  { tag: 'anti-establishment', peso: -1.0, rotulo: 'Antissistema' },
  { tag: 'pauta-de-costumes', peso: -0.8, rotulo: 'Pauta de Costumes' },
  { tag: 'liberalismo-economico', peso: -0.5, rotulo: 'Liberalismo Econômico' },
  { tag: 'direitos-sociais', peso: -0.5, rotulo: 'Direitos Sociais' },
  { tag: 'politica-identitaria', peso: -0.5, rotulo: 'Política Identitária' },
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
          <div className="my-6 p-6 bg-blue-50 dark:bg-blue-400/5 border-l-4 border-blue-400 rounded-r-xl">
            <p className="font-bold text-gray-900 dark:text-white mb-2">
              🧭 E o segundo eixo?
            </p>
            <p className="text-sm">
              Em paralelo a este score 0–10, calculamos um segundo
              eixo (Libertário ↔ Autoritário) seguindo exatamente a
              mesma lógica, com pesos próprios por tag. O resultado
              vira o mapa político 2D em{' '}
              <a href="/espectro" className="text-blue-600 dark:text-brandAccent underline">
                /espectro
              </a>
              . Veja a Seção 10 pra entender como o eixo Y é
              calculado.
            </p>
          </div>
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
              <strong>Eixo Y é mais ralo que o eixo X.</strong> As
              tags do banco foram inicialmente desenhadas pro eixo
              econômico. O eixo libertário/autoritário só tem boa
              resolução quando as PECs são etiquetadas com tags
              Y-puras (<code>lei-e-ordem</code>,{' '}
              <code>vigilancia-estado</code>,{' '}
              <code>liberdade-civil</code>). Em deputados que só
              votaram pautas econômicas, o Y vai puxar bastante pro
              partido.
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
              <code>src/lib/score.ts</code> — pesos das tags (1D e 2D)
              e cálculo do score por votos
            </li>
            <li>
              <code>src/lib/ideologia.ts</code> — Bayesian shrinkage
              (1D e 2D), alinhamento, probabilidades
            </li>
            <li>
              <code>src/lib/partidos.ts</code> — tabelas de bases
              ideológicas dos partidos (1D e 2D)
            </li>
          </ul>
          <p className="mt-4">
            Tudo TypeScript puro. Sem ML, sem caixa-preta. É só ler.
          </p>
        </Secao>

        <Secao numero="10" titulo="Espectro 2D — o segundo eixo">
          <p>
            Tudo que foi descrito até aqui descreve UM eixo: Esquerda ↔
            Direita (econômico/cultural). O mapa de espectro político
            em{' '}
            <a href="/espectro" className="text-blue-600 dark:text-brandAccent underline">
              /espectro
            </a>{' '}
            usa <strong>dois eixos</strong>, igual ao Political Compass
            clássico:
          </p>
          <div className="grid grid-cols-2 gap-3 my-6 text-center">
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-1">
                Eixo X
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                Esquerda ↔ Direita
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                econômico / cultural
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-1">
                Eixo Y
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                Libertário ↔ Autoritário
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                liberdade individual vs. controle institucional
              </div>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-8 mb-3">
            Peso dual por tag
          </h3>
          <p>
            Cada tag agora carrega <strong>dois pesos</strong>: um pra
            X, outro pra Y. Uma tag pode pesar muito num eixo e ser
            neutra no outro. Exemplos:
          </p>
          <Formula>
            "estado-forte" → x: −2.0, y: +1.0
          </Formula>
          <p className="text-sm">
            "Estado forte" é claramente esquerda no eixo econômico
            (peso x negativo, alto) e levemente autoritário no eixo Y
            (estado regulando mais a vida = puxa pra cima).
          </p>
          <Formula>
            "direitos-trabalhistas" → x: −1.0, y: 0.0
          </Formula>
          <p className="text-sm">
            Pauta puramente econômica: identifica esquerda, mas é
            neutra no eixo libertário/autoritário.
          </p>
          <Formula>
            "liberdade-civil" → x: 0.0, y: −1.8
          </Formula>
          <p className="text-sm">
            Tag <strong>Y-pura</strong>: não diz se a proposta é de
            esquerda ou direita, mas identifica claramente o eixo
            libertário.
          </p>

          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-10 mb-3">
            Pesos no eixo Y
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-blue-700 dark:text-blue-300 mb-3">
                ▲ Autoritário (y &gt; 0)
              </h4>
              <div className="space-y-2">
                {TAGS_AUTORITARIO.map((t) => (
                  <TagPeso key={t.tag} {...t} />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-green-700 dark:text-green-300 mb-3">
                ▼ Libertário (y &lt; 0)
              </h4>
              <div className="space-y-2">
                {TAGS_LIBERTARIO.map((t) => (
                  <TagPeso key={t.tag} {...t} />
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-10 mb-3">
            Tags Y-puras (novas)
          </h3>
          <p>
            Tags onde o peso X é zero (ou quase) e o sinal vive todo
            no eixo Y. Ainda não foram aplicadas a PECs do banco —
            entram no manual de etiquetagem das próximas votações pra
            ganhar resolução no eixo libertário/autoritário:
          </p>
          <ul className="list-disc list-inside space-y-2 my-4 ml-4 text-sm">
            <li>
              <code>lei-e-ordem</code> → endurecimento penal, redução
              da maioridade penal, prisão em 2ª instância
            </li>
            <li>
              <code>vigilancia-estado</code> → monitoramento de massa,
              controle de dados, regulação de redes
            </li>
            <li>
              <code>liberdade-civil</code> → habeas corpus,
              descriminalização, autonomia individual
            </li>
          </ul>

          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-10 mb-3">
            Shrinkage independente por eixo
          </h3>
          <p>
            A parte mais interessante: o Bayesian shrinkage da Seção 4
            roda <strong>separadamente em cada eixo</strong>. Isso
            porque uma tag pode contribuir pra X sem mexer em Y (e
            vice-versa). O peso total acumulado em cada eixo é
            independente:
          </p>
          <Formula>
            score_x = base_x · K/(K+n_x) + voto_x · n_x/(K+n_x)
          </Formula>
          <Formula>
            score_y = base_y · K/(K+n_y) + voto_y · n_y/(K+n_y)
          </Formula>
          <p>
            Resultado: um deputado que votou muito em pautas
            econômicas (n_x grande, n_y pequeno) terá{' '}
            <strong>alta confiança no posicionamento X</strong> (vem
            do comportamento real) e{' '}
            <strong>baixa confiança em Y</strong> (puxa pro partido).
            O tooltip do compass mostra essa confiança.
          </p>

          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-10 mb-3">
            Base 2D dos partidos
          </h3>
          <p>
            Cada partido tem agora um ponto âncora 2D em{' '}
            <code>partidos.ts</code>. Alguns exemplos pra dar a
            intuição:
          </p>
          <div className="grid grid-cols-2 gap-3 my-4 text-sm">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/5">
              <strong>PT</strong> → x: 2, y: 6{' '}
              <span className="text-gray-500 dark:text-gray-400">
                (esq autoritária leve)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/5">
              <strong>PL</strong> → x: 9, y: 8{' '}
              <span className="text-gray-500 dark:text-gray-400">
                (direita autoritária)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/5">
              <strong>NOVO</strong> → x: 10, y: 3{' '}
              <span className="text-gray-500 dark:text-gray-400">
                (libertário-direita)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/5">
              <strong>PSOL</strong> → x: 1, y: 6{' '}
              <span className="text-gray-500 dark:text-gray-400">
                (esq autoritária)
              </span>
            </div>
          </div>

          <div className="my-6 p-6 bg-yellow-50 dark:bg-yellow-400/5 border-l-4 border-yellow-400 rounded-r-xl">
            <p className="font-bold text-gray-900 dark:text-white mb-2">
              ⚠️ Honestidade intelectual
            </p>
            <p className="text-sm">
              O eixo Y é mais recente que o X e tem menos dados de
              votação encostando nele (poucas PECs foram etiquetadas
              com tags Y-puras até agora). Pra a maioria dos
              deputados, o Y vai estar bem perto da base do partido —
              é o shrinkage funcionando: na ausência de evidência, o
              chute mais honesto é o prior. Conforme mais PECs
              receberem tags Y-puras, o eixo ganha resolução.
            </p>
          </div>
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
