import { z } from "zod";
import { readiness } from "@/config/readiness";
import { multiplesSectoriels, PAYS } from "@/config/valuation";
import { champsContact, champsSecurite, horizonSchema } from "./commun";
import { donneesSimulationSchema } from "./simulation";

export const TYPES_PROJET = {
  ceder: "Céder mon entreprise",
  transmettre: "Transmettre mon entreprise",
  lever: "Lever des fonds",
  investir: "Investir ou acquérir",
  evaluation: "Faire évaluer mon entreprise",
  autre: "Autre",
} as const;
export type TypeProjet = keyof typeof TYPES_PROJET;

export const contactSchema = z.object({
  ...champsContact,
  typeProjet: z.enum(Object.keys(TYPES_PROJET) as [TypeProjet, ...TypeProjet[]], "Veuillez choisir un type de projet."),
  horizon: horizonSchema,
  message: z.string().trim().max(3000, "Message : 3 000 caractères maximum.").optional().default(""),
  ...champsSecurite,
});
export type DonneesContact = z.infer<typeof contactSchema>;

export const TYPES_INVESTISSEUR = {
  fonds: "Fonds d'investissement",
  groupe_regional: "Groupe régional (Afrique)",
  groupe_etranger: "Groupe étranger",
  family_office: "Family office",
  investisseur_prive: "Investisseur privé",
  autre: "Autre",
} as const;
export type TypeInvestisseur = keyof typeof TYPES_INVESTISSEUR;

export const PARTICIPATIONS = {
  minoritaire: "Minoritaire",
  majoritaire: "Majoritaire",
  indifferent: "Indifférent",
} as const;
export type Participation = keyof typeof PARTICIPATIONS;

const idsSecteurs = multiplesSectoriels.secteurs.map((s) => s.id);
const codesPays = PAYS.map((p) => p.code) as string[];

export const investisseurSchema = z
  .object({
    ...champsContact,
    typeInvestisseur: z.enum(Object.keys(TYPES_INVESTISSEUR) as [TypeInvestisseur, ...TypeInvestisseur[]], "Veuillez choisir un type d'investisseur."),
    secteurs: z
      .array(z.string().refine((s) => idsSecteurs.includes(s), "Secteur inconnu."))
      .min(1, "Choisissez au moins un secteur."),
    devise: z.enum(["FCFA", "EUR"], "Veuillez choisir une devise."),
    ticketMin: z.number("Montant invalide.").int().positive("Le ticket minimum doit être positif."),
    ticketMax: z.number("Montant invalide.").int().positive("Le ticket maximum doit être positif."),
    participation: z.enum(Object.keys(PARTICIPATIONS) as [Participation, ...Participation[]], "Veuillez choisir un type de participation."),
    pays: z.array(z.string().refine((p) => codesPays.includes(p), "Pays inconnu.")).min(1, "Choisissez au moins un pays."),
    message: z.string().trim().max(3000, "Message : 3 000 caractères maximum.").optional().default(""),
    ...champsSecurite,
  })
  .refine((d) => d.ticketMax >= d.ticketMin, { path: ["ticketMax"], message: "Le ticket maximum doit être supérieur ou égal au minimum." });
export type DonneesInvestisseur = z.infer<typeof investisseurSchema>;

/** Coordonnées demandées à la fin du simulateur et du score. */
export const coordonneesLeadSchema = z.object({ ...champsContact, horizon: horizonSchema });

export const leadSimulationSchema = z.object({
  ...champsContact,
  horizon: horizonSchema,
  donnees: donneesSimulationSchema,
  ...champsSecurite,
});
export type DonneesLeadSimulation = z.infer<typeof leadSimulationSchema>;

export const leadScoreSchema = z.object({
  ...champsContact,
  horizon: horizonSchema,
  reponses: z
    .record(z.string().max(40), z.string().max(40))
    .refine(
      (r) => readiness.blocs.every((b) => b.questions.every((q) => q.options.some((o) => o.valeur === r[q.id]))),
      "Le questionnaire est incomplet.",
    ),
  ...champsSecurite,
});
export type DonneesLeadScore = z.infer<typeof leadScoreSchema>;
