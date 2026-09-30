/**
 * Informations générales du site.
 * Les valeurs « [À COMPLÉTER] » sont listées dans A_COMPLETER.md.
 */

export const A_COMPLETER = "[À COMPLÉTER]";

export const site = {
  nom: "BIP Corporate Finance",
  nomComplet: "BIP Corporate Finance — Bridge Investment Partners",
  /** Adresse officielle validée par BIP le 30/09/2026 (NEXT_PUBLIC_SITE_URL la remplace si elle est définie). */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://corporatefinance.bridgeinvestmentpartners.net").replace(/\/$/, ""),
  description:
    "Conseil indépendant en fusions-acquisitions pour les PME et ETI en Côte d'Ivoire et dans l'UEMOA : valorisation, cession, transmission, levée de fonds.",
  promesse:
    "Nous révélons la vraie valeur de votre entreprise et trouvons le bon acquéreur, en toute confidentialité.",
  anneeCreation: 2022,
  gerant: "M. ATTEMENE Zatri Jean-Jacques",
  coordonnees: {
    adresse: "Riviera Faya Akouédo, Cocody, Abidjan",
    quartier: "Lot 100, îlot 101, Riviera Faya Akouédo, Cocody",
    ville: "Abidjan",
    pays: "Côte d'Ivoire",
    /** Même numéro que le WhatsApp. */
    telephone: "+225 05 84 37 48 48",
    telephoneLien: "tel:+2250584374848",
    email: "contact@bridgeinvestmentpartners.net",
  },
  reseaux: {
    linkedin: "" as string, // [À COMPLÉTER] URL de la page LinkedIn
    facebook: "" as string, // [À COMPLÉTER] URL de la page Facebook
  },
  whatsapp: {
    /**
     * Numéro international, chiffres uniquement. Par défaut le WhatsApp de BIP
     * (+225 05 84 37 48 48) ; la variable NEXT_PUBLIC_WHATSAPP_NUMBER le remplace si elle est définie.
     */
    numero: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2250584374848",
    /** Numéro tel qu'affiché sur le site. */
    affichage: "+225 05 84 37 48 48",
    message:
      "Bonjour BIP, je souhaite échanger en toute confidentialité sur un projet concernant mon entreprise.",
  },
  /** Informations légales (RCCM et déclaration fiscale d'existence). */
  societe: {
    denomination: "Bridge Investment Partners (BIP)",
    formeJuridique: "Société à responsabilité limitée (SARL)",
    capital: "3 000 000 FCFA",
    rccm: "CI-ABJ-03-2022-B12-00279",
    dateImmatriculation: "27 avril 2022",
    compteContribuable: "2205980 D",
    siege: "Lot 100, îlot 101, Riviera Faya Akouédo, commune de Cocody, Abidjan, Côte d'Ivoire",
    directeurPublication: "M. ATTEMENE Zatri Jean-Jacques, gérant",
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
