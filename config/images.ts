/**
 * Emplacements photo du site.
 *
 * `src` : chemin local (ex. "/images/abidjan.jpg", fichier dans public/images)
 * ou URL Unsplash (images.unsplash.com est autorisé dans next.config.ts).
 * Tant que `src` vaut null, un visuel neutre aux couleurs de BIP est affiché.
 *
 * Règle BIP : aucune photo de personne ne doit être présentée comme membre de
 * l'équipe ou client. Ces images sont purement illustratives.
 * Penser à renseigner `credit` (photographe + lien Unsplash) : il est repris
 * dans le README.
 */
export interface EmplacementImage {
  src: string | null;
  alt: string;
  credit: string | null;
}

export const images: Record<
  "accueil" | "ceder" | "investir" | "leverDesFonds" | "aPropos",
  EmplacementImage
> = {
  accueil: {
    src: "/images/accueil-intervention.webp",
    alt: "Jean-Jacques ATTEMENE ZATRI, directeur général de BIP, intervenant lors du Japan Innovation Tour 2026 à Abidjan",
    credit: "BIP – Japan Innovation Tour 2026",
  },
  ceder: {
    src: "/images/ceder-echange.webp",
    alt: "Échange entre dirigeants en marge d'une conférence organisée par BIP",
    credit: "BIP – Japan Innovation Tour 2026",
  },
  investir: {
    src: "/images/investir-conference.webp",
    alt: "Dirigeants et investisseurs réunis lors d'une conférence organisée par BIP à Abidjan",
    credit: "BIP – Japan Innovation Tour 2026",
  },
  leverDesFonds: {
    src: "/images/lever-des-fonds-panel.webp",
    alt: "Panel « Quels enseignements pour l'Afrique ? » avec Jean-Jacques ATTEMENE ZATRI, Japan Innovation Tour 2026",
    credit: "BIP – Japan Innovation Tour 2026",
  },
  aPropos: {
    src: "/images/a-propos-groupe.webp",
    alt: "Participants et intervenants du Japan Innovation Tour 2026 organisé par Bridge Investment Partners",
    credit: "BIP – Japan Innovation Tour 2026",
  },
};
