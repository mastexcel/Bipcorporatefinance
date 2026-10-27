/**
 * Limitation du nombre d'envois par adresse IP (fenêtre glissante, en mémoire).
 *
 * Limite : sur Vercel, chaque instance serveur a sa propre mémoire ; la
 * limitation est donc « au mieux ». Elle complète Turnstile et le champ
 * piège. Pour une limitation stricte, brancher un stockage partagé
 * (ex. Upstash Redis) — voir README.
 */
const envois = new Map<string, number[]>();

export function limiteAtteinte(cle: string, maximum: number, fenetreMs: number, maintenant = Date.now()): boolean {
  const recents = (envois.get(cle) ?? []).filter((t) => maintenant - t < fenetreMs);
  if (recents.length >= maximum) {
    envois.set(cle, recents);
    return true;
  }
  recents.push(maintenant);
  envois.set(cle, recents);

  // Nettoyage occasionnel pour éviter que la mémoire ne grossisse.
  if (envois.size > 5000) {
    for (const [k, v] of envois) if (v.every((t) => maintenant - t >= fenetreMs)) envois.delete(k);
  }
  return false;
}

/** Réinitialisation (tests uniquement). */
export function reinitialiserLimites() {
  envois.clear();
}
