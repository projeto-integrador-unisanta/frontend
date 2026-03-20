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
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 text-[#002B5B] transform hover:scale-105 transition-transform">
        <div className="flex items-center gap-4">
          <img 
            src={politico.fotoUrl} 
            alt={politico.nomeUrna} 
            className="w-20 h-20 rounded-full object-cover object-top border-2 border-blue-100 shadow-sm"
          />          <div>
            <h3 className="font-bold text-xl uppercase leading-tight">{politico.nomeUrna}</h3>
            <p className="text-sm font-medium text-gray-500 uppercase">{politico.partido} - {politico.estado}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de PECs Votadas</span>
            <span className="font-black text-lg">{totalPecs}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-green-600 uppercase">Sim</span>
                <span className="text-sm font-black text-green-600">{percentSim}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-500" 
                  style={{ width: `${percentSim}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-red-600 uppercase">Não</span>
                <span className="text-sm font-black text-red-600">{percentNao}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full transition-all duration-500" 
                  style={{ width: `${percentNao}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setOpen(true)}
            className="mt-2 w-full bg-[#002B5B] hover:bg-[#003d82] text-white font-bold py-3 rounded-xl transition-colors uppercase text-xs tracking-widest shadow-lg shadow-blue-900/20"
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
