import type { Metadata } from "next";
import { images } from "@/config/images";
import { site } from "@/config/site";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { ACompleter } from "@/components/ui/ACompleter";
import { PageHero } from "@/components/ui/PageHero";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "À propos : cabinet de conseil en fusions-acquisitions à Abidjan",
  description:
    "BIP Corporate Finance, branche de Bridge Investment Partners créée en 2022 à Abidjan : mission, valeurs, équipe, déontologie et indépendance.",
  alternates: { canonical: "/a-propos" },
};

const valeurs = [
  { titre: "Confidentialité", texte: "La discrétion est la condition de toute opération réussie. Elle guide chacune de nos actions." },
  { titre: "Exigence", texte: "Des méthodes d'évaluation reconnues, des dossiers rigoureux, des hypothèses toujours explicites." },
  { titre: "Engagement", texte: "Un associé senior à vos côtés du premier échange au closing, disponible et impliqué." },
  { titre: "Indépendance", texte: "Un conseil libre de tout conflit d'intérêts, rémunéré uniquement par son client." },
];

const deontologie = [
  {
    titre: "Confidentialité",
    texte: "Toutes les informations reçues sont traitées de manière strictement confidentielle. Un accord de confidentialité est signé dès le premier échange, et les acquéreurs n'accèdent aux informations détaillées qu'après avoir signé le leur.",
  },
  {
    titre: "Prévention des conflits d'intérêts",
    texte: "BIP ne conseille jamais deux parties opposées sur une même opération, et ne détient aucun intérêt dans les sociétés qu'elle accompagne.",
  },
  {
    titre: "Lutte contre le blanchiment de capitaux",
    texte: "BIP respecte ses obligations en matière de lutte contre le blanchiment de capitaux et le financement du terrorisme : vérification de l'identité des clients et des contreparties, et de l'origine des fonds.",
  },
  {
    titre: "Rémunération transparente",
    texte: "BIP est rémunérée uniquement par son client mandant, selon les conditions prévues dans la lettre de mission. Aucune commission n'est perçue auprès de la contrepartie.",
  },
];

/** Membres de l'équipe — emplacements à compléter (aucune photo tant que BIP ne les a pas fournies). */
const equipe = [
  { nom: site.gerant, fonction: "Gérant" },
  { nom: null, fonction: null },
  { nom: null, fonction: null },
];

export default function APropos() {
  return (
    <>
      <PageHero
        surtitre="À propos"
        titre="Un conseil indépendant au service des dirigeants"
        intro={site.promesse}
        image={images.aPropos}
      />

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <TitreSection surtitre="Notre mission" titre="Révéler la valeur, trouver le bon acquéreur" />
            <p className="text-lg text-gris">
              BIP Corporate Finance est la branche de conseil en fusions-acquisitions de Bridge Investment Partners (BIP), cabinet de
              conseil basé à Abidjan. Nous accompagnons les dirigeants de PME et d&apos;ETI non cotées en Côte d&apos;Ivoire et dans la zone
              UEMOA dans les opérations les plus importantes de la vie de leur entreprise : cession, transmission, acquisition et
              ouverture de capital.
            </p>
          </div>
          <div>
            <TitreSection surtitre="Notre histoire" titre={`Créé à Abidjan en ${site.anneeCreation}`} />
            <p className="text-lg text-gris">
              Bridge Investment Partners a été créé en avril {site.anneeCreation} avec une conviction : les PME d&apos;Afrique de
              l&apos;Ouest méritent un conseil en fusions-acquisitions du même niveau d&apos;exigence que celui des grandes banques
              d&apos;affaires, adapté à leur taille et à leur réalité.
            </p>
            <p className="mt-4 text-lg">
              <ACompleter>HISTOIRE DÉTAILLÉE À COMPLÉTER</ACompleter>
            </p>
          </div>
        </div>
      </Section>

      <Section alternee>
        <TitreSection surtitre="Nos valeurs" titre="Ce qui nous guide" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valeurs.map((v) => (
            <div key={v.titre} className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg">{v.titre}</h3>
              <p className="mt-2 text-base text-gris">{v.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="equipe">
        <TitreSection surtitre="L'équipe" titre="Des associés à vos côtés" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {equipe.map((m, i) => (
            <article key={i} className="rounded-lg border border-bordure p-6">
              <div
                role="img"
                aria-label="Photo à venir"
                className="flex aspect-square w-full items-center justify-center rounded-md bg-fond text-gris"
              >
                <svg width="64" height="64" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
              </div>
              <h3 className="mt-5 text-xl">{m.nom ?? <ACompleter>NOM</ACompleter>}</h3>
              <p className="font-semibold text-rouge">{m.fonction ?? <ACompleter>FONCTION</ACompleter>}</p>
              <p className="mt-3 text-base text-gris">
                <ACompleter>PARCOURS ET CERTIFICATIONS</ACompleter>
              </p>
              <p className="mt-3 text-base">
                <ACompleter>LIEN LINKEDIN</ACompleter>
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section alternee id="deontologie">
        <TitreSection
          surtitre="Déontologie et indépendance"
          titre="Des engagements clairs"
          intro="La confiance de nos clients repose sur des règles simples, appliquées sans exception."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {deontologie.map((d) => (
            <div key={d.titre} className="rounded-lg border-l-4 border-rouge bg-white p-6">
              <h3 className="text-lg">{d.titre}</h3>
              <p className="mt-2 text-base text-gris">{d.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <AppelFinal />
    </>
  );
}
