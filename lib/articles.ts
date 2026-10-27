import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { articles, type MetaArticle } from "@/content/analyses";

export interface Article extends MetaArticle {
  /** Temps de lecture estimé, en minutes (≈ 200 mots/minute). */
  tempsLecture: number;
}

function tempsLecture(slug: string): number {
  const texte = readFileSync(path.join(process.cwd(), "content/analyses", `${slug}.mdx`), "utf8");
  const mots = texte.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 200));
}

/** Articles triés du plus récent au plus ancien. */
export function listerArticles(): Article[] {
  return [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((a) => ({ ...a, tempsLecture: tempsLecture(a.slug) }));
}

export function trouverArticle(slug: string): Article | undefined {
  return listerArticles().find((a) => a.slug === slug);
}

export function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
