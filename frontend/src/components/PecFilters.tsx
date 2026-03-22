interface PecFiltersProps {
  busca: string;
  setBusca: (value: string) => void;
  ano: string;
  setAno: (value: string) => void;
  anos: number[];
}

export function PecFilters({ busca, setBusca, ano, setAno, anos }: PecFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        placeholder="Buscar por número, assunto ou nome popular da PEC..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="flex-1 border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <select
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        className="md:w-48 border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
      >
        <option value="">Todos os anos</option>
        {anos.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
