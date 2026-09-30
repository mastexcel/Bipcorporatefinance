import type { Metadata } from "next";
import { site } from "@/config/site";
import { ACompleter } from "@/components/ui/ACompleter";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site de BIP Corporate Finance — Bridge Investment Partners.",
  alternates: { canonical: "/mentions-legales" },
};

const lignes: [string, React.ReactNode][] = [
  ["Dénomination sociale", "Bridge Investment Partners (BIP)"],
  ["Forme juridique", <ACompleter key="f" />],
  ["Capital social", <ACompleter key="c" />],
  ["RCCM", <ACompleter key="r" />],
  ["Compte contribuable", <ACompleter key="cc" />],
  ["Siège social", <ACompleter key="s">À COMPLÉTER : adresse complète</ACompleter>],
  ["Téléphone", site.coordonnees.telephone],
  ["E-mail", site.coordonnees.email],
  ["Directeur de la publication", <ACompleter key="d" />],
  ["Hébergeur", <span key="h">Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — <ACompleter>À CONFIRMER</ACompleter></span>],
];

export default function MentionsLegales() {
  return (
    <Section etroit>
      <TitreSection niveau={1} titre="Mentions légales" />
      <dl className="divide-y divide-bordure rounded-lg border border-bordure">
        {lignes.map(([cle, valeur]) => (
          <div key={cle} className="grid gap-1 p-4 sm:grid-cols-[14rem_1fr]">
            <dt className="font-semibold">{cle}</dt>
            <dd className="text-gris">{valeur}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-2xl">Propriété intellectuelle</h2>
      <p className="mt-4 text-gris">
        L&apos;ensemble des contenus de ce site (textes, logo, graphismes, outils) est la propriété de Bridge Investment Partners, sauf
        mention contraire. Toute reproduction sans autorisation préalable est interdite.
      </p>

      <h2 className="mt-10 text-2xl">Avertissement</h2>
      <p className="mt-4 text-gris">
        Les informations et outils proposés sur ce site (simulateur de valorisation, score de préparation, analyses) ont une vocation
        exclusivement informative et pédagogique. Ils ne constituent ni une évaluation au sens des normes professionnelles, ni une offre,
        ni un conseil en investissement, ni un appel public à l&apos;épargne. Ils ne remplacent pas l&apos;avis d&apos;un professionnel
        (conseiller, expert-comptable, avocat, conseil fiscal).
      </p>

      <h2 className="mt-10 text-2xl">Données personnelles</h2>
      <p className="mt-4 text-gris">
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <a href="/confidentialite" className="text-rouge underline underline-offset-2">politique de confidentialité</a>.
      </p>
    </Section>
  );
}
