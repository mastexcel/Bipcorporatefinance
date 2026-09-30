/**
 * État de saisie du simulateur (chaînes de caractères, telles que tapées) et
 * conversion vers les données typées du moteur de calcul.
 */
import type { z } from "zod";
import type { DonneesSimulation } from "@/lib/valuation";
import { erreursParChamp } from "@/lib/schemas/commun";
import { chiffresSchema, entrepriseSchema, profilSchema, retraitementsSchema } from "@/lib/schemas/simulation";
import { lireMontant } from "@/lib/valuation/format";

export interface SaisieSimulateur {
  entreprise: { secteur: string; pays: string; anneeCreation: string; effectif: string; formeJuridique: string };
  chiffres: {
    chiffreAffaires: string;
    ebe: string;
    dotationsAmortissements: string;
    dettesFinancieres: string;
    tresorerie: string;
    capitauxPropres: string;
    dettesFiscalesSocialesEchues: string;
    chiffreAffairesN1: string;
    chiffreAffairesN2: string;
  };
  retraitements: {
    remunerationDirigeantActuelle: string;
    remunerationDirigeantMarche: string;
    chargesExceptionnelles: string;
    produitsExceptionnels: string;
    loyerActuel: string;
    loyerMarche: string;
  };
  profil: {
    dependanceDirigeant: string;
    premierClientPlus30: string;
    top5ClientsPlus60: string;
    expertComptable: string;
    comptesCertifies: string;
    fiscalSocialAJour: string;
    contratsEcrits: string;
    recurrentPlus50: string;
    equipeDirection: string;
    litigeImportant: string;
  };
}

export const saisieInitiale: SaisieSimulateur = {
  entreprise: { secteur: "", pays: "CI", anneeCreation: "", effectif: "", formeJuridique: "" },
  chiffres: {
    chiffreAffaires: "",
    ebe: "",
    dotationsAmortissements: "",
    dettesFinancieres: "",
    tresorerie: "",
    capitauxPropres: "",
    dettesFiscalesSocialesEchues: "",
    chiffreAffairesN1: "",
    chiffreAffairesN2: "",
  },
  retraitements: {
    remunerationDirigeantActuelle: "",
    remunerationDirigeantMarche: "",
    chargesExceptionnelles: "",
    produitsExceptionnels: "",
    loyerActuel: "",
    loyerMarche: "",
  },
  profil: {
    dependanceDirigeant: "",
    premierClientPlus30: "",
    top5ClientsPlus60: "",
    expertComptable: "",
    comptesCertifies: "",
    fiscalSocialAJour: "",
    contratsEcrits: "",
    recurrentPlus50: "",
    equipeDirection: "",
    litigeImportant: "",
  },
};

const entier = (s: string) => (/^\d{1,4}$/.test(s.trim()) ? Number(s.trim()) : null);
const booleen = (s: string) => (s === "oui" ? true : s === "non" ? false : null);
const vide = (s: string) => (s === "" ? null : s);

/** Convertit la saisie brute en objets à valider (les champs vides deviennent null ou 0). */
export function convertir(s: SaisieSimulateur) {
  const c = s.chiffres;
  const r = s.retraitements;
  const p = s.profil;
  return {
    entreprise: {
      secteur: vide(s.entreprise.secteur),
      pays: vide(s.entreprise.pays),
      anneeCreation: entier(s.entreprise.anneeCreation),
      effectif: vide(s.entreprise.effectif),
      formeJuridique: vide(s.entreprise.formeJuridique),
    },
    chiffres: {
      chiffreAffaires: lireMontant(c.chiffreAffaires),
      ebe: lireMontant(c.ebe),
      dotationsAmortissements: lireMontant(c.dotationsAmortissements),
      dettesFinancieres: lireMontant(c.dettesFinancieres),
      tresorerie: lireMontant(c.tresorerie),
      capitauxPropres: lireMontant(c.capitauxPropres),
      // Facultatif : vide = 0
      dettesFiscalesSocialesEchues: lireMontant(c.dettesFiscalesSocialesEchues) ?? 0,
      chiffreAffairesN1: lireMontant(c.chiffreAffairesN1),
      chiffreAffairesN2: lireMontant(c.chiffreAffairesN2),
    },
    retraitements: {
      remunerationDirigeantActuelle: lireMontant(r.remunerationDirigeantActuelle),
      remunerationDirigeantMarche: lireMontant(r.remunerationDirigeantMarche),
      chargesExceptionnelles: lireMontant(r.chargesExceptionnelles) ?? 0,
      produitsExceptionnels: lireMontant(r.produitsExceptionnels) ?? 0,
      loyerActuel: lireMontant(r.loyerActuel),
      loyerMarche: lireMontant(r.loyerMarche),
    },
    profil: {
      dependanceDirigeant: vide(p.dependanceDirigeant),
      premierClientPlus30: booleen(p.premierClientPlus30),
      top5ClientsPlus60: booleen(p.top5ClientsPlus60),
      expertComptable: booleen(p.expertComptable),
      comptesCertifies: booleen(p.comptesCertifies),
      fiscalSocialAJour: vide(p.fiscalSocialAJour),
      contratsEcrits: vide(p.contratsEcrits),
      recurrentPlus50: booleen(p.recurrentPlus50),
      equipeDirection: booleen(p.equipeDirection),
      litigeImportant: booleen(p.litigeImportant),
    },
  };
}

const SCHEMAS: Record<1 | 2 | 3 | 4, { cle: keyof SaisieSimulateur; schema: z.ZodType }> = {
  1: { cle: "entreprise", schema: entrepriseSchema },
  2: { cle: "chiffres", schema: chiffresSchema },
  3: { cle: "retraitements", schema: retraitementsSchema },
  4: { cle: "profil", schema: profilSchema },
};

/** Valide une étape ; renvoie les erreurs par champ (vide si tout est correct). */
export function validerEtape(etape: 1 | 2 | 3 | 4, s: SaisieSimulateur): Record<string, string> {
  const { cle, schema } = SCHEMAS[etape];
  const c = convertir(s);
  const r = schema.safeParse(c[cle]);
  const erreurs = r.success ? {} : erreursParChamp(r.error);
  // Cohérence entre étapes : produits exceptionnels ≤ chiffre d'affaires.
  if (etape === 3 && c.chiffres.chiffreAffaires !== null && c.retraitements.produitsExceptionnels > c.chiffres.chiffreAffaires) {
    erreurs.produitsExceptionnels ??= "Les produits exceptionnels ne peuvent pas dépasser le chiffre d'affaires.";
  }
  return erreurs;
}

/** Données complètes et typées (null si une étape est invalide). */
export function donneesCompletes(s: SaisieSimulateur): DonneesSimulation | null {
  const c = convertir(s);
  const e = entrepriseSchema.safeParse(c.entreprise);
  const ch = chiffresSchema.safeParse(c.chiffres);
  const r = retraitementsSchema.safeParse(c.retraitements);
  const p = profilSchema.safeParse(c.profil);
  if (!e.success || !ch.success || !r.success || !p.success) return null;
  return { entreprise: e.data, chiffres: ch.data, retraitements: r.data, profil: p.data };
}
