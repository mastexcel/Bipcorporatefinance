import type { Metadata } from "next";
import { images } from "@/config/images";
import { DUREE_TOTALE, etapesProcessus, faqMethode, MENTION_DUREES } from "@/content/methode";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { Faq } from "@/components/ui/Faq";
import { PageHero } from "@/components/ui/PageHero";
import { Section, TitreSection } from "@/components/ui/Section";
import { JsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Notre méthode : le processus de cession en 10 étapes",
  description:
    "Du premier échange confidentiel au closing : le processus de cession structuré de BIP, étape par étape, et les réponses à vos questions sur la cession d'entreprise.",
  alternates: { canonical: "/methode" },
};

const donneesFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqMethode.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.reponse },
  })),
};

export default function Methode() {
  return (
    <>
      <PageHero
        image={images.methode}
        surtitre="Notre méthode"
        titre="Un processus de cession structuré, étape par étape"
        intro="Le standard des banques d'affaires, adapté aux PME : chaque étape a un objectif précis, et vous savez à tout moment ce qui se passe et ce que nous attendons de vous."
      />

      <Section>
        <TitreSection
          surtitre="Le processus"
          titre="10 étapes, du premier échange au closing"
          intro={
            <>
              Durée totale : <strong className="text-anthracite">{DUREE_TOTALE}</strong>. {MENTION_DUREES}
            </>
          }
        />
        <ol className="space-y-6">
          {etapesProcessus.map((e, i) => (
            <li key={e.titre} className="grid gap-4 rounded-lg border border-bordure p-6 md:grid-cols-[4rem_1fr]">
              <span className="degrade-bip flex h-12 w-12 items-center justify-center rounded-full font-titre text-lg font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl">{e.titre}</h3>
                <dl className="mt-4 grid gap-4 text-base lg:grid-cols-[1.4fr_1.2fr_0.6fr]">
                  <div>
                    <dt className="font-semibold text-anthracite">Ce qui se passe</dt>
                    <dd className="mt-1 text-gris">{e.quoi}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-anthracite">Ce que vous fournissez</dt>
                    <dd className="mt-1 text-gris">{e.aFournir}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-anthracite">Durée indicative*</dt>
                    <dd className="mt-1">
                      <span className="font-semibold text-anthracite">{e.duree}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-base text-gris">* {MENTION_DUREES} Durée totale indicative : {DUREE_TOTALE}.</p>
      </Section>

      <Section alternee etroit id="faq">
        <TitreSection surtitre="Questions fréquentes" titre="Vos questions sur la cession" />
        <Faq questions={faqMethode.map((q) => ({ question: q.question, reponse: <p>{q.reponse}</p>, reponseTexte: q.reponse }))} />
        <p className="mt-6 text-base text-gris">
          Les réponses ci-dessus sont générales. Les aspects juridiques et fiscaux de votre opération doivent être examinés avec votre avocat
          et votre conseil fiscal.
        </p>
      </Section>

      <AppelFinal />
      <JsonLd data={donneesFaq} />
    </>
  );
}
