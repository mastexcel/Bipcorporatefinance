"use client";

import { classeChamp, MessageErreur } from "./Champs";
import { lireMontant, separerMilliers } from "@/lib/valuation/format";

/**
 * Saisie d'un montant avec séparateurs de milliers automatiques
 * (« 150000000 » devient « 150 000 000 » pendant la frappe).
 */
export function formaterSaisie(brut: string, negatifAutorise: boolean): string {
  const nettoye = brut.replace(/[^\d\-−]/g, "").replace(/−/g, "-");
  const negatif = negatifAutorise && nettoye.startsWith("-");
  const chiffres = nettoye.replace(/-/g, "").replace(/^0+(?=\d)/, "").slice(0, 16);
  if (!chiffres) return negatif ? "-" : "";
  return (negatif ? "-" : "") + separerMilliers(Number(chiffres)).replace("−", "");
}

export function ChampMontant({
  id,
  label,
  valeur,
  onChange,
  erreur,
  aide,
  obligatoire = false,
  negatifAutorise = false,
  devise = "FCFA",
}: {
  id: string;
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  erreur?: string;
  aide?: string;
  obligatoire?: boolean;
  negatifAutorise?: boolean;
  devise?: string;
}) {
  const describedBy = [erreur ? `${id}-erreur` : null, aide ? `${id}-aide` : null].filter(Boolean).join(" ") || undefined;
  const montant = lireMontant(valeur);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold text-anthracite">
        {label}
        {obligatoire ? <span className="text-rouge" aria-hidden="true"> *</span> : <span className="font-normal text-gris"> (facultatif)</span>}
      </label>
      {aide && <p id={`${id}-aide`} className="mb-1.5 text-base text-gris">{aide}</p>}
      <div className="relative">
        <input
          id={id}
          name={id}
          type="text"
          inputMode={negatifAutorise ? "text" : "numeric"}
          autoComplete="off"
          value={valeur}
          onChange={(e) => onChange(formaterSaisie(e.target.value, negatifAutorise))}
          required={obligatoire}
          aria-invalid={erreur ? true : undefined}
          aria-describedby={describedBy}
          className={`${classeChamp} pr-16 text-right tabular-nums ${erreur ? "border-rouge" : "border-[#b8b8bd]"}`}
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-base text-gris">
          {devise}
        </span>
      </div>
      {montant !== null && Math.abs(montant) >= 1e6 && (
        <p className="mt-1 text-sm text-gris" aria-hidden="true">≈ {separerMilliers(Math.round(montant / 1e6))} millions</p>
      )}
      <MessageErreur id={`${id}-erreur`} erreur={erreur} />
    </div>
  );
}
