import type { Metadata } from "next";
import { CarteArticle } from "@/components/sections/CarteArticle";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { listerArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Analyses : évaluation, cession et transmission de PME",
  description:
    "Articles pédagogiques sur l'évaluation d'entreprise, la cession et la transmission de PME en Côte d'Ivoire, et bientôt le baromètre des PME ivoiriennes.",
  alternates: { canonical: "/analyses" },
};

export default function Analyses() {
  const articles = listerArticles();
  return (
    <>
      <PageHero
        surtitre="Analyses"
        titre="Comprendre la valeur de votre entreprise"
        intro="Des analyses pédagogiques pour les dirigeants qui préparent une cession, une transmission ou une ouverture de capital. Prochainement : le baromètre des PME ivoiriennes."
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <CarteArticle key={a.slug} article={a} />
          ))}
        </div>
      </Section>
    </>
  );
}
