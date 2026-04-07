import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function BarCategorias({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 70 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f3f4f6"
        />

        <XAxis
          dataKey="subject"
          interval={0}
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />

        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          cursor={{ fill: '#f3f4f6' }}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />

        <Bar dataKey="nota" radius={[6, 6, 0, 0]} fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  );
}
