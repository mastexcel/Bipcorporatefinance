import type { Mission } from "@/content/groupe";
import { partenaires } from "@/content/groupe";

/** Grille des missions de conseil de référence (ce ne sont pas des opérations de M&A). */
export function GrilleMissions({ missions }: { missions: Mission[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {missions.map((m) => (
        <li key={m.client} className="flex gap-4 rounded-lg border border-bordure bg-white p-5 shadow-sm">
          <span aria-hidden="true" className="degrade-bip mt-1 h-10 w-1 shrink-0 rounded-full" />
          <div>
            <p className="font-titre font-semibold text-anthracite">{m.client}</p>
            <p className="mt-1 text-base text-gris">{m.mission}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Liste des partenaires, bailleurs et clients (texte, sans logos). */
export function ListePartenaires() {
  return (
    <ul className="flex flex-wrap gap-3">
      {partenaires.map((p) => (
        <li key={p} className="rounded-full border border-bordure bg-white px-4 py-2 text-base text-anthracite">
          {p}
        </li>
      ))}
    </ul>
  );
}
