import { useEffect, useState } from 'react';
import { estadosService } from '../services/estadosService';
import { type Estado } from '../models/estado';

export function CardEstado() {
  const [estados, setEstados] = useState<Estado[]>([]);

  useEffect(() => {
    estadosService
      .listarEstados()
      .then((data) => setEstados(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {estados.map((e) => (
        <p key={e.id}>
          {e.nome} - {e.sigla}
        </p>
      ))}
    </div>
  );
}
