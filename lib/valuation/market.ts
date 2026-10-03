/**
 * B. Approche par le marché — multiples de transactions comparables.
 *
 * Méthode principale : EBE retraité × multiple sectoriel (bas / central / haut).
 * Méthode secondaire : CA × multiple sectoriel, utilisée SEULE si l'EBE
 * retraité est nul ou négatif (sinon affichée comme simple repère).
 *
 * IMPORTANT — pas de double comptage :
 *  - les multiples de référence proviennent de transactions sur des PME NON
 *    COTÉES d'Afrique de l'Ouest : ils intègrent déjà l'illiquidité. On
 *    n'applique donc AUCUNE décote d'illiquidité supplémentaire ici ;
 *  - la taille est prise en compte par la DÉCOTE DE TAILLE, uniquement sur
 *    cette approche. L'approche par le revenu utilise à la place la PRIME DE
 *    TAILLE dans le taux d'actualisation. Jamais les deux sur la même approche.
 *
 * Ordre d'application (cas EBE négatif) : ajustements qualitatifs plafonnés,
 * puis décote de taille, puis décote EBE négatif (−20 %) en dernier, hors
 * plafond.
 */
import type { Fourchette, Secteur, TrancheEffectif } from "@/config/valuation";
import type { ParametresValorisation, ResultatMarche } from "./types";

const appliquer = (f: Fourchette, fn: (x: number) => number): Fourchette => ({
  bas: fn(f.bas),
  central: fn(f.central),
  haut: fn(f.haut),
});

export function calculerApprocheMarche(args: {
  methode: "ebe" | "ca";
  agregat: number;
  secteur: Secteur;
  effectif: TrancheEffectif;
  cumulAjustements: number;
  appliquerDecoteEBENegatif: boolean;
  p: ParametresValorisation;
}): ResultatMarche {
  const { methode, agregat, secteur, effectif, cumulAjustements, appliquerDecoteEBENegatif, p } = args;
  const multiplesReference = methode === "ebe" ? secteur.multipleEBE : secteur.multipleCA;
  const decoteTaille = p.decoteTaille[effectif];
  const decoteEBENegatif = appliquerDecoteEBENegatif ? p.decoteEBENegatif : 0;

  // Facteur hors ajustements qualitatifs (sert à chiffrer l'effet de chaque critère).
  const facteurBase = (1 - decoteTaille) * (1 - decoteEBENegatif);
  const facteur = (1 + cumulAjustements) * facteurBase;

  const multiplesEffectifs = appliquer(multiplesReference, (m) => m * facteur);
  const valeurEntreprise = appliquer(multiplesEffectifs, (m) => agregat * m);

  return {
    methode,
    multiplesReference,
    multiplesEffectifs,
    agregat,
    decoteTaille,
    decoteEBENegatif,
    valeurEntreprise,
    valeurBaseCentrale: agregat * multiplesReference.central * facteurBase,
  };
}
