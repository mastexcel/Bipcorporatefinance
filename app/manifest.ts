import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Manifeste de l'application installable (téléphone, tablette, ordinateur). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: site.nomComplet,
    short_name: "BIP CF",
    description: site.description,
    lang: "fr",
    dir: "ltr",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#12131a",
    theme_color: "#12131a",
    categories: ["business", "finance", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Estimer mon entreprise",
        short_name: "Simulateur",
        description: "Fourchette de valeur indicative en 5 étapes",
        url: "/simulateur?source=app",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Score de préparation à la cession",
        short_name: "Score",
        description: "15 questions et vos 3 actions prioritaires",
        url: "/score-cession?source=app",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Contacter un associé",
        short_name: "Contact",
        url: "/contact?source=app",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
