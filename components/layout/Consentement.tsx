"use client";

import { ATTRIBUT, CLE_CONSENTEMENT } from "@/lib/consentement";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Gestion du consentement aux cookies de mesure d'audience.
 * Le choix est conservé dans le navigateur (localStorage) ; aucun traceur
 * n'est chargé avant un consentement explicite.
 */
type Choix = "accepte" | "refuse";
const CLE = CLE_CONSENTEMENT;

interface ContexteConsentement {
  choix: Choix | null;
  /** true tant que le choix enregistré n'a pas été lu (évite un flash du bandeau). */
  chargement: boolean;
  bandeauOuvert: boolean;
  enregistrer: (c: Choix) => void;
  rouvrir: () => void;
}

const Ctx = createContext<ContexteConsentement | null>(null);

export function ConsentementProvider({ children }: { children: ReactNode }) {
  const [choix, setChoix] = useState<Choix | null>(null);
  const [chargement, setChargement] = useState(true);
  // Ouvert par défaut : le bandeau fait partie du HTML initial (affichage immédiat,
  // sans attendre le JavaScript). Pour un visiteur ayant déjà choisi, il est
  // masqué avant affichage par le script de app/layout.tsx (attribut
  // data-consentement sur <html>), puis fermé ici.
  const [bandeauOuvert, setBandeauOuvert] = useState(true);

  useEffect(() => {
    let lu: string | null = null;
    try {
      lu = window.localStorage.getItem(CLE);
    } catch {
      // Stockage indisponible (navigation privée) : on redemandera.
    }
    if (lu === "accepte" || lu === "refuse") {
      setChoix(lu);
      setBandeauOuvert(false);
    }
    setChargement(false);
  }, []);

  const enregistrer = useCallback((c: Choix) => {
    const retrait = choix === "accepte" && c === "refuse";
    setChoix(c);
    setBandeauOuvert(false);
    document.documentElement.setAttribute(ATTRIBUT, c);
    try {
      window.localStorage.setItem(CLE, c);
    } catch {
      // Sans stockage, le choix vaut pour la session en cours.
    }
    // Retrait du consentement : on recharge pour décharger les scripts.
    if (retrait) window.location.reload();
  }, [choix]);

  const rouvrir = useCallback(() => {
    document.documentElement.removeAttribute(ATTRIBUT);
    setBandeauOuvert(true);
  }, []);

  return <Ctx.Provider value={{ choix, chargement, bandeauOuvert, enregistrer, rouvrir }}>{children}</Ctx.Provider>;
}

export function useConsentement(): ContexteConsentement {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useConsentement doit être utilisé dans ConsentementProvider");
  return ctx;
}
