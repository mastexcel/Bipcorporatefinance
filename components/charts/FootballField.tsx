"use client";

import type { BarreFootballField } from "@/lib/valuation";
import { formaterFCFA, formaterMillions } from "@/lib/valuation/format";
import { graduations } from "./echelle";

/**
 * Graphique « football field » : fourchette de valeur des titres par méthode
 * (barres horizontales), standard des banques d'affaires.
 * - méthodes : gris neutre ; repères : gris clair ; fourchette retenue : rouge BIP ;
 * - les valeurs sont écrites en texte (jamais dans la couleur des barres) ;
 * - survol/focus : infobulle ; tableau équivalent pour l'accessibilité.
 * Les valeurs négatives sont affichées à 0 (axe partant de 0).
 */
export function FootballField({ barres }: { barres: BarreFootballField[] }) {
  const max = Math.max(...barres.map((b) => b.haut), 1);
  const ticks = graduations(max);
  const echelleMax = ticks.at(-1) ?? max;
  const pct = (v: number) => `${(Math.max(0, v) / echelleMax) * 100}%`;

  return (
    <figure>
      <figcaption className="sr-only">Fourchette de valeur des titres selon chaque méthode, en FCFA</figcaption>
      <div aria-hidden="true" className="space-y-1">
        {/* Axe */}
        <div className="grid grid-cols-[8.5rem_1fr] gap-3 sm:grid-cols-[13rem_1fr]">
          <div />
          <div className="relative mr-14 h-6 text-xs text-gris">
            {ticks.map((t, i) => (
              <span
                key={t}
                className={`absolute -translate-x-1/2 whitespace-nowrap ${i % 2 === 1 && i !== 0 ? "hidden sm:block" : ""}`}
                style={{ left: pct(t), transform: i === 0 ? "none" : i === ticks.length - 1 ? "translateX(-100%)" : undefined }}
              >
                {t === 0 ? "0" : formaterMillions(t).replace(" FCFA", "")}
              </span>
            ))}
          </div>
        </div>
        {barres.map((b) => {
          const point = b.bas === b.haut;
          const couleur = b.retenue ? "bg-rouge" : b.repere ? "bg-[#c9c9ce]" : "bg-[#8e8e94]";
          return (
            <div key={b.id} className="grid grid-cols-[8.5rem_1fr] items-center gap-3 sm:grid-cols-[13rem_1fr]">
              <div className={`text-right text-sm leading-tight sm:text-base ${b.retenue ? "font-semibold text-anthracite" : "text-gris"}`}>{b.libelle}</div>
              <div className="relative mr-14 h-12 border-l border-bordure">
                {/* Quadrillage */}
                {ticks.slice(1).map((t) => (
                  <span key={t} className="absolute inset-y-0 w-px bg-[#efeff1]" style={{ left: pct(t) }} />
                ))}
                <div
                  tabIndex={0}
                  className="group absolute top-1/2 h-5 -translate-y-1/2 rounded outline-none focus-visible:ring-2 focus-visible:ring-anthracite"
                  style={{ left: pct(b.bas), width: point ? "10px" : `max(10px, calc(${pct(b.haut)} - ${pct(b.bas)}))`, marginLeft: point ? "-5px" : 0 }}
                >
                  <span className={`block h-full w-full rounded ${couleur}`} />
                  {/* Infobulle */}
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-md bg-anthracite px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg group-hover:block group-focus-visible:block">
                    <strong className="block">{b.libelle}</strong>
                    {point ? formaterFCFA(b.bas) : `${formaterFCFA(Math.max(0, b.bas))} – ${formaterFCFA(Math.max(0, b.haut))}`}
                  </span>
                </div>
                {/* Étiquettes directes aux extrémités */}
                <span className="absolute top-1/2 -translate-y-1/2 pl-2 text-xs whitespace-nowrap text-anthracite tabular-nums" style={{ left: pct(b.haut) }}>
                  {formaterMillions(Math.max(0, b.haut)).replace(" FCFA", "")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <details className="mt-4 text-base">
        <summary className="cursor-pointer font-semibold text-rouge">Afficher les valeurs sous forme de tableau</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-bordure">
                <th scope="col" className="py-2 pr-3">Méthode</th>
                <th scope="col" className="py-2 pr-3 text-right">Basse</th>
                <th scope="col" className="py-2 pr-3 text-right">Centrale</th>
                <th scope="col" className="py-2 text-right">Haute</th>
              </tr>
            </thead>
            <tbody>
              {barres.map((b) => (
                <tr key={b.id} className="border-b border-bordure">
                  <th scope="row" className="py-2 pr-3 font-normal">{b.libelle}</th>
                  <td className="py-2 pr-3 text-right tabular-nums">{formaterFCFA(b.bas)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{formaterFCFA(b.central)}</td>
                  <td className="py-2 text-right tabular-nums">{formaterFCFA(b.haut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
