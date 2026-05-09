interface Props {
  totalVotos: number;
  votosRelevantes: number;
  mediaCamara: number | null;
  nivelConfianca: 'alta' | 'moderada' | 'baixa';
}

const LIMIAR_TOTAL_VOTOS = 30;

export function CoberturaBanner({
  totalVotos,
  votosRelevantes,
  mediaCamara,
  nivelConfianca,
}: Props) {
  const baixaCobertura = totalVotos < LIMIAR_TOTAL_VOTOS;
  const baixaConfianca = nivelConfianca === 'baixa';

  if (!baixaCobertura && !baixaConfianca) return null;

  const pctDaMedia =
    mediaCamara && mediaCamara > 0
      ? Math.round((totalVotos / mediaCamara) * 100)
      : null;

  return (
    <section className="bg-yellow-50 dark:bg-yellow-400/5 border-l-4 border-yellow-400 dark:border-brandAccent rounded-r-2xl p-5 md:p-6 transition-colors">
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0">⚠️</span>
        <div className="flex-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-yellow-700 dark:text-brandAccent mb-2">
            Cobertura limitada
          </h3>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            Este deputado tem{' '}
            <strong className="text-gray-900 dark:text-white">
              {totalVotos}{' '}
              {totalVotos === 1 ? 'voto registrado' : 'votos registrados'}
            </strong>{' '}
            em PECs no nosso banco
            {mediaCamara !== null && (
              <>
                , contra uma média de{' '}
                <strong className="text-gray-900 dark:text-white">
                  {mediaCamara.toFixed(0)} votos por deputado
                </strong>
                {pctDaMedia !== null && (
                  <>
                    {' '}
                    ({pctDaMedia}% da média)
                  </>
                )}
              </>
            )}
            . Os indicadores abaixo refletem uma amostra pequena e podem não
            representar o perfil completo dele.
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed">
            <strong>Importante:</strong> nosso banco registra apenas
            Propostas de Emenda à Constituição (PECs). Um deputado pode ter
            participação ativa em projetos de lei, MPs ou outras
            proposições que não aparecem aqui.
          </p>

          {votosRelevantes > 0 && votosRelevantes < totalVotos && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Apenas{' '}
              <strong className="text-gray-700 dark:text-gray-300">
                {votosRelevantes}
              </strong>{' '}
              {votosRelevantes === 1
                ? 'voto foi'
                : 'desses votos foram'}{' '}
              em pautas com peso ideológico claro.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
