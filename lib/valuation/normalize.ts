/**
 * A. EBE retraité (« normalisé »), comme dans une analyse de qualité des
 * résultats (Quality of Earnings) :
 *
 *   EBE retraité = EBE déclaré
 *                + écart de rémunération du dirigeant (actuelle − marché)
 *                + charges exceptionnelles
 *                − produits exceptionnels
 *                ± écart de loyer (actuel − marché)
 */
import type { DonneesChiffres, DonneesRetraitements, LigneMontant, ResultatEBERetraite } from "./types";

export function calculerEBERetraite(
  chiffres: Pick<DonneesChiffres, "ebe">,
  r: DonneesRetraitements,
): ResultatEBERetraite {
  const lignes: LigneMontant[] = [];

  // Rémunération du dirigeant : si le dirigeant se verse plus que le coût d'un
  // directeur général salarié, l'écart est réintégré (et inversement).
  if (r.remunerationDirigeantActuelle !== null && r.remunerationDirigeantMarche !== null) {
    const ecart = r.remunerationDirigeantActuelle - r.remunerationDirigeantMarche;
    if (ecart !== 0) {
      lignes.push({ libelle: "Écart de rémunération du dirigeant", montant: ecart });
    }
  }

  if (r.chargesExceptionnelles > 0) {
    lignes.push({ libelle: "Charges exceptionnelles réintégrées", montant: r.chargesExceptionnelles });
  }
  if (r.produitsExceptionnels > 0) {
    lignes.push({ libelle: "Produits exceptionnels retirés", montant: -r.produitsExceptionnels });
  }

  // Loyer versé à une partie liée : un loyer au-dessus du marché est réintégré,
  // un loyer en dessous du marché est déduit (l'acquéreur paiera le prix normal).
  if (r.loyerActuel !== null && r.loyerMarche !== null) {
    const ecart = r.loyerActuel - r.loyerMarche;
    if (ecart !== 0) {
      lignes.push({ libelle: "Écart de loyer (partie liée)", montant: ecart });
    }
  }

  const ebeRetraite = lignes.reduce((total, l) => total + l.montant, chiffres.ebe);
  return { ebeDeclare: chiffres.ebe, lignes, ebeRetraite };
}
