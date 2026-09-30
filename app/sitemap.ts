import type { MetadataRoute } from "next";
import { articles } from "@/content/analyses";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { chemin: string; priorite: number }[] = [
    { chemin: "", priorite: 1 },
    { chemin: "/simulateur", priorite: 0.9 },
    { chemin: "/ceder", priorite: 0.9 },
    { chemin: "/score-cession", priorite: 0.8 },
    { chemin: "/investir", priorite: 0.8 },
    { chemin: "/lever-des-fonds", priorite: 0.7 },
    { chemin: "/methode", priorite: 0.7 },
    { chemin: "/references", priorite: 0.6 },
    { chemin: "/analyses", priorite: 0.6 },
    { chemin: "/a-propos", priorite: 0.6 },
    { chemin: "/contact", priorite: 0.7 },
    { chemin: "/mentions-legales", priorite: 0.2 },
    { chemin: "/confidentialite", priorite: 0.2 },
  ];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p.chemin}`, changeFrequency: "monthly" as const, priority: p.priorite })),
    ...articles.map((a) => ({ url: `${site.url}/analyses/${a.slug}`, lastModified: a.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
