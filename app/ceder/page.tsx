import type { Metadata } from "next";
import { images } from "@/config/images";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { LienBouton } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Céder ou transmettre son entreprise en Côte d'Ivoire",
  description:
    "Cession de PME à Abidjan et en Côte d'Ivoire : évaluation, préparation, recherche d'acquéreurs et négociation jusqu'au closing, en toute confidentialité.",
  alternates: { canonical: "/ceder" },
};

const situations = [
  { titre: "Retraite et succession", texte: "Transmettre l'entreprise à un repreneur, à des cadres ou organiser la succession familiale dans de bonnes conditions." },
  { titre: "Recentrage", texte: "Céder une activité ou une filiale pour concentrer vos moyens sur votre cœur de métier." },
  { titre: "Désaccord entre associés", texte: "Organiser la sortie d'un associé, sur une valeur objective et dans un cadre apaisé." },
  { titre: "Adossement à un groupe", texte: "Rejoindre un groupe régional ou international pour accélérer le développement de l'entreprise." },
  { titre: "Cession partielle", texte: "Céder une partie du capital, en restant aux commandes pendant une période de transition." },
];

const facteursValeur = [
  { titre: "Rentabilité récurrente", texte: "Un résultat régulier, explicable, sans dépendre d'éléments exceptionnels." },
  { titre: "Faible dépendance au dirigeant", texte: "Une entreprise capable de fonctionner sans vous rassure l'acquéreur." },
  { titre: "Diversité des clients", texte: "Aucun client ne doit peser trop lourd dans le chiffre d'affaires." },
  { titre: "Comptes fiables", texte: "Des comptes établis, voire certifiés, qui reflètent fidèlement l'activité." },
  { titre: "Une équipe", texte: "Des responsables clés en place, motivés à rester après la cession." },
  { titre: "Des perspectives", texte: "Un marché porteur et un plan de développement crédible." },
];

const preparation = [
  "Faire certifier les comptes des derniers exercices",
  "Mettre à jour la situation fiscale et sociale",
  "Formaliser par écrit les contrats clients, fournisseurs et salariés clés",
  "Déléguer et organiser l'entreprise pour qu'elle fonctionne sans vous",
  "Séparer clairement patrimoine privé et patrimoine professionnel",
];

export default function Ceder() {
  return (
    <>
      <PageHero
        surtitre="Céder mon entreprise"
        titre="Céder au bon prix, au bon acquéreur"
        intro="Nous vous accompagnons de l'évaluation jusqu'au closing : préparation du dossier, recherche d'acquéreurs qualifiés, négociation et transition. Un associé senior suit votre dossier personnellement, en toute confidentialité."
        image={images.ceder}
      >
        <LienBouton href="/simulateur">Estimer mon entreprise</LienBouton>
        <LienBouton href="/score-cession" variante="secondaire">Mesurer ma préparation</LienBouton>
      </PageHero>

      <Section>
        <TitreSection surtitre="Votre situation" titre="Chaque cession a son histoire" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {situations.map((s) => (
            <div key={s.titre} className="rounded-lg border border-bordure p-6">
              <h3 className="text-lg">{s.titre}</h3>
              <p className="mt-2 text-base text-gris">{s.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section fond="nuit" aurores>
        <TitreSection
          sombre
          surtitre="Le regard de l'acquéreur"
          titre="Ce qui fait la valeur d'une entreprise"
          intro="Un acquéreur achète une capacité à générer des résultats demain, pas seulement un bilan. Six critères pèsent particulièrement dans sa décision et dans le prix."
        />
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {facteursValeur.map((f, i) => (
            <div key={f.titre} className="verre revele flex gap-4 rounded-2xl p-5">
              <span className="font-titre text-3xl font-bold text-or" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-lg">{f.titre}</h3>
                <p className="mt-1 text-base text-white/75">{f.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <TitreSection
            surtitre="Anticiper"
            titre="Préparer sa cession 2 à 3 ans avant"
            intro="Les entreprises bien préparées se vendent plus vite, à un meilleur prix et avec moins de garanties exigées. Voici les chantiers à lancer dès maintenant."
          />
          <div>
            <ul className="space-y-4">
              {preparation.map((p) => (
                <li key={p} className="flex items-start gap-3 text-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="mt-1 shrink-0 text-rouge" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12l5 5L20 7" /></svg>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-ivoire p-6 ring-1 ring-sable">
              <p className="font-titre font-semibold">Où en êtes-vous ?</p>
              <p className="mt-2 text-base text-gris">
                Notre score de préparation à la cession mesure votre niveau en 15 questions et vous indique vos 3 actions prioritaires.
              </p>
              <div className="mt-4">
                <LienBouton href="/score-cession" variante="secondaire">Calculer mon score de préparation</LienBouton>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <AppelFinal titre="Vous envisagez de céder votre entreprise ?" texte="Un premier échange confidentiel, sans engagement, avec un associé BIP." />
    </>
  );
}
