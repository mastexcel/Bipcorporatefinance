"use client";

import { useEffect, useRef } from "react";
import type { EtatEnvoi } from "./useEnvoi";

/** Messages de succès / d'erreur, annoncés aux lecteurs d'écran. */
export function RetourEnvoi({ etat, message, succes }: { etat: EtatEnvoi; message: string | null; succes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (etat === "succes" || etat === "erreur") ref.current?.focus();
  }, [etat]);
  if (etat === "succes") {
    return (
      <div ref={ref} tabIndex={-1} role="status" className="rounded-lg border border-[#1f8f4e] bg-[#eef8f2] p-5 text-anthracite">
        <p className="font-titre font-semibold">Merci, votre demande a bien été envoyée.</p>
        <p className="mt-1 text-base">{succes}</p>
      </div>
    );
  }
  if (etat === "erreur" && message) {
    return (
      <div ref={ref} tabIndex={-1} role="alert" className="rounded-lg border border-rouge bg-[#fff4ef] p-4 text-base text-rouge-fonce">
        {message}
      </div>
    );
  }
  return null;
}
