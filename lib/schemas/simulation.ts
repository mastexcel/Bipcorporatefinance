/**
 * Validation des données du simulateur (étapes 1 à 4).
 * Utilisée à chaque étape dans le navigateur et à nouveau sur le serveur.
 */
import { z } from "zod";
import { FORMES_JURIDIQUES, multiplesSectoriels, PAYS, TRANCHES_EFFECTIF, type CodePays } from "@/config/valuation";

const MAX_MONTANT = 1e15; // Garde-fou contre les saisies aberrantes (1 million de milliards de FCFA).

const obligatoire = "Ce champ est obligatoire.";
const montantPositif = (libelle: string) =>
  z.number(`${libelle} : ${obligatoire.toLowerCase()}`).int("Montant entier attendu.").min(0, `${libelle} : le montant doit être positif.`).max(MAX_MONTANT, "Montant trop élevé.");
const montantSigne = (libelle: string) =>
  z.number(`${libelle} : ${obligatoire.toLowerCase()}`).int("Montant entier attendu.").min(-MAX_MONTANT, "Montant trop élevé.").max(MAX_MONTANT, "Montant trop élevé.");
const montantFacultatif = (libelle: string) =>
  z.number().int("Montant entier attendu.").min(0, `${libelle} : le montant doit être positif.`).max(MAX_MONTANT, "Montant trop élevé.").nullable();

const idsSecteurs = multiplesSectoriels.secteurs.map((s) => s.id);

export const entrepriseSchema = z.object({
  secteur: z.string(obligatoire).refine((s) => idsSecteurs.includes(s), "Veuillez choisir un secteur."),
  pays: z.enum(PAYS.map((p) => p.code) as [CodePays, ...CodePays[]], "Veuillez choisir un pays."),
  anneeCreation: z
    .number("Veuillez indiquer l'année de création.")
    .int("Année invalide.")
    .min(1900, "Année invalide.")
    .refine((a) => a <= new Date().getFullYear(), "L'année de création ne peut pas être dans le futur."),
  effectif: z.enum(TRANCHES_EFFECTIF, "Veuillez choisir une tranche d'effectif."),
  formeJuridique: z.enum(FORMES_JURIDIQUES, "Veuillez choisir une forme juridique."),
});

export const chiffresSchema = z
  .object({
    chiffreAffaires: montantPositif("Chiffre d'affaires").refine((v) => v > 0, "Le chiffre d'affaires doit être supérieur à 0."),
    ebe: montantSigne("EBE"),
    dotationsAmortissements: montantPositif("Dotations aux amortissements"),
    dettesFinancieres: montantPositif("Dettes financières"),
    tresorerie: montantPositif("Trésorerie"),
    capitauxPropres: montantSigne("Capitaux propres"),
    dettesFiscalesSocialesEchues: montantPositif("Dettes fiscales et sociales échues"),
    chiffreAffairesN1: montantFacultatif("Chiffre d'affaires N-1").refine((v) => v === null || v > 0, "Le montant doit être supérieur à 0."),
    chiffreAffairesN2: montantFacultatif("Chiffre d'affaires N-2").refine((v) => v === null || v > 0, "Le montant doit être supérieur à 0."),
  })
  .refine((c) => c.ebe <= c.chiffreAffaires, {
    path: ["ebe"],
    message: "L'EBE ne peut pas être supérieur au chiffre d'affaires.",
  })
  .refine((c) => c.dotationsAmortissements <= c.chiffreAffaires, {
    path: ["dotationsAmortissements"],
    message: "Les dotations semblent supérieures au chiffre d'affaires : vérifiez la saisie.",
  });

export const retraitementsSchema = z
  .object({
    remunerationDirigeantActuelle: montantFacultatif("Rémunération actuelle"),
    remunerationDirigeantMarche: montantFacultatif("Rémunération de marché"),
    chargesExceptionnelles: montantPositif("Charges exceptionnelles"),
    produitsExceptionnels: montantPositif("Produits exceptionnels"),
    loyerActuel: montantFacultatif("Loyer actuel"),
    loyerMarche: montantFacultatif("Loyer de marché"),
  })
  .refine((r) => (r.remunerationDirigeantActuelle === null) === (r.remunerationDirigeantMarche === null), {
    path: ["remunerationDirigeantMarche"],
    message: "Renseignez les deux rémunérations (actuelle et de marché), ou aucune.",
  })
  .refine((r) => (r.loyerActuel === null) === (r.loyerMarche === null), {
    path: ["loyerMarche"],
    message: "Renseignez les deux loyers (actuel et de marché), ou aucun.",
  });

const ouiEnPartieNon = z.enum(["oui", "en_partie", "non"], "Veuillez répondre à cette question.");
const ouiNon = z.boolean("Veuillez répondre à cette question.");

export const profilSchema = z.object({
  dependanceDirigeant: ouiEnPartieNon,
  premierClientPlus30: ouiNon,
  top5ClientsPlus60: ouiNon,
  expertComptable: ouiNon,
  comptesCertifies: ouiNon,
  fiscalSocialAJour: z.enum(["oui", "non", "ne_sait_pas"], "Veuillez répondre à cette question."),
  contratsEcrits: ouiEnPartieNon,
  recurrentPlus50: ouiNon,
  equipeDirection: ouiNon,
  litigeImportant: ouiNon,
});

export const donneesSimulationSchema = z
  .object({
    entreprise: entrepriseSchema,
    chiffres: chiffresSchema,
    retraitements: retraitementsSchema,
    profil: profilSchema,
  })
  // Cohérence entre étapes : les produits exceptionnels ne peuvent excéder le CA.
  .refine((d) => d.retraitements.produitsExceptionnels <= d.chiffres.chiffreAffaires, {
    path: ["retraitements", "produitsExceptionnels"],
    message: "Les produits exceptionnels ne peuvent pas dépasser le chiffre d'affaires.",
  });
