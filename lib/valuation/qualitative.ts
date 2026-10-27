/**
 * Ajustements qualitatifs (profil de l'étape 4, croissance et ancienneté).
 *
 * Chaque critère ajuste :
 *  - le multiple de l'approche par le marché (cumul plafonné) ;
 *  - la prime de risque spécifique de l'approche par le revenu (bornée).
 */
import type {
  DonneesChiffres,
  DonneesEntreprise,
  DonneesProfil,
  LigneAjustement,
  ParametresValorisation,
  ResultatAjustements,
} from "./types";

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/**
 * Croissance annuelle moyenne du CA.
 * - avec N-2 : taux composé sur 2 ans ;
 * - sinon avec N-1 : croissance sur 1 an ;
 * - sinon : null.
 */
export function calculerCroissanceAnnuelle(
  c: Pick<DonneesChiffres, "chiffreAffaires" | "chiffreAffairesN1" | "chiffreAffairesN2">,
): number | null {
  if (c.chiffreAffairesN2 !== null && c.chiffreAffairesN2 > 0) {
    return Math.sqrt(c.chiffreAffaires / c.chiffreAffairesN2) - 1;
  }
  if (c.chiffreAffairesN1 !== null && c.chiffreAffairesN1 > 0) {
    return c.chiffreAffaires / c.chiffreAffairesN1 - 1;
  }
  return null;
}

export function calculerAjustements(
  entreprise: Pick<DonneesEntreprise, "anneeCreation">,
  chiffres: Pick<DonneesChiffres, "chiffreAffaires" | "chiffreAffairesN1" | "chiffreAffairesN2">,
  profil: DonneesProfil,
  p: ParametresValorisation,
  anneeReference: number,
): ResultatAjustements {
  const a = p.ajustements;
  const lignes: LigneAjustement[] = [];
  const ajouter = (id: string, libelle: string, aj: { multiple: number; points: number }) =>
    lignes.push({ id, libelle, multiple: aj.multiple, points: aj.points });

  if (profil.dependanceDirigeant === "non") {
    ajouter("dependanceDirigeant", "Forte dépendance au dirigeant", a.dependanceDirigeant.non);
  } else if (profil.dependanceDirigeant === "en_partie") {
    ajouter("dependanceDirigeant", "Dépendance partielle au dirigeant", a.dependanceDirigeant.en_partie);
  }
  if (profil.premierClientPlus30) {
    ajouter("premierClient", "Premier client supérieur à 30 % du CA", a.premierClientPlus30);
  }
  if (profil.top5ClientsPlus60) {
    ajouter("top5Clients", "Cinq premiers clients supérieurs à 60 % du CA", a.top5ClientsPlus60);
  }
  if (!profil.expertComptable) {
    ajouter("expertComptable", "Comptes non établis par un expert-comptable", a.sansExpertComptable);
  }
  if (profil.comptesCertifies) {
    ajouter("comptesCertifies", "Comptes certifiés par un commissaire aux comptes", a.comptesCertifies);
  }
  if (profil.fiscalSocialAJour === "non") {
    ajouter("fiscalSocial", "Situation fiscale et sociale non à jour", a.fiscalSocial.non);
  } else if (profil.fiscalSocialAJour === "ne_sait_pas") {
    ajouter("fiscalSocial", "Situation fiscale et sociale incertaine", a.fiscalSocial.ne_sait_pas);
  }
  if (profil.contratsEcrits === "non") {
    ajouter("contrats", "Contrats clients et fournisseurs non écrits", a.contratsNonEcrits);
  }
  if (profil.recurrentPlus50) {
    ajouter("recurrent", "Chiffre d'affaires récurrent supérieur à 50 %", a.recurrentPlus50);
  }
  if (profil.equipeDirection) {
    ajouter("equipeDirection", "Équipe de direction en place", a.equipeDirection);
  }
  if (profil.litigeImportant) {
    ajouter("litige", "Litige important en cours", a.litigeImportant);
  }

  const croissanceAnnuelle = calculerCroissanceAnnuelle(chiffres);
  if (croissanceAnnuelle !== null) {
    if (croissanceAnnuelle > a.croissanceForte.seuil) {
      ajouter("croissance", "Croissance du CA supérieure à 10 % par an", a.croissanceForte);
    } else if (croissanceAnnuelle < a.baisseForte.seuil) {
      ajouter("croissance", "Baisse du CA supérieure à 10 % par an", a.baisseForte);
    }
  }

  const ageEntreprise = anneeReference - entreprise.anneeCreation;
  if (ageEntreprise < a.entrepriseRecente.ageMaximum) {
    ajouter("entrepriseRecente", "Entreprise de moins de 3 ans", a.entrepriseRecente);
  }

  const cumulMultipleBrut = lignes.reduce((s, l) => s + l.multiple, 0);
  const cumulMultiple = borner(cumulMultipleBrut, a.plafond.min, a.plafond.max);
  // Tolérance d'arrondi flottant pour détecter le plafond.
  const plafondAtteint =
    cumulMultipleBrut < a.plafond.min - 1e-9 ? "min" : cumulMultipleBrut > a.plafond.max + 1e-9 ? "max" : null;

  const primeSpecifiqueBrute = lignes.reduce((s, l) => s + l.points, 0);
  const primeSpecifique = borner(primeSpecifiqueBrute, a.primeSpecifique.min, a.primeSpecifique.max);

  return {
    lignes,
    cumulMultipleBrut,
    cumulMultiple,
    plafondAtteint,
    primeSpecifiqueBrute,
    primeSpecifique,
    croissanceAnnuelle,
    ageEntreprise,
  };
}
