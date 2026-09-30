/**
 * Informations générales du site.
 * Les valeurs « [À COMPLÉTER] » sont listées dans A_COMPLETER.md.
 */

export const A_COMPLETER = "[À COMPLÉTER]";

export const site = {
  nom: "BIP Corporate Finance",
  nomComplet: "BIP Corporate Finance — Bridge Investment Partners",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Conseil indépendant en fusions-acquisitions pour les PME et ETI en Côte d'Ivoire et dans l'UEMOA : valorisation, cession, transmission, levée de fonds.",
  promesse:
    "Nous révélons la vraie valeur de votre entreprise et trouvons le bon acquéreur, en toute confidentialité.",
  anneeCreation: 2022,
  gerant: "M. ATTEMENE Zatri Jean-Jacques",
  coordonnees: {
    adresse: "[À CONFIRMER : Abidjan, Riviera Faya]",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    telephone: A_COMPLETER,
    email: A_COMPLETER,
  },
  reseaux: {
    linkedin: "" as string, // [À COMPLÉTER] URL de la page LinkedIn
    facebook: "" as string, // [À COMPLÉTER] URL de la page Facebook
  },
  whatsapp: {
    /** Numéro international, chiffres uniquement (variable NEXT_PUBLIC_WHATSAPP_NUMBER). */
    numero: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    message:
      "Bonjour BIP, je souhaite échanger en toute confidentialité sur un projet concernant mon entreprise.",
  },
  mentionConfidentialite: "Toutes les demandes sont traitées de manière strictement confidentielle.",
};

/** Lien WhatsApp avec message prérempli (null si le numéro n'est pas configuré). */
export function lienWhatsApp(message: string = site.whatsapp.message): string | null {
  const numero = site.whatsapp.numero.replace(/\D/g, "");
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

export const navigation = [
  { href: "/ceder", libelle: "Céder" },
  { href: "/investir", libelle: "Investir" },
  { href: "/lever-des-fonds", libelle: "Lever des fonds" },
  { href: "/methode", libelle: "Notre méthode" },
  { href: "/references", libelle: "Références" },
  { href: "/analyses", libelle: "Analyses" },
  { href: "/a-propos", libelle: "À propos" },
  { href: "/contact", libelle: "Contact" },
] as const;

export const motsCles = [
  "valorisation entreprise Côte d'Ivoire",
  "cession PME Abidjan",
  "transmission d'entreprise",
  "évaluation d'entreprise",
  "fusion acquisition Côte d'Ivoire",
  "levée de fonds Abidjan",
];
