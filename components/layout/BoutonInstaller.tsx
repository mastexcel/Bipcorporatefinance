"use client";

import { useEffect, useState } from "react";
import { EVENEMENT_INSTALLABLE } from "@/lib/application";
import { classesBouton } from "@/components/ui/Button";

type Etat = "inconnu" | "installee" | "proposee" | "manuelle";

/** Bouton d'installation, ou message adapté si l'installation se fait depuis le menu du navigateur. */
export function BoutonInstaller() {
  const [etat, setEtat] = useState<Etat>("inconnu");

  useEffect(() => {
    const maj = () => {
      if (window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone) {
        setEtat("installee");
      } else if (window.__bipInvitation) {
        setEtat("proposee");
      } else {
        setEtat("manuelle");
      }
    };
    maj();
    window.addEventListener(EVENEMENT_INSTALLABLE, maj);
    return () => window.removeEventListener(EVENEMENT_INSTALLABLE, maj);
  }, []);

  const installer = async () => {
    const invitation = window.__bipInvitation;
    if (!invitation) return;
    await invitation.prompt();
    const choix = await invitation.userChoice;
    window.__bipInvitation = null;
    setEtat(choix.outcome === "accepted" ? "installee" : "manuelle");
  };

  if (etat === "installee") {
    return (
      <p className="verre inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white">
        <span aria-hidden="true" className="text-or">✓</span> L&apos;application est installée sur cet appareil.
      </p>
    );
  }
  if (etat === "proposee") {
    return (
      <button type="button" onClick={installer} className={classesBouton("principal")}>
        Installer l&apos;application
      </button>
    );
  }
  return (
    <p className="max-w-xl text-base text-white/75" aria-live="polite">
      {etat === "manuelle" && "Pour installer l'application, suivez les étapes ci-dessous correspondant à votre appareil."}
    </p>
  );
}
