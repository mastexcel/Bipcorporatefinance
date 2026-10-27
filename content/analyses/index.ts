/**
 * Registre des articles (rubrique Analyses).
 * Pour ajouter un article : créer content/analyses/<slug>.mdx puis ajouter
 * une entrée ci-dessous (voir README).
 */
export const CATEGORIES = {
  evaluation: "Évaluation",
  cession: "Cession et transmission",
  investissement: "Investissement",
  barometre: "Baromètre des PME",
} as const;
export type Categorie = keyof typeof CATEGORIES;

export interface MetaArticle {
  slug: string;
  titre: string;
  description: string;
  categorie: Categorie;
  /** Date de publication (AAAA-MM-JJ). */
  date: string;
}

export const articles: MetaArticle[] = [
  {
    slug: "trois-methodes-evaluer-pme",
    titre: "Les 3 méthodes pour évaluer une PME, expliquées simplement",
    description:
      "Multiples, flux de trésorerie, actif net : ce que recouvre chacune des trois approches reconnues par les normes internationales, et pourquoi une évaluation sérieuse les croise.",
    categorie: "evaluation",
    date: "2026-09-30",
  },
  {
    slug: "ebe-retraite",
    titre: "EBE retraité : pourquoi l'acquéreur ne regarde pas votre résultat comptable",
    description:
      "Rémunération du dirigeant, éléments exceptionnels, loyers entre parties liées : comment un acquéreur reconstitue la rentabilité normale de votre entreprise.",
    categorie: "evaluation",
    date: "2026-09-30",
  },
  {
    slug: "sept-erreurs-cession",
    titre: "Céder son entreprise : les 7 erreurs qui font baisser le prix",
    description:
      "Préparation tardive, comptes fragiles, dépendance au dirigeant, confidentialité mal gérée… Les erreurs les plus fréquentes et comment les éviter.",
    categorie: "cession",
    date: "2026-09-30",
  },
];
