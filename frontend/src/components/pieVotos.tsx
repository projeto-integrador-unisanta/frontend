import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

export function PieVotos({ data }: any) {
  const COLORS = {
    Sim: '#22c55e',
    Nao: '#ef4444',
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={65}
          outerRadius={90}
          dataKey="value"
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry: any, index: number) => (
            <Cell
              key={index}
              fill={entry.name === 'Sim' ? COLORS.Sim : COLORS.Nao}
            />
          ))}
        </Pie>

        {/* TOOLTIP CORRIGIDO */}
        <Tooltip
          // O cursor: pointer ajuda a dar feedback visual
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            backgroundColor: '#ffffff', // Fundo branco no modo claro
            color: '#111827', // Texto escuro no modo claro
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          // Seletor para quando o sistema/pai estiver em dark mode
          itemStyle={{ fontWeight: 'bold' }}
          // Esta função garante que o estilo mude dinamicamente se você não quiser usar CSS puro
          wrapperStyle={{ outline: 'none', zIndex: 1000 }}
        />

        {/* Se o Tooltip ainda estiver estranho, use este estilo global ou injetado via Tailwind no Dashboard:
            .recharts-default-tooltip {
              @apply bg-white dark:bg-gray-800 border-none shadow-xl rounded-lg !important;
            }
        */}

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-900 dark:fill-white font-bold text-sm"
        >
          {`${data[0].percent.toFixed(0)}% Sim`}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
