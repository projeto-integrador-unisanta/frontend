import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

export function PieVotos({
  data,
  height = 200,
  innerRadius = 65,
  outerRadius = 90,
}: {
  data: any;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}) {
  const COLORS = {
    Sim: '#22c55e',
    Nao: '#ef4444',
  };

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center text-gray-400 text-xs italic" style={{ height }}>Sem dados</div>;
  }

  const simData = data.find((d: any) => d.name === 'Sim');
  const percentSim = simData ? simData.percent : 0;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
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

        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            backgroundColor: '#ffffff',
            color: '#111827',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          itemStyle={{ fontWeight: 'bold' }}
          wrapperStyle={{ outline: 'none', zIndex: 1000 }}
        />

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-900 dark:fill-white font-bold text-sm"
        >
          {`${(percentSim || 0).toFixed(0)}% Sim`}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
