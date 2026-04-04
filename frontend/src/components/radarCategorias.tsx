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
    <div className="w-full h-full">
      {' '}
      {/* Garanta que o pai defina a altura, ex: h-80 */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          outerRadius="80%"
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <PolarGrid stroke="#e5e7eb" />

          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />

          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />

          <Radar
            name="Nota"
            dataKey="nota"
            stroke="#6366f1"
            fill="url(#colorGradient)"
            fillOpacity={0.8}
          />

          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
