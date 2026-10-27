"use client";

import { useEffect, useRef } from "react";

const CLE_SITE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let chargement: Promise<void> | null = null;
function chargerScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  chargement ??= new Promise((resoudre, rejeter) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resoudre();
    s.onerror = () => {
      chargement = null;
      rejeter(new Error("Turnstile indisponible"));
    };
    document.head.appendChild(s);
  });
  return chargement;
}

/**
 * Widget Cloudflare Turnstile (anti-spam). Sans clé de site configurée
 * (développement), rien n'est affiché et le serveur ignore la vérification.
 * `version` : incrémenter pour réinitialiser le widget après un envoi.
 */
export function Turnstile({ onJeton, version = 0 }: { onJeton: (jeton: string) => void; version?: number }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const rappel = useRef(onJeton);
  rappel.current = onJeton;

  useEffect(() => {
    if (!CLE_SITE || !conteneur.current) return;
    let id: string | null = null;
    let actif = true;
    chargerScript()
      .then(() => {
        if (!actif || !conteneur.current || !window.turnstile) return;
        id = window.turnstile.render(conteneur.current, {
          sitekey: CLE_SITE,
          language: "fr",
          callback: (j: string) => rappel.current(j),
          "expired-callback": () => rappel.current(""),
          "error-callback": () => rappel.current(""),
        });
      })
      .catch(() => rappel.current(""));
    return () => {
      actif = false;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [version]);

  if (!CLE_SITE) return null;
  return <div ref={conteneur} className="min-h-[65px]" />;
}
