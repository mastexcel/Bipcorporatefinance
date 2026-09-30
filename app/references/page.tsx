import type { Metadata } from "next";
import { images } from "@/config/images";
import { references } from "@/config/references";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { GrilleReferences } from "@/components/sections/GrilleReferences";
import { PageHero } from "@/components/ui/PageHero";
import { GrilleMissions, ListePartenaires } from "@/components/sections/Missions";
import { Section, TitreSection } from "@/components/ui/Section";
import { missionsReference } from "@/content/groupe";

export const metadata: Metadata = {
  title: "Références : missions et partenaires",
  description: "Missions de conseil financier et stratégique du groupe BIP et partenaires : BAD, GIZ, Union européenne, BIT, Solidaridad, COLEAD et entreprises ivoiriennes.",
  alternates: { canonical: "/references" },
};

export default function References() {
  return (
    <>
      <PageHero
        image={images.references}
        surtitre="Références"
        titre="Nos références"
        intro="Les opérations de cession, d'acquisition et de levée de fonds sont présentées avec l'accord de nos clients ; lorsqu'un client préfère ne pas être nommé, seuls le secteur et le type d'opération sont indiqués."
      />
      {references.length > 0 && (
        <Section>
          <GrilleReferences references={references} />
          <p className="mt-8 text-base text-gris italic">Opérations présentées avec l&apos;accord de nos clients.</p>
        </Section>
      )}
      <Section alternee={references.length > 0}>
        <TitreSection
          surtitre="Missions de référence"
          titre="Ce que le groupe BIP a livré"
          intro="Missions de conseil réalisées par BIP Expertise, le pôle conseil du groupe : notation financière, business plans, études de rentabilité, tableaux de bord et formation."
        />
        <GrilleMissions missions={missionsReference} />
      </Section>
      <Section alternee={references.length === 0}>
        <TitreSection surtitre="Ils nous ont fait confiance" titre="Partenaires, bailleurs et clients" />
        <ListePartenaires />
      </Section>
      <AppelFinal />
    </>
  );
}
