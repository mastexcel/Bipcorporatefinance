"use client";

import { useEffect } from "react";
import { EVENEMENT_INSTALLABLE, type InvitationInstallation } from "@/lib/application";

/**
 * Enregistre le service worker (en production) et conserve l'invitation
 * d'installation du navigateur pour la page « Installer l'application ».
 */
export function Application() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
    const surInvitation = (e: Event) => {
      e.preventDefault();
      window.__bipInvitation = e as InvitationInstallation;
      window.dispatchEvent(new Event(EVENEMENT_INSTALLABLE));
    };
    const surInstallee = () => {
      window.__bipInvitation = null;
      window.dispatchEvent(new Event(EVENEMENT_INSTALLABLE));
    };
    window.addEventListener("beforeinstallprompt", surInvitation);
    window.addEventListener("appinstalled", surInstallee);
    return () => {
      window.removeEventListener("beforeinstallprompt", surInvitation);
      window.removeEventListener("appinstalled", surInstallee);
    };
  }, []);
  return null;
}
