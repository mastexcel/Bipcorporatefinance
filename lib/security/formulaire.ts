import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { erreursParChamp } from "@/lib/schemas/commun";
import { limiteAtteinte } from "./rateLimit";
import { verifierTurnstile } from "./turnstile";
import { ConfigurationEmailError } from "@/lib/email/envoyer";

const TAILLE_MAX = 64 * 1024; // 64 Ko
const ENVOIS_MAX = 5;
const FENETRE_MS = 10 * 60 * 1000; // 5 envois par tranche de 10 minutes et par IP

export interface ReponseFormulaire {
  ok: boolean;
  message?: string;
  erreurs?: Record<string, string>;
}

const repondre = (corps: ReponseFormulaire, status: number) => NextResponse.json(corps, { status });

function adresseIP(req: Request): string | null {
  const transmise = req.headers.get("x-forwarded-for");
  return transmise?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
}

/**
 * Chaîne de traitement commune à tous les formulaires :
 * taille → JSON → champ piège → limitation par IP → validation Zod → Turnstile → traitement.
 *
 * Journalisation : seuls le nom du formulaire et le type d'erreur sont
 * journalisés, JAMAIS le contenu (aucune donnée personnelle ni financière).
 */
export async function traiterFormulaire<S extends z.ZodType<{ turnstileToken: string; siteWeb: string }>>(
  req: Request,
  nom: string,
  schema: S,
  traiter: (donnees: z.infer<S>) => Promise<void>,
): Promise<NextResponse<ReponseFormulaire>> {
  const longueur = Number(req.headers.get("content-length") ?? 0);
  if (longueur > TAILLE_MAX) return repondre({ ok: false, message: "Requête trop volumineuse." }, 413);

  let brut: unknown;
  try {
    const texte = await req.text();
    if (texte.length > TAILLE_MAX) return repondre({ ok: false, message: "Requête trop volumineuse." }, 413);
    brut = JSON.parse(texte);
  } catch {
    return repondre({ ok: false, message: "Requête invalide." }, 400);
  }

  // Champ piège rempli : robot. On simule un succès sans rien envoyer.
  if (typeof brut === "object" && brut !== null && "siteWeb" in brut && (brut as { siteWeb: unknown }).siteWeb) {
    console.info(`[formulaire:${nom}] envoi ignoré (champ piège).`);
    return repondre({ ok: true }, 200);
  }

  const ip = adresseIP(req);
  if (limiteAtteinte(`${nom}:${ip ?? "inconnue"}`, ENVOIS_MAX, FENETRE_MS)) {
    return repondre({ ok: false, message: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes." }, 429);
  }

  const resultat = schema.safeParse(brut);
  if (!resultat.success) {
    return repondre({ ok: false, message: "Certains champs sont invalides.", erreurs: erreursParChamp(resultat.error) }, 400);
  }

  const verification = await verifierTurnstile(resultat.data.turnstileToken, ip);
  if (verification === "non_configure") {
    console.error(`[formulaire:${nom}] Turnstile non configuré.`);
    return repondre({ ok: false, message: "Service momentanément indisponible. Merci de nous contacter par téléphone ou WhatsApp." }, 503);
  }
  if (verification === "invalide") {
    return repondre({ ok: false, message: "La vérification anti-spam a échoué. Merci de réessayer." }, 400);
  }

  try {
    await traiter(resultat.data);
    return repondre({ ok: true }, 200);
  } catch (e) {
    const type = e instanceof ConfigurationEmailError ? "configuration e-mail" : e instanceof Error ? e.name : "inconnue";
    console.error(`[formulaire:${nom}] échec de l'envoi (${type}).`);
    return repondre(
      { ok: false, message: "L'envoi a échoué. Merci de réessayer ou de nous contacter par téléphone ou WhatsApp." },
      e instanceof ConfigurationEmailError ? 503 : 500,
    );
  }
}
