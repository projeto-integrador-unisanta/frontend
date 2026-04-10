import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function RadarCategorias({ data }: any) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <RadarChart
          data={data}
          margin={{ top: 25, right: 50, bottom: 25, left: 50 }}
          outerRadius="60%"
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <PolarGrid stroke="#e5e7eb" strokeOpacity={0.2} />

          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: 'currentColor',
              fontSize: 11,
              fontWeight: 500,
            }}
            className="text-gray-500 dark:text-gray-400"
          />

          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />

          <Radar
            name="Nota"
            dataKey="nota"
            stroke="#6366f1"
            fill="url(#colorGradient)"
            fillOpacity={0.8}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
