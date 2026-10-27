import type { Mission } from "@/content/groupe";
import { partenaires } from "@/content/groupe";

/** Grille des missions de conseil de référence (ce ne sont pas des opérations de M&A). */
export function GrilleMissions({ missions }: { missions: Mission[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {missions.map((m) => (
        <li key={m.client} className="carte-vivante revele flex gap-4 rounded-xl border border-bordure bg-white p-5 shadow-sm">
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
export function ListePartenaires({ sombre = false }: { sombre?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-3">
      {partenaires.map((p) => (
        <li
          key={p}
          className={`rounded-full border px-4 py-2 text-base ${sombre ? "border-white/15 bg-white/5 text-white/90" : "border-bordure bg-white text-anthracite"}`}
        >
          {p}
        </li>
      ))}
    </ul>
  );
}

/** Bandeau défilant des partenaires (la seconde copie sert seulement à la boucle visuelle). */
export function BandeauPartenaires({ sombre = false }: { sombre?: boolean }) {
  const pastille = sombre
    ? "border-white/15 bg-white/5 text-white/85"
    : "border-bordure bg-white text-anthracite";
  const piste = (cache: boolean) => (
    <ul aria-hidden={cache || undefined} className="flex shrink-0 gap-4 pr-4">
      {partenaires.map((p) => (
        <li key={p} className={`rounded-full border px-5 py-2.5 font-titre text-base font-semibold whitespace-nowrap ${pastille}`}>
          {p}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="defilement overflow-hidden">
      <div className="defilement-piste">
        {piste(false)}
        {piste(true)}
      </div>
    </div>
  );
}
