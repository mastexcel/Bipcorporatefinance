import type { Metadata } from "next";
import { BoutonInstaller } from "@/components/layout/BoutonInstaller";
import { applicationAndroid } from "@/config/application";
import { classesBouton } from "@/components/ui/Button";
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
      { systeme: "Android", etapes: ["Téléchargez l'application Android (APK) ci-dessus,", "ou, dans Chrome, ouvrez le menu ⋮ et choisissez « Installer l'application ».", "Confirmez l'installation."] },
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

function IconeAndroid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22a11.4 11.4 0 0 0-9.84 0L5.22 5.92a.38.38 0 1 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
    </svg>
  );
}

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
        <a href={applicationAndroid.fichier} download className={classesBouton("clair")}>
          <IconeAndroid /> Télécharger pour Android
        </a>
      </PageHero>

      <Section fond="motif" id="android">
        <div className="fond-nuit grain revele grid gap-10 rounded-3xl p-8 shadow-2xl sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-corail uppercase">
              <span aria-hidden="true" className="degrade-bip inline-block h-0.5 w-8 rounded-full" />
              Application Android
            </p>
            <h2 className="text-3xl tracking-tight sm:text-4xl">Téléchargez l&apos;application sur votre téléphone Android</h2>
            <p className="mt-5 text-lg text-white/80">
              L&apos;application BIP CF ouvre le site en plein écran : simulateur, score de préparation, analyses et contact avec un
              associé. Les liens WhatsApp, téléphone et e-mail s&apos;ouvrent directement dans vos applications.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={applicationAndroid.fichier} download className={classesBouton("principal")}>
                <IconeAndroid /> Télécharger l&apos;APK
              </a>
              <span className="text-base text-white/70">
                Version {applicationAndroid.version} · {applicationAndroid.taille} · {applicationAndroid.androidMinimum} et plus
              </span>
            </div>
          </div>
          <div className="verre rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl">Installer en 3 étapes</h3>
            <ol className="mt-4 space-y-3 text-base text-white/85">
              {[
                "Touchez « Télécharger l'APK » depuis votre téléphone Android.",
                "Ouvrez le fichier téléchargé. Si Android le demande, autorisez l'installation depuis votre navigateur.",
                "Touchez « Installer » : l'icône BIP CF apparaît sur votre écran d'accueil.",
              ].map((e, i) => (
                <li key={e} className="flex gap-3">
                  <span className="degrade-bip flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-titre text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {e}
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-white/10 pt-4 text-sm text-white/60">
              Application publiée par Bridge Investment Partners. Empreinte SHA-256 du fichier :{" "}
              <span className="font-mono break-all text-white/75">{applicationAndroid.sha256}</span>
            </p>
          </div>
        </div>
      </Section>

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

      <Section alternee id="installer">
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
