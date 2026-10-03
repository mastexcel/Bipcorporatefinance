/**
 * Éléments d'atmosphère : purement décoratifs (aria-hidden), sans JavaScript.
 * Le pont est la signature visuelle de Bridge Investment Partners : il relie
 * le dirigeant cédant et son repreneur, le passé et l'avenir de l'entreprise.
 */

/** Silhouette de pont suspendu en traits fins, tracée au chargement. */
export function ArcsPont({ className = "", clair = true }: { className?: string; clair?: boolean }) {
  const trait = clair ? "rgb(255 255 255 / 0.14)" : "rgb(58 58 58 / 0.16)";
  // Suspentes verticales entre le tablier et le grand arc (arc : y = 140 + 240·u²).
  const suspentes = Array.from({ length: 33 }, (_, i) => {
    const x = 160 + i * 40;
    const u = (x - 800) / 700;
    return `M${x} ${(140 + 240 * u * u).toFixed(1)} V384`;
  }).join(" ");
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 400"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      className={`trace-pont pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="pont-degrade" x1="0" x2="1">
          <stop offset="0" stopColor="#d7261e" />
          <stop offset="0.6" stopColor="#f26522" />
          <stop offset="1" stopColor="#e3a84e" />
        </linearGradient>
      </defs>
      {/* Grand arc principal */}
      <path pathLength={1} d="M100 380 Q800 -100 1500 380" stroke="url(#pont-degrade)" strokeOpacity="0.65" strokeWidth="2" />
      {/* Arcs secondaires, en écho */}
      <path pathLength={1} d="M220 384 Q800 40 1380 384" stroke={trait} strokeWidth="1" />
      <path pathLength={1} d="M340 384 Q800 160 1260 384" stroke={trait} strokeWidth="1" />
      {/* Tablier */}
      <path pathLength={1} d="M0 384 H1600" stroke={trait} strokeWidth="1.5" />
      <path pathLength={1} d="M0 394 H1600" stroke={trait} strokeWidth="0.8" />
      {/* Suspentes */}
      <path pathLength={1} d={suspentes} stroke={trait} strokeWidth="0.7" />
    </svg>
  );
}

/** Halos colorés qui dérivent lentement derrière le contenu. */
export function Aurores({ variante = "nuit" }: { variante?: "nuit" | "clair" }) {
  const o = variante === "nuit" ? 1 : 0.45;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span
        className="aurore -top-40 -left-32 h-[34rem] w-[34rem]"
        style={{ background: `radial-gradient(closest-side, rgb(215 38 30 / ${0.45 * o}), transparent)` }}
      />
      <span
        className="aurore top-1/3 -right-40 h-[30rem] w-[30rem]"
        style={{ background: `radial-gradient(closest-side, rgb(242 101 34 / ${0.35 * o}), transparent)`, animationDelay: "-8s" }}
      />
      <span
        className="aurore -bottom-48 left-1/4 h-[28rem] w-[28rem]"
        style={{ background: `radial-gradient(closest-side, rgb(15 107 107 / ${0.4 * o}), transparent)`, animationDelay: "-14s" }}
      />
    </div>
  );
}
