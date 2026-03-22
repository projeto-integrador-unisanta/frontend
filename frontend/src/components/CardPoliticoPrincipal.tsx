import { useState } from 'react';
import { type Deputado } from '../models/deputado';
import { DeputadoModal } from './DeputadoModal';

interface CardPoliticoPrincipalProps {
  politico: Deputado;
}

export function CardPoliticoPrincipal({ politico }: CardPoliticoPrincipalProps) {
  const [open, setOpen] = useState(false);
  const votos = politico.votos_recentes || [];
  const totalPecs = votos.length;
  
  const simVotos = votos.filter(v => v.voto === 'Sim').length;
  const naoVotos = votos.filter(v => v.voto === 'Não').length;
  
  const percentSim = totalPecs > 0 ? Math.round((simVotos / totalPecs) * 100) : 0;
  const percentNao = totalPecs > 0 ? Math.round((naoVotos / totalPecs) * 100) : 0;

  return (
    <>
      <div className="bg-white dark:bg-[#001529] rounded-2xl shadow-xl p-6 flex flex-col gap-4 text-[#002B5B] dark:text-white transform hover:scale-105 transition-all border border-transparent dark:border-white/5">
        <div className="flex items-center gap-4">
          <img 
            src={politico.fotoUrl} 
            alt={politico.nomeUrna} 
            className="w-20 h-20 rounded-full object-cover object-top border-2 border-blue-100 dark:border-white/10 shadow-sm"
          />
          <div>
            <h3 className="font-bold text-xl uppercase leading-tight dark:text-white">{politico.nomeUrna}</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{politico.partido} - {politico.estado}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-white/5 pt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total de PECs Votadas</span>
            <span className="font-black text-lg dark:text-brandAccent">{totalPecs}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase">Sim</span>
                <span className="text-sm font-black text-green-600 dark:text-green-400">{percentSim}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#001b3d] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
                  style={{ width: `${percentSim}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase">Não</span>
                <span className="text-sm font-black text-red-600 dark:text-red-400">{percentNao}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#001b3d] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                  style={{ width: `${percentNao}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setOpen(true)}
            className="mt-2 w-full bg-[#002B5B] dark:bg-brandAccent hover:bg-[#003d82] dark:hover:bg-yellow-500 text-white dark:text-gray-900 font-bold py-3 rounded-xl transition-colors uppercase text-xs tracking-widest shadow-lg dark:shadow-yellow-500/10"
          >
            Ver detalhes
          </button>
        </div>
      </div>

      <DeputadoModal 
        politico={politico} 
        isOpen={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
}
