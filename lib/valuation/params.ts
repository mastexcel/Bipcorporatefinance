/**
 * Assemblage et vérification des paramètres de valorisation.
 */
import {
  ajustementsQualitatifs,
  croissanceLongTerme,
  decoteTaille,
  multiplesSectoriels,
  primeMarcheMature,
  primeRisquePays,
  primeTaille,
  reglesCalcul,
  tauxImpotSocietes,
  tauxSansRisque,
} from "../../config/valuation";
import type { ParametresValorisation } from "./types";

/** Paramètres en vigueur, issus de config/valuation.ts. */
export const parametresEnVigueur: ParametresValorisation = {
  secteurs: multiplesSectoriels.secteurs,
  tauxSansRisque: tauxSansRisque.valeur,
  primeMarcheMature: primeMarcheMature.valeur,
  primeRisquePays: primeRisquePays.valeurs,
  primeTaille: primeTaille.valeurs,
  decoteTaille: decoteTaille.valeurs,
  croissanceLongTerme: croissanceLongTerme.valeur,
  tauxImpotSocietes: tauxImpotSocietes.valeur,
  ponderation: reglesCalcul.ponderation,
  ecartTauxFourchette: reglesCalcul.ecartTauxFourchette,
  decoteEBENegatif: reglesCalcul.decoteEBENegatif,
  arrondi: reglesCalcul.arrondi,
  ecartMinimalTauxCroissance: reglesCalcul.ecartMinimalTauxCroissance,
  ajustements: ajustementsQualitatifs,
};

/** Erreur levée lorsqu'un paramètre obligatoire est vide ([À COMPLÉTER]). */
export class ParametreManquantError extends Error {
  constructor(public readonly manquants: string[]) {
    super(
      `Paramètres de valorisation manquants [À COMPLÉTER] dans config/valuation.ts : ${manquants.join(", ")}.`,
    );
    this.name = "ParametreManquantError";
  }
}

/**
 * Liste les paramètres obligatoires encore vides.
 * La prime pays n'est obligatoire que pour la Côte d'Ivoire (pays par défaut).
 */
export function parametresManquants(p: ParametresValorisation): string[] {
  const manquants: string[] = [];
  if (p.tauxSansRisque === null) manquants.push("tauxSansRisque");
  if (p.primeMarcheMature === null) manquants.push("primeMarcheMature");
  if (p.primeRisquePays.CI === null) manquants.push("primeRisquePays.CI");
  if (p.croissanceLongTerme === null) manquants.push("croissanceLongTerme");
  if (p.tauxImpotSocietes === null) manquants.push("tauxImpotSocietes");
  if (p.secteurs.length === 0) manquants.push("multiplesSectoriels");
  return manquants;
}

/** Lève une erreur explicite si un paramètre obligatoire est vide. */
export function verifierParametres(p: ParametresValorisation): void {
  const manquants = parametresManquants(p);
  if (manquants.length > 0) throw new ParametreManquantError(manquants);
}
