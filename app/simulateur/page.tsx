import type { Metadata } from "next";
import { Simulateur } from "@/components/simulator/Simulateur";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Simulateur de valorisation d'entreprise en Côte d'Ivoire",
  description:
    "Estimez gratuitement la valeur de votre PME en Côte d'Ivoire : une fourchette indicative en 5 étapes, fondée sur les multiples de transactions et la capitalisation des flux, avec vos hypothèses visibles.",
  alternates: { canonical: "/simulateur" },
};

export default function PageSimulateur() {
  return (
    <>
      <PageHero
        chevauchement
        surtitre="Simulateur de valorisation"
        titre={"Combien vaut votre entreprise\u00a0?"}
        intro={
          <>
            <p>
              Une fourchette de valeur indicative en 5 étapes (environ 10 minutes), selon les méthodes reconnues par les normes
              internationales d&apos;évaluation. Munissez-vous de vos derniers états financiers.
            </p>
            <p className="mt-4 text-base text-white/70">
              <strong className="text-white">Confidentialité :</strong> vos chiffres restent dans votre navigateur : ils ne sont ni
              enregistrés ni transmis, sauf si vous demandez à recevoir votre synthèse.
            </p>
          </>
        }
      />
      <section className="fond-ivoire flow-root pb-16 sm:pb-24">
        <Container className="max-w-4xl">
          <div className="relative z-10 -mt-20 rounded-2xl bg-white p-5 shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:-mt-24 sm:p-10">
            <Simulateur />
          </div>
        </Container>
      </section>
    </>
  );
}
