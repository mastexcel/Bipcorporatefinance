import type { Metadata } from "next";
import { references } from "@/config/references";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { GrilleReferences } from "@/components/sections/GrilleReferences";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Références : opérations de fusion-acquisition accompagnées",
  description: "Cessions, acquisitions, levées de fonds et évaluations accompagnées par BIP Corporate Finance en Côte d'Ivoire et dans l'UEMOA.",
  alternates: { canonical: "/references" },
};

export default function References() {
  return (
    <>
      <PageHero
        surtitre="Références"
        titre="Opérations accompagnées"
        intro="Chaque opération est présentée avec l'accord de nos clients. Lorsqu'un client préfère ne pas être nommé, seuls le secteur et le type d'opération sont indiqués."
      />
      <Section>
        <GrilleReferences references={references} />
        <p className="mt-8 text-base text-gris italic">Opérations présentées avec l&apos;accord de nos clients.</p>
      </Section>
      <AppelFinal />
    </>
  );
}
