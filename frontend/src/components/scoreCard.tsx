type Props = {
  score: number;
  classificacao: string;
};

export function ScoreCard({ score, classificacao }: Props) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-r-2xl shadow">
      <h2 className="text-lg opacity-80">Ideologia</h2>

      <p className="text-4xl font-bold">{score.toFixed(1)}</p>

      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
        {classificacao}
      </span>
    </div>
  );
}
