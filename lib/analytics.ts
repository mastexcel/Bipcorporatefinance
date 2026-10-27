/**
 * Événements de conversion (GA4 et Meta Pixel).
 * Les scripts ne sont chargés qu'après consentement (components/layout/Analytics.tsx) :
 * sans consentement, ces fonctions n'envoient rien.
 * Aucune donnée financière n'est jamais transmise dans ces événements.
 */

export type EvenementConversion =
  | "simulation_commencee"
  | "simulation_terminee"
  | "coordonnees_envoyees"
  | "score_commence"
  | "score_termine";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function suivre(evenement: EvenementConversion, parametres: Record<string, string> = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", evenement, parametres);
  if (evenement === "coordonnees_envoyees") window.fbq?.("track", "Lead");
  else window.fbq?.("trackCustom", evenement);
}
