import type { Metadata } from "next";
import { images } from "@/config/images";
import { FormulaireInvestisseur } from "@/components/forms/FormulaireInvestisseur";
import { PageHero } from "@/components/ui/PageHero";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Investir en Côte d'Ivoire : acquisitions de PME",
  description:
    "Fonds d'investissement, groupes régionaux et étrangers, family offices : BIP identifie et approche des PME cibles en Côte d'Ivoire et dans l'UEMOA, et structure l'opération dans le cadre OHADA.",
  alternates: { canonical: "/investir" },
};

const offre = [
  { titre: "Recherche de cibles", texte: "Identification de sociétés correspondant à vos critères, y compris des entreprises qui ne sont pas officiellement à vendre." },
  { titre: "Approche confidentielle", texte: "Premier contact avec les dirigeants, sans révéler votre identité avant l'accord de confidentialité." },
  { titre: "Évaluation", texte: "Analyse financière, retraitement des comptes et fourchette de valeur argumentée." },
  { titre: "Due diligence", texte: "Coordination des audits financiers, juridiques et fiscaux avec vos conseils." },
  { titre: "Structuration OHADA", texte: "Accompagnement de la structuration de l'opération dans le cadre du droit OHADA, en lien avec vos avocats." },
];

export default function Investir() {
  return (
    <>
      <PageHero
        surtitre="Investir en Côte d'Ivoire"
        titre="Accédez aux meilleures PME de Côte d'Ivoire et de l'UEMOA"
        intro="Pour les fonds d'investissement, les groupes régionaux et étrangers et les family offices qui souhaitent investir dans des entreprises non cotées d'Afrique de l'Ouest."
        image={images.investir}
      />

      <Section>
        <TitreSection surtitre="Notre offre" titre="Un accompagnement de bout en bout" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offre.map((o) => (
            <div key={o.titre} className="rounded-lg border border-bordure p-6">
              <h3 className="text-lg">{o.titre}</h3>
              <p className="mt-2 text-base text-gris">{o.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section fond="sable" etroit id="criteres">
        <TitreSection
          surtitre="Réseau d'acquéreurs"
          titre="Partagez vos critères d'investissement"
          intro="Rejoignez le réseau d'investisseurs et d'acquéreurs de BIP. Nous vous présenterons, en toute confidentialité, les opportunités correspondant à vos critères."
        />
        <FormulaireInvestisseur />
      </Section>
    </>
  );
}
