import type { Metadata } from "next";
import { ScoreCession } from "@/components/readiness/ScoreCession";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Score de préparation à la cession d'entreprise",
  description:
    "Votre entreprise est-elle prête à être cédée ? 15 questions pour obtenir un score sur 100, votre profil sur 5 axes et vos 3 actions prioritaires.",
  alternates: { canonical: "/score-cession" },
};

export default function PageScore() {
  return (
    <>
      <section className="border-b border-bordure bg-fond py-12 sm:py-16">
        <Container className="max-w-4xl">
          <p className="mb-3 text-sm font-semibold tracking-widest text-rouge uppercase">Score de préparation à la cession</p>
          <h1 className="souligne-bip text-3xl sm:text-5xl">Votre entreprise est-elle prête à être cédée ?</h1>
          <p className="mt-6 text-lg text-gris">
            15 questions en 5 blocs (environ 5 minutes) : finances, clients et marché, organisation, juridique et fiscal, projet du
            dirigeant. Vous obtenez un score sur 100 et vos 3 actions prioritaires.
          </p>
        </Container>
      </section>
      <section className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          <ScoreCession />
        </Container>
      </section>
    </>
  );
}
