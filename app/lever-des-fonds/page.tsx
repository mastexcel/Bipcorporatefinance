import type { Metadata } from "next";
import { images } from "@/config/images";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { LienBouton } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Lever des fonds à Abidjan : ouverture de capital",
  description:
    "Ouvrir le capital de votre PME en Côte d'Ivoire : préparation du plan d'affaires, identification des investisseurs, négociation de la valorisation et du pacte d'associés.",
  alternates: { canonical: "/lever-des-fonds" },
};

const etapes = [
  {
    titre: "Préparer l'entreprise et le plan d'affaires",
    texte: "Diagnostic, projections financières, besoin de financement et usage des fonds : un dossier clair et crédible pour les investisseurs.",
  },
  {
    titre: "Identifier les investisseurs",
    texte: "Fonds d'investissement, investisseurs privés, partenaires industriels : nous ciblons ceux dont la stratégie correspond à votre projet.",
  },
  {
    titre: "Négocier",
    texte: "Valorisation, montant et forme de l'investissement, gouvernance et pacte d'associés : nous défendons vos intérêts, avec votre avocat.",
  },
];

export default function LeverDesFonds() {
  return (
    <>
      <PageHero
        surtitre="Lever des fonds"
        titre="Ouvrir votre capital au bon partenaire"
        intro="Financer une croissance, un investissement ou une réorganisation en accueillant un investisseur : nous préparons votre entreprise, identifions les bons partenaires et vous accompagnons dans la négociation."
        image={images.leverDesFonds}
      >
        <LienBouton href="/contact">Parler de mon projet</LienBouton>
      </PageHero>

      <Section>
        <TitreSection surtitre="Notre accompagnement" titre="Trois étapes pour une levée réussie" />
        <ol className="grid gap-6 md:grid-cols-3">
          {etapes.map((e, i) => (
            <li key={e.titre} className="rounded-lg border border-bordure p-6">
              <span className="degrade-bip inline-flex h-10 w-10 items-center justify-center rounded-full font-titre font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 text-lg">{e.titre}</h3>
              <p className="mt-2 text-base text-gris">{e.texte}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section alternee etroit>
        <div className="rounded-lg border-l-4 border-rouge bg-white p-6">
          <h2 className="text-xl">À noter</h2>
          <p className="mt-3 text-gris">
            BIP intervient dans le cadre d&apos;opérations privées, auprès d&apos;investisseurs identifiés et sollicités de manière ciblée.{" "}
            <strong className="text-anthracite">BIP n&apos;organise pas d&apos;appel public à l&apos;épargne</strong> et ne fournit pas de
            conseil en investissement au public.
          </p>
        </div>
      </Section>

      <AppelFinal titre="Vous envisagez d'ouvrir votre capital ?" texte="Échangeons sur votre projet, en toute confidentialité." />
    </>
  );
}
