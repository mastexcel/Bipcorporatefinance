import type { ScoreBloc } from "@/lib/readiness/score";

/**
 * Graphique radar des 5 blocs du score de préparation (une seule série :
 * pas de légende). Tableau équivalent fourni à côté par la page.
 */
export function Radar({ blocs }: { blocs: ScoreBloc[] }) {
  const taille = 320;
  const centre = taille / 2;
  const rayon = 110;
  const n = blocs.length;
  const angle = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const point = (i: number, r: number) => [centre + r * Math.cos(angle(i)), centre + r * Math.sin(angle(i))] as const;
  const polygone = (f: (i: number) => number) => blocs.map((_, i) => point(i, f(i)).join(",")).join(" ");

  return (
    <svg viewBox={`-60 -10 ${taille + 120} ${taille + 20}`} className="h-auto w-full max-w-md" role="img" aria-label={`Score par bloc : ${blocs.map((b) => `${b.libelle} ${b.points} sur ${b.pointsMax}`).join(", ")}`}>
      {/* Grille recessive */}
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={polygone(() => rayon * k)} fill="none" stroke="#e4e4e7" strokeWidth="1" />
      ))}
      {blocs.map((_, i) => {
        const [x, y] = point(i, rayon);
        return <line key={i} x1={centre} y1={centre} x2={x} y2={y} stroke="#e4e4e7" strokeWidth="1" />;
      })}
      {/* Série */}
      <polygon points={polygone((i) => rayon * ((blocs[i]?.points ?? 0) / (blocs[i]?.pointsMax || 1)))} fill="#d7261e" fillOpacity="0.1" stroke="#d7261e" strokeWidth="2" strokeLinejoin="round" />
      {blocs.map((b, i) => {
        const [x, y] = point(i, rayon * (b.points / (b.pointsMax || 1)));
        return (
          <circle key={b.id} cx={x} cy={y} r="5" fill="#d7261e" stroke="#ffffff" strokeWidth="2">
            <title>{`${b.libelle} : ${b.points} / ${b.pointsMax}`}</title>
          </circle>
        );
      })}
      {/* Libellés (texte en encre neutre) */}
      {blocs.map((b, i) => {
        const [x, y] = point(i, rayon + 22);
        const ancre = Math.abs(x - centre) < 5 ? "middle" : x > centre ? "start" : "end";
        return (
          <text key={b.id} x={x} y={y} textAnchor={ancre} dominantBaseline="middle" fontSize="13" fill="#3a3a3a" fontFamily="var(--font-inter)">
            <tspan x={x} dy="-0.5em">{b.libelle}</tspan>
            <tspan x={x} dy="1.2em" fill="#6b6b6b">{b.points}/{b.pointsMax}</tspan>
          </text>
        );
      })}
    </svg>
  );
}
