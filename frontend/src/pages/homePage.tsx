import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useDeputados } from '../hooks/useDeputados';
import { CardPoliticoPrincipal } from '../components/CardPoliticoPrincipal';

export function HomePage() {
  const navigate = useNavigate();
  const { deputados, loading } = useDeputados('');

  // Seleciona os 3 com mais votos em PECs para mostrar na home
  const principaisPoliticos = [...deputados]
    .sort((a, b) => (b.votos_recentes?.length || 0) - (a.votos_recentes?.length || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#002B5B] dark:bg-[#001529] flex flex-col text-white transition-colors duration-300">
      <Header />

      {/* 3. SEÇÃO HERO (PRINCIPAL) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center max-w-4xl mb-12 tracking-tight leading-tight">
          ACOMPANHE O TRABALHO
          <br />
          DE SEUS POLÍTICOS
        </h1>

        {/* Indicador visual inferior */}
        <div className="text-white/40 text-xs font-medium tracking-widest uppercase flex flex-col items-center gap-4 mb-12 md:mb-20">
          Transparência e Participação Cidadã
          <div className="w-px h-12 bg-white/20"></div>
        </div>

        {/* SEÇÃO PRINCIPAIS POLÍTICOS */}
        <section className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Principais Políticos</h2>
              <p className="text-white/60 font-medium">Dados atualizados das últimas votações</p>
            </div>
            <button 
              onClick={() => navigate('/politicos')}
              className="hidden sm:block bg-white/10 hover:bg-white/20 dark:hover:bg-brandAccent/20 text-white dark:hover:text-brandAccent font-bold py-2 px-6 rounded-full transition-colors text-sm uppercase tracking-wider border border-white/20 dark:border-white/10"
            >
              Ver todos
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white dark:border-brandAccent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principaisPoliticos.map((politico) => (
                <CardPoliticoPrincipal key={politico.id} politico={politico} />
              ))}
            </div>
          )}

          <div className="mt-12 sm:hidden flex justify-center">
            <button 
              onClick={() => navigate('/politicos')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-10 rounded-xl transition-colors text-sm uppercase tracking-wider border border-white/20 w-full"
            >
              Ver todos os políticos
            </button>
          </div>
        </section>
      </main>
      
      {/* Footer simples para fechar o layout */}
      <footer className="py-10 border-t border-white/10 text-center text-white/40 text-sm font-medium">
        © 2026 FISCALIZA BRAZIL - Transparência Pública
      </footer>
    </div>
  );
}
