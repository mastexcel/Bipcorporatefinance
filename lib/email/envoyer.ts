import "server-only";
import { Resend } from "resend";

export class ConfigurationEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationEmailError";
  }
}

export interface Email {
  a: string | string[];
  sujet: string;
  html: string;
  texte: string;
  repondreA?: string;
}

/** Destinataires BIP (variable EMAIL_TO, adresses séparées par des virgules). */
export function destinatairesBIP(): string[] {
  return (process.env.EMAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Envoi via Resend.
 * Sans clé en développement, l'e-mail est « simulé » : seuls le destinataire
 * et le sujet sont affichés dans la console (jamais le contenu).
 */
export async function envoyerEmail(email: Email): Promise<void> {
  const cle = process.env.RESEND_API_KEY;
  const expediteur = process.env.EMAIL_FROM;
  const destinataires = Array.isArray(email.a) ? email.a : [email.a];

  if (!cle || !expediteur || destinataires.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[e-mail simulé] ${destinataires.length} destinataire(s) — « ${email.sujet} »`);
      return;
    }
    throw new ConfigurationEmailError("RESEND_API_KEY, EMAIL_FROM ou EMAIL_TO manquant.");
  }

  const resend = new Resend(cle);
  const { error } = await resend.emails.send({
    from: expediteur,
    to: destinataires,
    subject: email.sujet,
    html: email.html,
    text: email.texte,
    replyTo: email.repondreA,
  });
  if (error) throw new Error(`Resend : ${error.name}`);
}
