import { LienBouton } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export default function PageIntrouvable() {
  return (
    <Section etroit className="text-center">
      <p className="text-sm font-semibold tracking-widest text-rouge uppercase">Erreur 404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Cette page est introuvable</h1>
      <p className="mt-4 text-lg text-gris">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <LienBouton href="/">Retour à l&apos;accueil</LienBouton>
        <LienBouton href="/simulateur" variante="secondaire">Estimer mon entreprise</LienBouton>
      </div>
    </Section>
  );
}
