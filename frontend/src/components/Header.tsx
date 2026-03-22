import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'INÍCIO', path: '/' },
    { label: 'POLÍTICOS', path: '/politicos' },
    { label: 'PECS', path: '/pecs' },
    { label: 'MatchEleitoral', path: '/fit' }
  ];

  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#002B5B] dark:bg-[#001529] text-white transition-colors duration-300">
      {/* LOGO */}
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 bg-white dark:bg-brandAccent rounded-full flex items-center justify-center transition-colors">
          {/* Ícone de prédio governamental estilizado (SVG) */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-[#002B5B] dark:text-gray-900"
          >
            <path
              d="M4 22V10M20 22V10M2 10L12 2L22 10M12 22V15M9 22V15M15 22V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="font-bold text-lg tracking-wider">
          FISCALIZA BRAZIL
        </span>
      </div>

      {/* MENU DE NAVEGAÇÃO */}
      <nav className="hidden md:flex gap-8 font-medium text-sm">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="text-white hover:text-amber-400 dark:hover:text-brandAccent transition-colors uppercase tracking-tight"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      
      {/* BOTÃO DE MODO ESCURO (SWITCH GRANDE) */}
      <div className="flex items-center justify-end w-[180px]">
        <button
          onClick={toggleTheme}
          className="relative inline-flex h-9 w-20 items-center rounded-full transition-all focus:outline-none bg-black/20 dark:bg-white/10 border-2 border-white/10 group overflow-hidden"
          aria-label="Toggle Theme"
        >
          {/* Ícones de fundo (dentro da barra) */}
          <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
            <svg className="w-4 h-4 text-brandAccent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>

          {/* Knob/Circle que desliza */}
          <span
            className={`${
              theme === 'dark' ? 'translate-x-11 bg-[#001529]' : 'translate-x-1 bg-white'
            } relative z-10 inline-flex h-7 w-7 items-center justify-center transform rounded-full transition-all duration-300 ease-in-out shadow-lg`}
          >
            {/* Ícone dentro do Knob (opcional, para reforçar o estado atual) */}
            {theme === 'light' ? (
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-brandAccent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </header>
  );
}
