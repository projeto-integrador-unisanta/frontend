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
      {/* ESPAÇADOR PARA MANTER O MENU CENTRALIZADO */}
      <div className="w-[180px] hidden md:block"></div>
    </header>
  );
}
