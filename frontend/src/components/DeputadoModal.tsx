import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Deputado } from '../models/deputado';

interface DeputadoModalProps {
  politico: Deputado;
  isOpen: boolean;
  onClose: () => void;
}

export function DeputadoModal({ politico, isOpen, onClose }: DeputadoModalProps) {
  const [buscaVoto, setBuscaVoto] = useState('');
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const votos = politico.votos_recentes || [];
  
  // De-duplicação de votos baseada no nome da PEC
  const votosUnicos = Array.from(new Map(votos.map(v => [v.pec, v])).values());

  const votosFiltrados = votosUnicos.filter(v => 
    v.pec.toLowerCase().includes(buscaVoto.toLowerCase())
  );

  const handlePecClick = (pecIdentificacao: string) => {
    onClose();
    navigate(`/pecs?busca=${encodeURIComponent(pecIdentificacao)}`);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#001529] p-6 md:p-8 rounded-2xl w-full max-w-[550px] shadow-2xl relative overflow-hidden text-[#002B5B] dark:text-white transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* CAIXA DESTACADA - Menor e mais compacta */}
          <div className="w-full md:w-40 flex-shrink-0">
            <div className="bg-gray-50 dark:bg-[#001b3d] border border-gray-200 dark:border-white/10 rounded-xl shadow-inner p-3 text-center transition-colors">
              {politico.fotoUrl && (
                <img
                  src={politico.fotoUrl}
                  alt={politico.nomeUrna}
                  className="w-24 h-32 mx-auto rounded-lg object-cover shadow-md mb-3"
                />
              )}
              <h2 className="text-lg font-black uppercase tracking-tight leading-tight">{politico.nomeUrna}</h2>
            </div>
          </div>

          {/* INFORMAÇÕES */}
          <div className="flex-1 space-y-3 w-full">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-[#001b3d] p-2.5 rounded-xl border border-gray-100 dark:border-white/10 transition-colors">
                <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Estado</span>
                <span className="font-bold text-sm dark:text-brandAccent">{politico.estado || '-'}</span>
              </div>
              <div className="bg-gray-50 dark:bg-[#001b3d] p-2.5 rounded-xl border border-gray-100 dark:border-white/10 transition-colors">
                <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Partido</span>
                <span className="font-bold text-sm dark:text-brandAccent">{politico.partido || '-'}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#001b3d] p-2.5 rounded-xl border border-gray-100 dark:border-white/10 transition-colors">
              <span className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">E-mail</span>
              <span className="font-medium text-xs break-all">{politico.email || 'N/A'}</span>
            </div>

            {/* SEÇÃO DE VOTOS */}
            <div className="pt-1">
              <div className="flex items-center justify-between gap-2 mb-2 border-b border-gray-100 dark:border-white/10 pb-1.5 transition-colors">
                <h4 className="text-[10px] font-black uppercase tracking-widest flex-shrink-0">Votos Recentes</h4>
                <input 
                  type="text"
                  placeholder="Filtrar..."
                  value={buscaVoto}
                  onChange={(e) => setBuscaVoto(e.target.value)}
                  className="text-[9px] bg-gray-100 dark:bg-[#001b3d] border-none rounded-lg px-2 py-1 w-24 focus:ring-1 focus:ring-blue-500 outline-none font-bold uppercase dark:text-white transition-colors"
                />
              </div>
              
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1.5 custom-scrollbar">
                {votosFiltrados.length > 0 ? votosFiltrados.map((v, index) => (
                  <button
                    key={index}
                    onClick={() => handlePecClick(v.pec)}
                    className="w-full text-left p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-brandAccent hover:bg-blue-50/50 dark:hover:bg-white/5 transition-all group"
                  >
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase leading-tight group-hover:text-blue-600 dark:group-hover:text-brandAccent transition-colors mb-2">
                      {v.pec}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          v.voto === 'Sim'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}
                      >
                        {v.voto}
                      </span>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold">
                        {v.data}
                      </span>
                    </div>
                  </button>
                )) : (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 italic py-4 text-center">
                    {votos.length > 0 ? 'Sem resultados.' : 'Sem votos.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-6 w-full bg-gray-900 dark:bg-brandAccent hover:bg-black dark:hover:bg-yellow-500 text-white dark:text-gray-900 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors shadow-lg"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
