"use client";

import { ChampTelephone, ChampTexte } from "./Champs";

export interface ValeursCoordonnees {
  nom: string;
  fonction: string;
  entreprise: string;
  indicatif: string;
  telephone: string;
  email: string;
}

export const coordonneesVides: ValeursCoordonnees = {
  nom: "",
  fonction: "",
  entreprise: "",
  indicatif: "+225",
  telephone: "",
  email: "",
};

/** Bloc de coordonnées commun à tous les formulaires. */
export function BlocCoordonnees({
  prefixe,
  valeurs,
  onChange,
  erreurs,
}: {
  prefixe: string;
  valeurs: ValeursCoordonnees;
  onChange: (v: ValeursCoordonnees) => void;
  erreurs: Record<string, string>;
}) {
  const maj = (cle: keyof ValeursCoordonnees) => (v: string) => onChange({ ...valeurs, [cle]: v });
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <ChampTexte id={`${prefixe}-nom`} label="Nom et prénom" valeur={valeurs.nom} onChange={maj("nom")} erreur={erreurs.nom} autoComplete="name" />
      <ChampTexte id={`${prefixe}-fonction`} label="Fonction" valeur={valeurs.fonction} onChange={maj("fonction")} erreur={erreurs.fonction} autoComplete="organization-title" />
      <ChampTexte id={`${prefixe}-entreprise`} label="Entreprise" valeur={valeurs.entreprise} onChange={maj("entreprise")} erreur={erreurs.entreprise} autoComplete="organization" />
      <ChampTexte id={`${prefixe}-email`} label="E-mail" type="email" valeur={valeurs.email} onChange={maj("email")} erreur={erreurs.email} autoComplete="email" inputMode="email" />
      <div className="sm:col-span-2">
        <ChampTelephone
          id={`${prefixe}-telephone`}
          indicatif={valeurs.indicatif}
          numero={valeurs.telephone}
          onIndicatif={maj("indicatif")}
          onNumero={maj("telephone")}
          erreur={erreurs.telephone ?? erreurs.indicatif}
        />
      </div>
    </div>
  );
}
