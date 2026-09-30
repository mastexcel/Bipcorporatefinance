import type { Metadata } from "next";
import { Simulateur } from "@/components/simulator/Simulateur";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Simulateur de valorisation d'entreprise en Côte d'Ivoire",
  description:
    "Estimez gratuitement la valeur de votre PME en Côte d'Ivoire : une fourchette indicative en 5 étapes, fondée sur les multiples de transactions et la capitalisation des flux, avec vos hypothèses visibles.",
  alternates: { canonical: "/simulateur" },
};

export default function PageSimulateur() {
  return (
    <>
      <section className="border-b border-bordure bg-fond py-12 sm:py-16">
        <Container className="max-w-4xl">
          <p className="mb-3 text-sm font-semibold tracking-widest text-rouge uppercase">Simulateur de valorisation</p>
          <h1 className="souligne-bip text-3xl sm:text-5xl">Combien vaut votre entreprise ?</h1>
          <p className="mt-6 text-lg text-gris">
            Une fourchette de valeur indicative en 5 étapes (environ 10 minutes), selon les méthodes reconnues par les normes
            internationales d&apos;évaluation. Munissez-vous de vos derniers états financiers.
          </p>
          <p className="mt-4 text-base text-gris">
            <strong className="text-anthracite">Confidentialité :</strong> vos chiffres restent dans votre navigateur : ils ne sont ni enregistrés ni transmis, sauf si vous demandez à recevoir
            votre synthèse.
          </p>
        </Container>
      </section>
      <section className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          <Simulateur />
        </Container>
      </section>
    </>
  );
}
