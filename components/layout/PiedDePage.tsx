"use client";

import Image from "next/image";
import Link from "next/link";
import { lienWhatsApp, navigation, site } from "@/config/site";
import { useConsentement } from "./Consentement";

export function PiedDePage() {
  const { rouvrir } = useConsentement();
  const whatsapp = lienWhatsApp();
  const annee = new Date().getFullYear();

  return (
    <footer className="border-t border-bordure bg-fond">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Image src="/logo.png" alt="BIP Corporate Finance" width={220} height={54} className="h-12 w-auto" />
          <p className="mt-5 max-w-md text-base text-gris">
            Conseil indépendant en fusions-acquisitions pour les PME et ETI en Côte d&apos;Ivoire et dans la zone UEMOA.
          </p>
          <p className="mt-4 flex items-start gap-2 text-base font-semibold text-anthracite">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 shrink-0 text-rouge">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            {site.mentionConfidentialite}
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-base">Navigation</h2>
          <ul className="space-y-2 text-base">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-gris hover:text-rouge">
                  {item.libelle}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/simulateur" className="text-gris hover:text-rouge">Simulateur de valorisation</Link>
            </li>
            <li>
              <Link href="/score-cession" className="text-gris hover:text-rouge">Score de préparation</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-base">Contact</h2>
          <address className="space-y-2 text-base text-gris not-italic">
            <p>Bridge Investment Partners</p>
            <p>{site.coordonnees.adresse}</p>
            <p>Tél. : {site.coordonnees.telephone}</p>
            <p>E-mail : {site.coordonnees.email}</p>
          </address>
          <ul className="mt-4 flex flex-wrap gap-4 text-base">
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-anthracite hover:text-rouge">WhatsApp</a>
              </li>
            )}
            {site.reseaux.linkedin && (
              <li>
                <a href={site.reseaux.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-anthracite hover:text-rouge">LinkedIn</a>
              </li>
            )}
            {site.reseaux.facebook && (
              <li>
                <a href={site.reseaux.facebook} target="_blank" rel="noopener noreferrer" className="font-semibold text-anthracite hover:text-rouge">Facebook</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-bordure">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-gris sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {annee} BIP – Bridge Investment Partners</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/mentions-legales" className="hover:text-rouge">Mentions légales</Link></li>
            <li><Link href="/confidentialite" className="hover:text-rouge">Politique de confidentialité</Link></li>
            <li>
              <button type="button" onClick={rouvrir} className="underline-offset-2 hover:text-rouge hover:underline">
                Gérer les cookies
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
