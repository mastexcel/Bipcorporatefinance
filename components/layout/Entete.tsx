"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/config/site";
import { classesBouton } from "@/components/ui/Button";

export function Entete() {
  const [ouvert, setOuvert] = useState(false);
  const chemin = usePathname();

  // Fermer le menu mobile à chaque changement de page.
  useEffect(() => setOuvert(false), [chemin]);

  // Fermer le menu avec la touche Échap.
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ouvert]);

  const actif = (href: string) => chemin === href || chemin.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-bordure bg-white/95 backdrop-blur">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:p-2">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="BIP Corporate Finance — accueil">
          <Image src="/logo.png" alt="BIP Corporate Finance" width={184} height={45} priority className="h-10 w-auto sm:h-11" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-5 text-[0.95rem] font-medium">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={actif(item.href) ? "page" : undefined}
                  className={`py-2 transition hover:text-rouge ${actif(item.href) ? "text-rouge" : "text-anthracite"}`}
                >
                  {item.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <Link href="/simulateur" className={classesBouton("principal", "px-4")}>
              Estimer mon entreprise
            </Link>
          </span>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-bordure xl:hidden"
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            onClick={() => setOuvert((o) => !o)}
          >
            <span className="sr-only">{ouvert ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {ouvert ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-bordure bg-white xl:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={actif(item.href) ? "page" : undefined}
                  className={`block border-b border-bordure py-3 text-lg ${actif(item.href) ? "text-rouge" : "text-anthracite"}`}
                >
                  {item.libelle}
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <Link href="/simulateur" className={classesBouton("principal", "w-full")}>
                Estimer mon entreprise
              </Link>
            </li>
            <li className="pb-2">
              <Link href="/score-cession" className={classesBouton("secondaire", "w-full")}>
                Score de préparation à la cession
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
