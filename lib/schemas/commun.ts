/**
 * Schémas Zod partagés entre le navigateur (validation immédiate) et le
 * serveur (validation de sécurité). Messages d'erreur en français.
 */
import { z } from "zod";

// Messages d'erreur par défaut de Zod en français.
z.config(z.locales.fr());

export const INDICATIFS = [
  { code: "+225", pays: "Côte d'Ivoire" },
  { code: "+229", pays: "Bénin" },
  { code: "+226", pays: "Burkina Faso" },
  { code: "+245", pays: "Guinée-Bissau" },
  { code: "+223", pays: "Mali" },
  { code: "+227", pays: "Niger" },
  { code: "+221", pays: "Sénégal" },
  { code: "+228", pays: "Togo" },
  { code: "+224", pays: "Guinée" },
  { code: "+233", pays: "Ghana" },
  { code: "+234", pays: "Nigeria" },
  { code: "+237", pays: "Cameroun" },
  { code: "+212", pays: "Maroc" },
  { code: "+33", pays: "France" },
  { code: "+32", pays: "Belgique" },
  { code: "+41", pays: "Suisse" },
  { code: "+44", pays: "Royaume-Uni" },
  { code: "+1", pays: "États-Unis / Canada" },
  { code: "+971", pays: "Émirats arabes unis" },
] as const;

export const HORIZONS = {
  moins6mois: "Moins de 6 mois",
  "6a24mois": "6 à 24 mois",
  plus2ans: "Plus de 2 ans",
} as const;
export type Horizon = keyof typeof HORIZONS;

const texte = (libelle: string, max = 120) =>
  z
    .string(`${libelle} : ce champ est obligatoire.`)
    .trim()
    .min(2, `${libelle} : 2 caractères minimum.`)
    .max(max, `${libelle} : ${max} caractères maximum.`);

export const champsContact = {
  nom: texte("Nom"),
  fonction: texte("Fonction"),
  entreprise: texte("Entreprise"),
  indicatif: z.string("Indicatif obligatoire.").regex(/^\+\d{1,4}$/, "Indicatif invalide."),
  telephone: z
    .string("Téléphone : ce champ est obligatoire.")
    .trim()
    .transform((v) => v.replace(/[\s.-]/g, ""))
    .pipe(z.string().regex(/^\d{6,15}$/, "Numéro de téléphone invalide (chiffres uniquement).")),
  email: z.string("E-mail : ce champ est obligatoire.").trim().toLowerCase().pipe(z.email("Adresse e-mail invalide.")),
  consentement: z.literal(true, "Votre accord est nécessaire pour traiter votre demande."),
};

export const horizonSchema = z.enum(Object.keys(HORIZONS) as [Horizon, ...Horizon[]], "Veuillez choisir un horizon.");

/** Champs techniques de sécurité, communs à tous les formulaires. */
export const champsSecurite = {
  /** Jeton Cloudflare Turnstile. */
  turnstileToken: z.string().max(4096).optional().default(""),
  /** Champ piège (« honeypot ») : doit rester vide. */
  siteWeb: z.string().max(200).optional().default(""),
};

/**
 * Transforme les erreurs Zod en dictionnaire { champ: message }
 * (premier message par champ, chemin joint par des points).
 */
export function erreursParChamp(erreur: z.ZodError): Record<string, string> {
  const res: Record<string, string> = {};
  for (const issue of erreur.issues) {
    const cle = issue.path.join(".");
    if (!(cle in res)) res[cle] = issue.message;
  }
  return res;
}
