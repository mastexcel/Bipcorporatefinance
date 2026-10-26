import type { Metadata } from "next";
import { BoutonInstaller } from "@/components/layout/BoutonInstaller";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { PageHero } from "@/components/ui/PageHero";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Installer l'application sur téléphone, tablette et ordinateur",
  description:
    "Installez l'application BIP Corporate Finance sur votre téléphone, votre tablette ou votre ordinateur : simulateur de valorisation, score de préparation et contact en un geste.",
  alternates: { canonical: "/application" },
};

const atouts = [
  { titre: "Un accès en un geste", texte: "L'icône BIP sur votre écran d'accueil ouvre directement le simulateur, le score ou le contact." },
  { titre: "En plein écran", texte: "L'application s'ouvre dans sa propre fenêtre, sans barre d'adresse, comme une application classique." },
  { titre: "Légère et à jour", texte: "Rien à télécharger depuis un magasin d'applications : elle se met à jour toute seule." },
  { titre: "Disponible hors connexion", texte: "Les pages déjà consultées restent accessibles sans réseau. L'envoi d'une demande nécessite une connexion." },
];

const appareils: { titre: string; icone: React.ReactNode; parcours: { systeme: string; etapes: string[] }[] }[] = [
  {
    titre: "Téléphone",
    icone: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="7" y="2.5" width="10" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </svg>
    ),
    parcours: [
      { systeme: "iPhone (Safari)", etapes: ["Touchez le bouton Partager (carré avec une flèche).", "Choisissez « Sur l'écran d'accueil ».", "Validez avec « Ajouter »."] },
      { systeme: "Android (Chrome)", etapes: ["Touchez le bouton « Installer l'application » ci-dessus,", "ou ouvrez le menu ⋮ et choisissez « Installer l'application ».", "Confirmez l'installation."] },
    ],
  },
  {
    titre: "Tablette",
    icone: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="4" y="2.5" width="16" height="19" rx="2" />
        <path d="M11 18.5h2" />
      </svg>
    ),
    parcours: [
      { systeme: "iPad (Safari)", etapes: ["Touchez le bouton Partager en haut de l'écran.", "Choisissez « Sur l'écran d'accueil ».", "Validez avec « Ajouter »."] },
      { systeme: "Tablette Android (Chrome)", etapes: ["Ouvrez le menu ⋮.", "Choisissez « Installer l'application ».", "Confirmez l'installation."] },
    ],
  },
  {
    titre: "Ordinateur",
    icone: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
    parcours: [
      { systeme: "Chrome ou Edge (Windows, Mac)", etapes: ["Cliquez sur l'icône d'installation à droite de la barre d'adresse,", "ou sur le bouton « Installer l'application » ci-dessus.", "L'application apparaît dans le menu Démarrer ou le Dock."] },
      { systeme: "Safari (Mac)", etapes: ["Menu Fichier, puis « Ajouter au Dock ».", "Validez avec « Ajouter »."] },
    ],
  },
];

export default function PageApplication() {
  return (
    <>
      <PageHero
        fond="outils"
        surtitre="Application"
        titre="BIP Corporate Finance, dans votre poche"
        intro="Installez l'application sur votre téléphone, votre tablette ou votre ordinateur pour retrouver le simulateur de valorisation, le score de préparation à la cession et un associé BIP en un geste."
      >
        <BoutonInstaller />
      </PageHero>

      <Section>
        <TitreSection surtitre="Pourquoi l'installer" titre="Une vraie application, sans passer par un magasin" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {atouts.map((a) => (
            <div key={a.titre} className="carte-vivante revele rounded-2xl border border-bordure bg-white p-6 shadow-sm">
              <span aria-hidden="true" className="degrade-bip mb-4 block h-1 w-10 rounded-full" />
              <h3 className="text-lg">{a.titre}</h3>
              <p className="mt-2 text-base text-gris">{a.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section fond="motif" id="installer">
        <TitreSection surtitre="Installation" titre="En trois gestes, sur chaque appareil" />
        <div className="grid gap-6 lg:grid-cols-3">
          {appareils.map((a) => (
            <article key={a.titre} className="revele rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="degrade-bip flex h-14 w-14 items-center justify-center rounded-2xl text-white">{a.icone}</span>
                <h3 className="text-2xl">{a.titre}</h3>
              </div>
              {a.parcours.map((p) => (
                <div key={p.systeme} className="mt-6">
                  <p className="font-titre font-semibold text-anthracite">{p.systeme}</p>
                  <ol className="mt-2 space-y-1.5 text-base text-gris">
                    {p.etapes.map((e, i) => (
                      <li key={e} className="flex gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sable font-titre text-sm font-bold text-rouge-fonce">
                          {i + 1}
                        </span>
                        {e}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </article>
          ))}
        </div>
      </Section>

      <AppelFinal />
    </>
  );
}
