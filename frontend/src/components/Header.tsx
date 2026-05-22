import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Políticos', path: '/politicos' },
    { label: 'PECs', path: '/pecs' },
    { label: 'Match Eleitoral', path: '/fit' },
    { label: 'Espectro', path: '/espectro' },
    { label: 'Metodologia', path: '/metodologia' },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#002B5B]/90 dark:bg-[#001529]/90 backdrop-blur-md text-white transition-all duration-300">
      {/* LOGO COM EFEITO GLOW */}
      <div
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-blue-500/20">
          <img
            src="/logo-agora-sem-texto.png"
            alt="Ágora ícone"
            className="w-11 h-11 object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-wide leading-none">
            Ágora
          </span>
          <span className="text-[11px] font-bold tracking-[0.3em] text-blue-300 dark:text-brandAccent uppercase mt-0.5">
            Brasil
          </span>
        </div>
      </div>

      {/* MENU DE NAVEGAÇÃO COM UNDERLINE ANIMADO */}
      <nav className="hidden md:flex gap-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative py-1 text-xs font-black uppercase tracking-widest transition-all no-underline duration-300 group ${
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {item.label}
              {/* Linha indicadora */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-blue-400 dark:bg-brandAccent transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* BOTÃO DE MODO ESCURO REFINADO */}
      <div className="flex items-center justify-end">
        <button
          onClick={toggleTheme}
          className="relative inline-flex h-8 w-16 items-center rounded-full transition-all bg-black/30 dark:bg-white/5 border border-white/10 p-1 group overflow-hidden"
          aria-label="Toggle Theme"
        >
          {/* Knob que desliza */}
          <div
            className={`flex h-6 w-6 items-center justify-center transform rounded-full transition-all duration-500 ease-spring shadow-md ${
              theme === 'dark'
                ? 'translate-x-8 bg-blue-600 rotate-[360deg]'
                : 'translate-x-0 bg-amber-400 rotate-0'
            }`}
          >
            {theme === 'light' ? (
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
