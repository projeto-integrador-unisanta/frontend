import { useNavigate, Link } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const navItems = [
    { label: 'INÍCIO', path: '/' },
    { label: 'POLÍTICOS', path: '/politicos' },
    { label: 'PECS', path: '/pecs' },
    {label: 'MatchEleitoral', path: '/fit'}
  ];

  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#002B5B] text-white">
      {/* LOGO */}
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          {/* Ícone de prédio governamental estilizado (SVG) */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-[#002B5B]"
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
            className="text-white hover:text-amber-400 transition-colors uppercase tracking-tight"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* AÇÕES À DIREITA */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs font-semibold uppercase">
            Acesso Restrito
          </span>
        </div>
        <svg
          className="w-5 h-5 cursor-pointer hover:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {/* Bandeira do Brasil estilizada */}
        <div className="flex flex-col gap-0.5 w-6">
          <div className="h-1 bg-green-600 rounded-sm"></div>
          <div className="h-1 bg-yellow-400"></div>
          <div className="h-1 bg-blue-700 rounded-sm"></div>
        </div>
      </div>
    </header>
  );
}
