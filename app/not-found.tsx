import type { Metadata } from "next";
import { ArcsPont, Aurores } from "@/components/ui/Atmosphere";
import { LienBouton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surtitre } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function PageIntrouvable() {
  return (
    <section className="fond-nuit grain py-24 sm:py-32">
      <Aurores />
      <ArcsPont className="absolute inset-x-0 bottom-0 -z-10 h-56 w-full opacity-70 sm:h-72" />
      <Container className="max-w-3xl text-center">
        <div className="flex justify-center">
          <Surtitre sombre>Erreur 404</Surtitre>
        </div>
        <h1 className="text-4xl tracking-tight text-white sm:text-5xl">Ce pont ne mène nulle part…</h1>
        <p className="mt-5 text-lg text-white/80">
          La page que vous cherchez n&apos;existe pas ou a été déplacée. Reprenons le bon chemin.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LienBouton href="/">Retour à l&apos;accueil</LienBouton>
          <LienBouton href="/simulateur" variante="clair">Estimer mon entreprise</LienBouton>
        </div>
      </Container>
    </section>
  );
}
