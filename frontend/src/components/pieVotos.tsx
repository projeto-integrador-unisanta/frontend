import { PieChart, Pie, Tooltip, Cell } from 'recharts';

export function PieVotos({ data }: any) {
  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        innerRadius={70}
        outerRadius={100}
        dataKey="value"
        paddingAngle={3}
      >
        {data.map((entry: any, index: number) => (
          <Cell
            key={index}
            fill={entry.name === 'Sim' ? '#22c55e' : '#ef4444'}
          />
        ))}
      </Pie>

      <Tooltip />

      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        {`${data[0].percent.toFixed(0)}% Sim`}
      </text>
    </PieChart>
  );
}
