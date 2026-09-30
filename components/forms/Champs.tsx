"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { INDICATIFS } from "@/lib/schemas/commun";

/* Classes communes : hauteur 48 px minimum (cible tactile), texte 16 px minimum. */
export const classeChamp =
  "block w-full min-h-12 rounded-md border bg-white px-3 py-2 text-base text-anthracite placeholder:text-gris/70 focus:border-rouge focus:outline-none focus:ring-2 focus:ring-rouge/30";
const bordure = (erreur?: string) => (erreur ? "border-rouge" : "border-[#b8b8bd]");

function Libelle({ htmlFor, children, obligatoire }: { htmlFor: string; children: ReactNode; obligatoire?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-semibold text-anthracite">
      {children}
      {obligatoire ? <span className="text-rouge" aria-hidden="true"> *</span> : <span className="font-normal text-gris"> (facultatif)</span>}
    </label>
  );
}

export function MessageErreur({ id, erreur }: { id: string; erreur?: string }) {
  if (!erreur) return null;
  return (
    <p id={id} className="mt-1.5 text-base text-rouge-fonce" role="alert">
      {erreur}
    </p>
  );
}

const ariaChamp = (id: string, erreur?: string, aide?: string) => ({
  "aria-invalid": erreur ? true : undefined,
  "aria-describedby": [erreur ? `${id}-erreur` : null, aide ? `${id}-aide` : null].filter(Boolean).join(" ") || undefined,
});

export function ChampTexte({
  id,
  label,
  valeur,
  onChange,
  erreur,
  aide,
  obligatoire = true,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
}: {
  id: string;
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  erreur?: string;
  aide?: string;
  obligatoire?: boolean;
  type?: "text" | "email" | "tel" | "number";
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "decimal";
  placeholder?: string;
}) {
  return (
    <div>
      <Libelle htmlFor={id} obligatoire={obligatoire}>{label}</Libelle>
      {aide && <p id={`${id}-aide`} className="mb-1.5 text-base text-gris">{aide}</p>}
      <input
        id={id}
        name={id}
        type={type}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        required={obligatoire}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        className={`${classeChamp} ${bordure(erreur)}`}
        {...ariaChamp(id, erreur, aide)}
      />
      <MessageErreur id={`${id}-erreur`} erreur={erreur} />
    </div>
  );
}

export function ChampZoneTexte({
  id,
  label,
  valeur,
  onChange,
  erreur,
  obligatoire = false,
}: {
  id: string;
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  erreur?: string;
  obligatoire?: boolean;
}) {
  return (
    <div>
      <Libelle htmlFor={id} obligatoire={obligatoire}>{label}</Libelle>
      <textarea
        id={id}
        name={id}
        rows={5}
        maxLength={3000}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className={`${classeChamp} ${bordure(erreur)}`}
        {...ariaChamp(id, erreur)}
      />
      <MessageErreur id={`${id}-erreur`} erreur={erreur} />
    </div>
  );
}

export function ChampSelect({
  id,
  label,
  valeur,
  onChange,
  options,
  erreur,
  aide,
  obligatoire = true,
}: {
  id: string;
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  options: { valeur: string; libelle: string }[];
  erreur?: string;
  aide?: string;
  obligatoire?: boolean;
}) {
  return (
    <div>
      <Libelle htmlFor={id} obligatoire={obligatoire}>{label}</Libelle>
      {aide && <p id={`${id}-aide`} className="mb-1.5 text-base text-gris">{aide}</p>}
      <select
        id={id}
        name={id}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        required={obligatoire}
        className={`${classeChamp} ${bordure(erreur)}`}
        {...ariaChamp(id, erreur, aide)}
      >
        <option value="">Choisir…</option>
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>{o.libelle}</option>
        ))}
      </select>
      <MessageErreur id={`${id}-erreur`} erreur={erreur} />
    </div>
  );
}

/** Téléphone : indicatif (+225 par défaut) + numéro. */
export function ChampTelephone({
  id,
  indicatif,
  numero,
  onIndicatif,
  onNumero,
  erreur,
}: {
  id: string;
  indicatif: string;
  numero: string;
  onIndicatif: (v: string) => void;
  onNumero: (v: string) => void;
  erreur?: string;
}) {
  return (
    <div>
      <Libelle htmlFor={id} obligatoire>Téléphone</Libelle>
      <div className="flex gap-2">
        <select
          aria-label="Indicatif pays"
          value={indicatif}
          onChange={(e) => onIndicatif(e.target.value)}
          className={`${classeChamp.replace("w-full", "")} w-28 shrink-0 border-[#b8b8bd] px-2 sm:w-48`}
        >
          {INDICATIFS.map((i) => (
            <option key={`${i.code}-${i.pays}`} value={i.code}>{i.code} {i.pays}</option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          value={numero}
          onChange={(e) => onNumero(e.target.value)}
          required
          className={`${classeChamp.replace("w-full", "")} min-w-0 flex-1 ${bordure(erreur)}`}
          {...ariaChamp(id, erreur)}
        />
      </div>
      <MessageErreur id={`${id}-erreur`} erreur={erreur} />
    </div>
  );
}

/** Groupe de boutons radio (fieldset/legend accessibles). */
export function GroupeRadio<T extends string>({
  nom,
  legende,
  aide,
  valeur,
  options,
  onChange,
  erreur,
  enLigne = true,
}: {
  nom: string;
  legende: string;
  aide?: string;
  valeur: T | "";
  options: { valeur: T; libelle: string }[];
  onChange: (v: T) => void;
  erreur?: string;
  enLigne?: boolean;
}) {
  return (
    <fieldset aria-describedby={erreur ? `${nom}-erreur` : undefined}>
      <legend className="mb-2 font-semibold text-anthracite">{legende}</legend>
      {aide && <p className="mb-2 text-base text-gris">{aide}</p>}
      <div className={`flex gap-2 ${enLigne ? "flex-wrap" : "flex-col"}`}>
        {options.map((o) => {
          const coche = valeur === o.valeur;
          return (
            <label
              key={o.valeur}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 py-2 text-base transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-rouge ${
                coche ? "border-rouge bg-[#fff4ef] font-semibold" : "border-[#b8b8bd] bg-white hover:border-anthracite"
              }`}
            >
              <input type="radio" name={nom} value={o.valeur} checked={coche} onChange={() => onChange(o.valeur)} className="h-4 w-4 accent-[#d7261e]" />
              {o.libelle}
            </label>
          );
        })}
      </div>
      <MessageErreur id={`${nom}-erreur`} erreur={erreur} />
    </fieldset>
  );
}

/** Cases à cocher multiples. */
export function CasesMultiples({
  nom,
  legende,
  valeurs,
  options,
  onChange,
  erreur,
}: {
  nom: string;
  legende: string;
  valeurs: string[];
  options: { valeur: string; libelle: string }[];
  onChange: (v: string[]) => void;
  erreur?: string;
}) {
  const basculer = (v: string) => onChange(valeurs.includes(v) ? valeurs.filter((x) => x !== v) : [...valeurs, v]);
  return (
    <fieldset aria-describedby={erreur ? `${nom}-erreur` : undefined}>
      <legend className="mb-2 font-semibold text-anthracite">
        {legende} <span className="text-rouge" aria-hidden="true">*</span>
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.valeur} className="flex min-h-11 cursor-pointer items-center gap-3 text-base">
            <input type="checkbox" name={nom} value={o.valeur} checked={valeurs.includes(o.valeur)} onChange={() => basculer(o.valeur)} className="h-5 w-5 accent-[#d7261e]" />
            {o.libelle}
          </label>
        ))}
      </div>
      <MessageErreur id={`${nom}-erreur`} erreur={erreur} />
    </fieldset>
  );
}

/** Case de consentement, jamais précochée. */
export function CaseConsentement({
  id,
  coche,
  onChange,
  erreur,
  texte = "J'accepte que BIP traite les informations transmises pour répondre à ma demande.",
}: {
  id: string;
  coche: boolean;
  onChange: (v: boolean) => void;
  erreur?: string;
  texte?: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={coche}
          onChange={(e) => onChange(e.target.checked)}
          required
          className="mt-1 h-5 w-5 shrink-0 accent-[#d7261e]"
          aria-invalid={erreur ? true : undefined}
          aria-describedby={erreur ? `${id}-erreur` : undefined}
        />
        <label htmlFor={id} className="text-base text-anthracite">
          {texte} Consultez notre{" "}
          <Link href="/confidentialite" className="text-rouge underline underline-offset-2" target="_blank">
            politique de confidentialité
          </Link>
          . <span className="text-rouge" aria-hidden="true">*</span>
        </label>
      </div>
      <MessageErreur id={`${id}-erreur`} erreur={erreur} />
    </div>
  );
}

/** Champ piège invisible pour les humains (anti-robots). */
export function ChampPiege({ valeur, onChange }: { valeur: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="siteWeb">Ne pas remplir ce champ</label>
      <input id="siteWeb" name="siteWeb" type="text" tabIndex={-1} autoComplete="off" value={valeur} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
