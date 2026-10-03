import type { Metadata } from "next";
import { ScoreCession } from "@/components/readiness/ScoreCession";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Score de préparation à la cession d'entreprise",
  description:
    "Votre entreprise est-elle prête à être cédée ? 15 questions pour obtenir un score sur 100, votre profil sur 5 axes et vos 3 actions prioritaires.",
  alternates: { canonical: "/score-cession" },
};

export default function PageScore() {
  return (
    <>
      <PageHero
        chevauchement
        surtitre="Score de préparation à la cession"
        titre={"Votre entreprise est-elle prête à être cédée\u00a0?"}
        intro="15 questions en 5 blocs (environ 5 minutes) : finances, clients et marché, organisation, juridique et fiscal, projet du dirigeant. Vous obtenez un score sur 100 et vos 3 actions prioritaires."
      />
      <section className="fond-ivoire flow-root pb-16 sm:pb-24">
        <Container className="max-w-4xl">
          <div className="relative z-10 -mt-20 rounded-2xl bg-white p-5 shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:-mt-24 sm:p-10">
            <ScoreCession />
          </div>
        </Container>
      </section>
    </>
  );
}
