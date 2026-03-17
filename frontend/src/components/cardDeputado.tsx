import { useState } from 'react';
import { type Deputado } from '../models/deputado';

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
        className="border border-solid border-gray-300 p-4 rounded-lg w-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        {Deputado.fotoUrl && (
          <img
            src={Deputado.fotoUrl}
            alt={Deputado.nomeUrna ?? 'foto'}
            className="w-full rounded-md aspect-[3/4] object-cover"
          />
        )}

        <h2
          className="text-lg font-bold mt-2 mb-1 truncate"
          title={Deputado.nomeUrna}
        >
          {Deputado.nomeUrna ?? 'Nome não informado'}
        </h2>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Estado:</strong> {Deputado.estado ?? '-'}
          </p>

          <p>
            <strong>Partido:</strong> {Deputado.partido ?? '-'}
          </p>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[500px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-[160px_1fr] gap-6 items-start">
              {/* CAIXA DESTACADA */}
              <div className="bg-gray-200 border border-gray-400 rounded-xl shadow-md p-2 text-center">
                <h2 className="text-lg font-bold mb-3">{Deputado.nomeUrna}</h2>

                {Deputado.fotoUrl && (
                  <img
                    src={Deputado.fotoUrl}
                    alt={Deputado.nomeUrna ?? 'foto'}
                    className="w-32 mx-auto rounded-md object-cover"
                  />
                )}
              </div>

              {/* INFORMAÇÕES */}
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Estado:</strong> {Deputado.estado ?? '-'}
                </p>

                <p>
                  <strong>Partido:</strong> {Deputado.partido ?? '-'}
                </p>

                <p>
                  <strong>Email:</strong> {Deputado.email ?? 'N/A'}
                </p>
              </div>
            </div>

            <button
              className="mt-6 w-full bg-gray-800 text-white py-2 rounded"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
