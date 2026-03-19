import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#002B5B] flex flex-col text-white">
      <Header />

      {/* 3. SEÇÃO HERO (PRINCIPAL) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center max-w-4xl mb-12 tracking-tight leading-tight">
          ACOMPANHE O TRABALHO
          <br />
          DE SEUS POLÍTICOS
        </h1>

        {/* Indicador visual inferior */}
        <div className="mt-20 text-white/40 text-xs font-medium tracking-widest uppercase flex flex-col items-center gap-4">
          Transparência e Participação Cidadã
          <div className="w-px h-12 bg-white/20"></div>
        </div>
      </main>
    </div>
  );
}
