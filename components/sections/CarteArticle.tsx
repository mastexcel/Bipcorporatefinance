import Link from "next/link";
import { CATEGORIES } from "@/content/analyses";
import { formaterDate, type Article } from "@/lib/articles";

export function CarteArticle({ article }: { article: Article }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-bordure bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold tracking-wider text-rouge uppercase">{CATEGORIES[article.categorie]}</p>
      <h3 className="mt-3 text-xl">
        <Link href={`/analyses/${article.slug}`} className="hover:text-rouge">
          {article.titre}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-base text-gris">{article.description}</p>
      <p className="mt-5 text-sm text-gris">
        <time dateTime={article.date}>{formaterDate(article.date)}</time> · {article.tempsLecture} min de lecture
      </p>
    </article>
  );
}
