import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, articles } from "@/content/analyses";
import { site } from "@/config/site";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { Container } from "@/components/ui/Container";
import { formaterDate, trouverArticle } from "@/lib/articles";
import { JsonLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = trouverArticle(slug);
  if (!article) return {};
  return {
    title: article.titre,
    description: article.description,
    alternates: { canonical: `/analyses/${slug}` },
    openGraph: { type: "article", title: article.titre, description: article.description, publishedTime: article.date },
  };
}

export default async function PageArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = trouverArticle(slug);
  if (!article) notFound();
  const { default: Contenu } = await import(`@/content/analyses/${slug}.mdx`);

  const url = `${site.url}/analyses/${slug}`;
  const partageLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const partageWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${article.titre} — ${url}`)}`;

  return (
    <>
      <article className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <nav aria-label="Fil d'Ariane" className="mb-6 text-base text-gris">
            <Link href="/analyses" className="hover:text-rouge">Analyses</Link> <span aria-hidden="true">›</span> {CATEGORIES[article.categorie]}
          </nav>
          <h1 className="souligne-bip text-3xl sm:text-4xl">{article.titre}</h1>
          <p className="mt-6 text-base text-gris">
            <time dateTime={article.date}>{formaterDate(article.date)}</time> · {article.tempsLecture} min de lecture
          </p>
          <div className="prose-bip mt-10 text-lg text-anthracite/90">
            <Contenu />
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-bordure pt-6">
            <span className="font-semibold">Partager :</span>
            <a href={partageLinkedIn} target="_blank" rel="noopener noreferrer" className="rounded-md border border-bordure px-4 py-2 font-semibold hover:border-rouge hover:text-rouge">
              LinkedIn
            </a>
            <a href={partageWhatsApp} target="_blank" rel="noopener noreferrer" className="rounded-md border border-bordure px-4 py-2 font-semibold hover:border-rouge hover:text-rouge">
              WhatsApp
            </a>
          </div>
        </Container>
      </article>
      <AppelFinal />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.titre,
          description: article.description,
          datePublished: article.date,
          inLanguage: "fr",
          publisher: { "@type": "Organization", name: site.nomComplet, logo: { "@type": "ImageObject", url: `${site.url}/logo.png` } },
          mainEntityOfPage: url,
        }}
      />
    </>
  );
}
