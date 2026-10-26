/** Événement d'installation proposé par le navigateur (Chrome, Edge, Android). */
export interface InvitationInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __bipInvitation?: InvitationInstallation | null;
  }
}

export const EVENEMENT_INSTALLABLE = "bip-installable";
