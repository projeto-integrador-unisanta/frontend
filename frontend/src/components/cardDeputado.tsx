import { type Deputado } from '../models/deputado';

interface Props {
  Deputado: Deputado;
}

export function CardDeputado({ Deputado }: Props) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '16px',
        borderRadius: '8px',
        width: '300px',
      }}
    >
      {Deputado.fotoUrl && (
        <img
          src={Deputado.fotoUrl}
          alt={Deputado.nomeCompleto ?? 'foto'}
          style={{ width: '100%', borderRadius: '8px' }}
        />
      )}

      <h2>{Deputado.nomeCompleto ?? 'Nome não informado'}</h2>

      <p>
        <strong>Cargo:</strong> {Deputado.cargo ?? 'Não informado'}
      </p>

      <p>
        <strong>Email:</strong> {Deputado.email ?? 'Não informado'}
      </p>

      <p>
        <strong>Estado ID:</strong> {Deputado.estadoId ?? '-'}
      </p>

      <p>
        <strong>Partido ID:</strong> {Deputado.partidoId ?? '-'}
      </p>

      <p>
        <strong>Ativo:</strong>{' '}
        {Deputado.ativo === null
          ? 'Não informado'
          : Deputado.ativo
            ? 'Sim'
            : 'Não'}
      </p>
    </div>
  );
}
