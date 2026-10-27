"use client";

import { useState } from "react";

export type EtatEnvoi = "repos" | "envoi" | "succes" | "erreur";

interface ReponseServeur {
  ok: boolean;
  message?: string;
  erreurs?: Record<string, string>;
}

/** Envoi JSON vers une route serveur, avec gestion des états et des erreurs. */
export function useEnvoi(url: string) {
  const [etat, setEtat] = useState<EtatEnvoi>("repos");
  const [message, setMessage] = useState<string | null>(null);
  const [erreursServeur, setErreursServeur] = useState<Record<string, string>>({});

  async function envoyer(corps: unknown): Promise<boolean> {
    setEtat("envoi");
    setMessage(null);
    setErreursServeur({});
    try {
      const rep = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      const json = (await rep.json().catch(() => ({ ok: false }))) as ReponseServeur;
      if (rep.ok && json.ok) {
        setEtat("succes");
        return true;
      }
      setEtat("erreur");
      setMessage(json.message ?? "L'envoi a échoué. Merci de réessayer.");
      setErreursServeur(json.erreurs ?? {});
      return false;
    } catch {
      setEtat("erreur");
      setMessage("Connexion impossible. Vérifiez votre réseau et réessayez.");
      return false;
    }
  }

  return { etat, message, erreursServeur, envoyer };
}
