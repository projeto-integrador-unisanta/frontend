import { type Deputado } from '../models/deputado';

interface Props {
  Deputado: Deputado;
}

export function CardDeputado({ Deputado }: Props) {
  return (
    <div className="border border-solid border-gray-300 p-4 rounded-lg w-50 shadow-sm hover:shadow-md transition-shadow">
      {Deputado.fotoUrl && (
        <img
          src={Deputado.fotoUrl}
          alt={Deputado.nomeUrna ?? 'foto'}
          className="w-full rounded-md aspect-[3/4] object-cover"
        />
      )}

      {/* Nome menor (text-lg) e com margem superior */}
      <h2
        className="text-lg font-bold mt-2 mb-1 truncate"
        title={Deputado.nomeUrna}
      >
        {Deputado.nomeUrna ?? 'Nome não informado'}
      </h2>

      {/* Textos menores (text-sm) para caber no card reduzido */}
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <strong className="font-semibold">Estado:</strong>{' '}
          {Deputado.estado ?? '-'}
        </p>

        <p>
          <strong className="font-semibold">Partido:</strong>{' '}
          {Deputado.partido ?? '-'}
        </p>

        <p className="truncate" title={Deputado.email}>
          <strong className="font-semibold">Email:</strong>{' '}
          {Deputado.email ?? 'N/A'}
        </p>
      </div>
    </div>
  );
}
