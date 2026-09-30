"use client";

import Link from "next/link";
import { useConsentement } from "./Consentement";

/** Bandeau cookies : refuser est aussi simple qu'accepter. */
export function BandeauCookies() {
  const { bandeauOuvert, enregistrer } = useConsentement();
  if (!bandeauOuvert) return null;
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookies-titre"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-bordure bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-base">
          <p id="cookies-titre" className="font-titre font-semibold text-anthracite">
            Mesure d&apos;audience
          </p>
          <p className="text-gris">
            Avec votre accord, nous utilisons Google Analytics et Meta Pixel pour mesurer la fréquentation du site.
            Aucun cookie de mesure n&apos;est déposé sans votre accord. Vos données financières ne sont jamais transmises à ces outils.{" "}
            <Link href="/confidentialite" className="text-rouge underline underline-offset-2">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => enregistrer("refuse")}
            className="min-h-12 flex-1 rounded-md border-2 border-anthracite px-5 font-titre font-semibold text-anthracite hover:border-rouge hover:text-rouge lg:flex-none"
          >
            Tout refuser
          </button>
          <button
            type="button"
            onClick={() => enregistrer("accepte")}
            className="min-h-12 flex-1 rounded-md border-2 border-anthracite bg-anthracite px-5 font-titre font-semibold text-white hover:bg-black lg:flex-none"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
