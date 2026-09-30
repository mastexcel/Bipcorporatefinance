import "server-only";

/**
 * Vérification côté serveur du jeton Cloudflare Turnstile.
 * - sans clé secrète en développement : vérification ignorée (avertissement) ;
 * - sans clé secrète en production : refus (configuration incomplète).
 */
export async function verifierTurnstile(jeton: string, ip: string | null): Promise<"ok" | "invalide" | "non_configure"> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY absente : vérification ignorée en développement.");
      return "ok";
    }
    return "non_configure";
  }
  if (!jeton) return "invalide";

  const corps = new URLSearchParams({ secret, response: jeton });
  if (ip) corps.set("remoteip", ip);
  try {
    const rep = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: corps,
      signal: AbortSignal.timeout(8000),
    });
    const json = (await rep.json()) as { success?: boolean };
    return json.success ? "ok" : "invalide";
  } catch {
    return "invalide";
  }
}
