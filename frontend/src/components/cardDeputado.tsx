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

                {/* SEÇÃO DE VOTOS COM SCROLL INTERNO */}
                <div className="flex flex-col gap-2 mt-4">
                  <strong className="text-sm border-b pb-1 border-gray-100">
                    Votos Recentes:
                  </strong>

                  {/* Container com scroll controlado */}
                  <div
                    className="space-y-3 max-h-[200px] overflow-y-auto pr-1 
                    [&::-webkit-scrollbar]:w-1 
                    [&::-webkit-scrollbar-track]:bg-transparent 
                    [&::-webkit-scrollbar-thumb]:bg-gray-300 
                    [&::-webkit-scrollbar-thumb]:rounded-full"
                  >
                    {Deputado.votos_recentes.map((v, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 shadow-sm"
                      >
                        {/* PEC - Linha de cima */}
                        <p className="text-[11px] font-bold text-gray-700 mb-2 leading-tight uppercase">
                          {v.pec}
                        </p>

                        {/* Voto e Data - Mesma linha embaixo */}
                        <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                          <span
                            className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${
                              v.voto === 'Sim'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            Voto: {v.voto}
                          </span>

                          <span className="text-[12x] text-gray-400 font-medium">
                            {v.data}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
