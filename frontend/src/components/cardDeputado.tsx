import { useState } from 'react';
import { type Deputado } from '../models/deputado';
import { DeputadoModal } from './DeputadoModal';

interface Props {
  Deputado: Deputado;
}

export function CardDeputado({ Deputado }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setOpen(true)}
        className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
      >
        {Deputado.fotoUrl && (
          <img
            src={Deputado.fotoUrl}
            alt={Deputado.nomeUrna ?? 'foto'}
            className="w-full rounded-lg aspect-[3/4] object-cover mb-4"
          />
        )}

        <h2
          className="text-lg font-bold text-[#002B5B] truncate uppercase tracking-tight"
          title={Deputado.nomeUrna}
        >
          {Deputado.nomeUrna ?? 'Nome não informado'}
        </h2>

        <div className="text-xs text-gray-500 space-y-1 mt-2 font-medium uppercase tracking-wider">
          <p>
            <span className="text-gray-400 font-bold">Estado:</span> {Deputado.estado ?? '-'}
          </p>

          <p>
            <span className="text-gray-400 font-bold">Partido:</span> {Deputado.partido ?? '-'}
          </p>
        </div>
      </div>

      {/* MODAL UNIFICADO */}
      <DeputadoModal 
        politico={Deputado} 
        isOpen={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
}
