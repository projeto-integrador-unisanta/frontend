import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type Props = {
  data: { name: string; value: number }[];
};

const COLORS: Record<string, string> = {
  'Extrema Esquerda': '#7f1d1d',
  Esquerda: '#ef4444',
  Centro: '#6b7280',
  Direita: '#3b82f6',
  'Extrema Direita': '#1e3a8a',
};

export function IdeologiaDistribuicao({ data }: Props) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full h-60">
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ left: 20, right: 20 }}
        >
          <XAxis type="number" domain={[0, 100]} />

          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            formatter={(v: any) => {
              const val = Array.isArray(v) ? v[1] : v;
              const numericValue = Number(val);
              return !isNaN(numericValue)
                ? `${numericValue.toFixed(1)}%`
                : '0.0%';
            }}
          />

          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[entry.name]}
                opacity={entry.value === max ? 1 : 0.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
