import { lienWhatsApp } from "@/config/site";
import { IconeWhatsApp } from "@/components/ui/Icones";

/** Bouton WhatsApp flottant, présent sur toutes les pages. */
export function BoutonWhatsApp() {
  const lien = lienWhatsApp();
  if (!lien) return null; // Numéro non configuré (NEXT_PUBLIC_WHATSAPP_NUMBER)
  return (
    <a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Échanger avec BIP sur WhatsApp (nouvelle fenêtre)"
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f4e] text-white shadow-lg transition hover:scale-105 hover:bg-[#177a41] sm:right-6 sm:bottom-6"
    >
      <IconeWhatsApp />
    </a>
  );
}
