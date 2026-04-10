import { usePecs } from '../hooks/usePecs';
import { usePecVotos } from '../hooks/usePecVotos';
import { useDeputados } from '../hooks/useDeputados';
import { CardPec } from '../components/cardPec';
import { DeputadoModal } from '../components/DeputadoModal';
import { PecVotesModal } from '../components/PecVotesModal';
import { PecFilters } from '../components/PecFilters';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type PEC } from '../models/pec';
import { type Deputado } from '../models/deputado';
import { Header } from '../components/Header';

export function PecPage() {
  const { pecs, loading, error } = usePecs();
  const { deputados } = useDeputados('');
  const {
    votos,
    loading: loadingVotos,
    error: errorVotos,
    carregarVotos,
    limparVotos,
  } = usePecVotos();

  const [searchParams] = useSearchParams();
  const [busca, setBusca] = useState('');
  const [ano, setAno] = useState('');

  const [pecSelecionada, setPecSelecionada] = useState<PEC | null>(null);

  const [politicoSelecionado, setPoliticoSelecionado] =
    useState<Deputado | null>(null);
  const [isPoliticoModalOpen, setIsPoliticoModalOpen] = useState(false);

  const handleAbrirVotos = (pec: PEC) => {
    setPecSelecionada(pec);
    carregarVotos(pec.numero, pec.ano);
  };

  const handleAbrirPolitico = (nome: string) => {
    const deputado = deputados.find(
      (d) => d.nomeUrna.toLowerCase() === nome.toLowerCase(),
    );
    if (deputado) {
      setPoliticoSelecionado(deputado);
      setIsPoliticoModalOpen(true);
    }
  };

  useEffect(() => {
    const buscaParam = searchParams.get('busca');
    if (buscaParam) {
      setBusca(buscaParam);

      if (pecs.length > 0) {
        const pecEncontrada = pecs.find((pec) => {
          const identificacao =
            `${pec.siglaTipo} ${pec.numero}/${pec.ano}`.toLowerCase();
          return (
            identificacao === buscaParam.toLowerCase() ||
            (pec.nome_popular &&
              pec.nome_popular.toLowerCase() === buscaParam.toLowerCase())
          );
        });

        if (pecEncontrada) {
          handleAbrirVotos(pecEncontrada);
        }
      }
    }
  }, [searchParams, pecs]);

  const anos = useMemo(() => {
    const uniqueYears = [...new Set(pecs.map((pec) => pec.ano))];
    return uniqueYears.sort((a, b) => b - a);
  }, [pecs]);

  const pecsFiltradas = useMemo(() => {
    const buscaLower = busca.toLowerCase();
    return pecs.filter((pec) => {
      const identificacao =
        `${pec.siglaTipo} ${pec.numero}/${pec.ano}`.toLowerCase();
      const matchBusca =
        pec.ementa.toLowerCase().includes(buscaLower) ||
        pec.numero.toString().includes(buscaLower) ||
        pec.siglaTipo.toLowerCase().includes(buscaLower) ||
        (pec.nome_popular &&
          pec.nome_popular.toLowerCase().includes(buscaLower)) ||
        identificacao.includes(buscaLower);
      const matchAno = ano === '' || pec.ano.toString() === ano;
      return matchBusca && matchAno;
    });
  }, [pecs, busca, ano]);

  const handleFecharModal = () => {
    setPecSelecionada(null);
    limparVotos();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#001b3d] flex flex-col transition-colors duration-300">
      <Header />
      <main className="max-w-6xl w-full mx-auto flex flex-col p-6 md:p-10 flex-1">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          Busca de PECs
        </h1>

        <PecFilters
          busca={busca}
          setBusca={setBusca}
          ano={ano}
          setAno={setAno}
          anos={anos}
        />

        <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
          {pecsFiltradas.length} PECs encontradas
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20 flex-1">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-brandAccent"></div>
            <p className="ml-3 text-xl font-medium text-gray-500 dark:text-gray-400">
              Carregando...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pecsFiltradas.map((pec) => (
              <CardPec key={pec.id} pec={pec} onClick={handleAbrirVotos} />
            ))}
          </div>
        )}

        {!loading && pecsFiltradas.length === 0 && !error && (
          <div className="text-center py-20 flex-1">
            <p className="text-gray-500 dark:text-gray-400 text-lg italic">
              Nenhuma PEC encontrada com esses filtros.
            </p>
          </div>
        )}
      </main>

      {pecSelecionada && (
        <PecVotesModal
          pec={pecSelecionada}
          votos={votos}
          loadingVotos={loadingVotos}
          errorVotos={errorVotos}
          onClose={handleFecharModal}
          onAbrirPolitico={handleAbrirPolitico}
        />
      )}

      {politicoSelecionado && (
        <DeputadoModal
          politico={politicoSelecionado}
          isOpen={isPoliticoModalOpen}
          onClose={() => setIsPoliticoModalOpen(false)}
        />
      )}
    </div>
  );
}
