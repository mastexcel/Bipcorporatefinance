import type { Metadata } from "next";
import { ArcsPont, Aurores } from "@/components/ui/Atmosphere";
import { LienBouton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surtitre } from "@/components/ui/Section";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Hors connexion",
  robots: { index: false },
};

/** Page affichée par l'application quand la page demandée n'est pas disponible sans réseau. */
export default function HorsLigne() {
  return (
    <section className="fond-nuit grain py-24 sm:py-32">
      <Aurores />
      <ArcsPont className="absolute inset-x-0 bottom-0 -z-10 h-56 w-full opacity-70 sm:h-72" />
      <Container className="max-w-3xl text-center">
        <div className="flex justify-center">
          <Surtitre sombre>Hors connexion</Surtitre>
        </div>
        <h1 className="text-4xl tracking-tight text-white sm:text-5xl">Vous êtes hors connexion</h1>
        <p className="mt-5 text-lg text-white/80">
          Cette page n&apos;est pas encore disponible sans réseau. Les pages déjà consultées, dont le simulateur et le score de
          préparation, restent accessibles.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LienBouton href="/simulateur">Ouvrir le simulateur</LienBouton>
          <LienBouton href="/" variante="clair">Retour à l&apos;accueil</LienBouton>
        </div>
        <p className="mt-8 text-base text-white/70">
          Besoin d&apos;un associé tout de suite ? Appelez le{" "}
          <a href={site.coordonnees.telephoneLien} className="font-semibold whitespace-nowrap text-corail underline underline-offset-2">
            {site.coordonnees.telephone}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
