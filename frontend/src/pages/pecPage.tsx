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
    limparVotos 
  } = usePecVotos();

  const [searchParams] = useSearchParams();
  const [busca, setBusca] = useState('');
  const [ano, setAno] = useState('');

  // Estados para o Modal de Votos
  const [pecSelecionada, setPecSelecionada] = useState<PEC | null>(null);

  // Estado para o Modal do Político
  const [politicoSelecionado, setPoliticoSelecionado] = useState<Deputado | null>(null);
  const [isPoliticoModalOpen, setIsPoliticoModalOpen] = useState(false);

  const handleAbrirVotos = (pec: PEC) => {
    setPecSelecionada(pec);
    carregarVotos(pec.numero, pec.ano);
  };

  const handleAbrirPolitico = (nome: string) => {
    const deputado = deputados.find(d => d.nomeUrna.toLowerCase() === nome.toLowerCase());
    if (deputado) {
      setPoliticoSelecionado(deputado);
      setIsPoliticoModalOpen(true);
    }
  };

  useEffect(() => {
    const buscaParam = searchParams.get('busca');
    if (buscaParam) {
      setBusca(buscaParam);
      
      // Se as PECs já foram carregadas, tenta encontrar a correspondência exata para abrir o modal
      if (pecs.length > 0) {
        const pecEncontrada = pecs.find(pec => {
          const identificacao = `${pec.siglaTipo} ${pec.numero}/${pec.ano}`.toLowerCase();
          return identificacao === buscaParam.toLowerCase() || 
                 (pec.nome_popular && pec.nome_popular.toLowerCase() === buscaParam.toLowerCase());
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
      const identificacao = `${pec.siglaTipo} ${pec.numero}/${pec.ano}`.toLowerCase();
      const matchBusca =
        pec.ementa.toLowerCase().includes(buscaLower) ||
        pec.numero.toString().includes(buscaLower) ||
        pec.siglaTipo.toLowerCase().includes(buscaLower) ||
        (pec.nome_popular && pec.nome_popular.toLowerCase().includes(buscaLower)) ||
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="max-w-6xl mx-auto flex flex-col p-10 flex-1">
        <h1 className="text-3xl font-bold mb-6">Busca de PECs</h1>

        <PecFilters 
          busca={busca} 
          setBusca={setBusca} 
          ano={ano} 
          setAno={setAno} 
          anos={anos} 
        />

        <p className="text-gray-600 mb-6">
          {pecsFiltradas.length} PECs encontradas
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl font-medium text-gray-500">Carregando...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
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
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Nenhuma PEC encontrada com esses filtros.
            </p>
          </div>
        )}
      </main>

      {/* Modal de Votos */}
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

      {/* Modal do Político */}
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
