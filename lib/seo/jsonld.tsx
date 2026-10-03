import { site } from "@/config/site";

/** Insère des données structurées schema.org (JSON-LD). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Échappement de « < » pour éviter toute injection dans la balise script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const donneesProfessionalService = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.nomComplet,
  description: site.description,
  url: site.url,
  logo: `${site.url}/logo.png`,
  image: `${site.url}/opengraph-image`,
  foundingDate: String(site.anneeCreation),
  areaServed: ["Côte d'Ivoire", "UEMOA"],
  telephone: site.coordonnees.telephone,
  email: site.coordonnees.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.coordonnees.quartier,
    addressLocality: "Abidjan",
    addressCountry: "CI",
  },
  knowsAbout: [
    "Fusions-acquisitions",
    "Évaluation d'entreprise",
    "Cession et transmission d'entreprise",
    "Levée de fonds",
  ],
};
