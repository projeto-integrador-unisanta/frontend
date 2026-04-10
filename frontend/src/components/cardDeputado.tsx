import { type Deputado } from '../models/deputado';
import { useNavigate } from 'react-router-dom';

interface Props {
  Deputado: Deputado;
}

export function CardDeputado({ Deputado }: Props) {
  const navigate = useNavigate();
  const handleNavegar = () => {
    navigate('/dashboard', { state: Deputado });
  };

  return (
    <>
      <div
        onClick={() => handleNavegar()}
        className="bg-white dark:bg-[#001529] border border-gray-200 dark:border-white/10 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
      >
        {Deputado.fotoUrl && (
          <img
            src={Deputado.fotoUrl}
            alt={Deputado.nomeUrna ?? 'foto'}
            className="w-full rounded-lg aspect-[3/4] object-cover mb-4 grayscale-[20%] dark:grayscale-0"
          />
        )}

        <h2
          className="text-lg font-bold text-[#002B5B] dark:text-white truncate uppercase tracking-tight"
          title={Deputado.nomeUrna}
        >
          {Deputado.nomeUrna ?? 'Nome não informado'}
        </h2>

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2 font-medium uppercase tracking-wider">
          <p>
            <span className="text-gray-400 dark:text-gray-500 font-bold">
              Estado:
            </span>{' '}
            {Deputado.estado ?? '-'}
          </p>

          <p>
            <span className="text-gray-400 dark:text-gray-500 font-bold">
              Partido:
            </span>{' '}
            {Deputado.partido ?? '-'}
          </p>
        </div>
      </div>
    </>
  );
}
