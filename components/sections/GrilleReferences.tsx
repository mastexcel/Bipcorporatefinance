"use client";

import { useMemo, useState } from "react";
import { TYPES_OPERATION, type Reference, type TypeOperation } from "@/config/references";
import { Tombstone, TombstoneVide } from "./Tombstone";

/** Grille de tombstones filtrable par type d'opération et par secteur. */
export function GrilleReferences({ references }: { references: Reference[] }) {
  const [type, setType] = useState<TypeOperation | "">("");
  const [secteur, setSecteur] = useState("");

  const secteurs = useMemo(() => [...new Set(references.map((r) => r.secteur))].sort(), [references]);
  const filtrees = references.filter((r) => (!type || r.typeOperation === type) && (!secteur || r.secteur === secteur));

  if (references.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <TombstoneVide key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-base font-semibold">
          Type d&apos;opération
          <select value={type} onChange={(e) => setType(e.target.value as TypeOperation | "")} className="min-h-12 rounded-md border border-bordure bg-white px-3 font-normal">
            <option value="">Tous</option>
            {Object.entries(TYPES_OPERATION).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-base font-semibold">
          Secteur
          <select value={secteur} onChange={(e) => setSecteur(e.target.value)} className="min-h-12 rounded-md border border-bordure bg-white px-3 font-normal">
            <option value="">Tous</option>
            {secteurs.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="sr-only" aria-live="polite">{filtrees.length} référence(s) affichée(s)</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtrees.map((r) => (
          <Tombstone key={r.id} reference={r} />
        ))}
      </div>
      {filtrees.length === 0 && <p className="text-gris">Aucune référence ne correspond à ces critères.</p>}
    </>
  );
}
