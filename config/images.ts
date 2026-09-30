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
  accueil: { src: null, alt: "Vue du Plateau, quartier d'affaires d'Abidjan", credit: null },
  ceder: { src: null, alt: "Réunion d'affaires dans un bureau à Abidjan", credit: null },
  investir: { src: null, alt: "Pont et lagune Ébrié à Abidjan", credit: null },
  leverDesFonds: { src: null, alt: "Échange autour d'un plan d'affaires", credit: null },
  aPropos: { src: null, alt: "Bureaux modernes à Abidjan", credit: null },
};
