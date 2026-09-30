import Link from "next/link";
import { chiffresCles } from "@/content/equipe";
import { missionsReference } from "@/content/groupe";
import { images } from "@/config/images";
import { references } from "@/config/references";
import { lienWhatsApp } from "@/config/site";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { CarteArticle } from "@/components/sections/CarteArticle";
import { FriseMethode } from "@/components/sections/FriseMethode";
import { GrilleMissions } from "@/components/sections/Missions";
import { Tombstone } from "@/components/sections/Tombstone";
import { LienBouton } from "@/components/ui/Button";
import { Carte } from "@/components/ui/Carte";
import { Container } from "@/components/ui/Container";
import {
  IconeAssocie,
  IconeBalance,
  IconeCadenas,
  IconeCalcul,
  IconeCapital,
  IconeCarte,
  IconeCession,
  IconeInvestir,
  IconeRadar,
} from "@/components/ui/Icones";
import { Section, TitreSection } from "@/components/ui/Section";
import { Visuel } from "@/components/ui/Visuel";
import { listerArticles } from "@/lib/articles";

export const metadata = {
  title: { absolute: "BIP Corporate Finance — Valorisation et cession de PME en Côte d'Ivoire" },
  description:
    "Combien vaut vraiment votre entreprise ? BIP accompagne les dirigeants de PME en Côte d'Ivoire dans la valorisation, la cession et la transmission de leur entreprise, en toute confidentialité.",
  alternates: { canonical: "/" },
};

const atouts = [
  {
    titre: "Expertise locale, réseau international",
    texte: "Une connaissance fine des PME ivoiriennes et du droit OHADA, et un réseau d'acquéreurs régionaux et internationaux.",
    icone: <IconeCarte />,
  },
  {
    titre: "Confidentialité absolue",
    texte: "Accord de confidentialité signé dès le premier échange, teaser anonyme, accès contrôlé aux informations.",
    icone: <IconeCadenas />,
  },
  {
    titre: "Un associé senior de bout en bout",
    texte: "Votre dossier est suivi personnellement par un associé, du premier échange jusqu'au closing.",
    icone: <IconeAssocie />,
  },
  {
    titre: "Indépendance",
    texte: "Aucun intérêt dans les sociétés que nous vendons. Nous ne conseillons jamais deux parties opposées sur une même opération.",
    icone: <IconeBalance />,
  },
];

export default function Accueil() {
  const whatsapp = lienWhatsApp();
  const derniers = listerArticles().slice(0, 3);
  const tombstones = references.slice(0, 3);

  return (
    <>
      {/* Bandeau */}
      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-widest text-rouge uppercase">
              Fusions-acquisitions · PME et ETI · Côte d&apos;Ivoire et UEMOA
            </p>
            <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Combien vaut <span className="texte-degrade">vraiment</span> votre entreprise&nbsp;?
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gris sm:text-xl">
              BIP accompagne les dirigeants de PME dans la valorisation, la cession et la transmission de leur entreprise, en toute
              confidentialité.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LienBouton href="/simulateur">Estimer mon entreprise</LienBouton>
              {whatsapp ? (
                <LienBouton href={whatsapp} externe variante="secondaire">
                  Parler à un associé
                </LienBouton>
              ) : (
                <LienBouton href="/contact" variante="secondaire">
                  Parler à un associé
                </LienBouton>
              )}
            </div>
            <p className="mt-6 flex items-center gap-2 text-base text-gris">
              <span className="text-rouge"><IconeCadenas /></span>
              Échange confidentiel et sans engagement.
            </p>
          </div>
          <Visuel image={images.accueil} priority className="aspect-[4/3] w-full" />
        </Container>
      </section>

      {/* Trois parcours */}
      <Section alternee>
        <TitreSection surtitre="Votre projet" titre="Nous vous accompagnons à chaque étape de la vie de votre capital" />
        <div className="grid gap-6 md:grid-cols-3">
          <Carte titre="Je veux céder ou transmettre" href="/ceder" lien="Céder mon entreprise" icone={<IconeCession />}>
            Retraite, succession, recentrage ou adossement à un groupe : nous évaluons votre entreprise, la préparons et trouvons le bon
            acquéreur.
          </Carte>
          <Carte titre="Je veux investir ou acquérir" href="/investir" lien="Investir en Côte d'Ivoire" icone={<IconeInvestir />}>
            Fonds, groupes régionaux ou étrangers : nous identifions des cibles, les approchons en toute confidentialité et vous
            accompagnons jusqu&apos;à la signature.
          </Carte>
          <Carte titre="Je veux ouvrir mon capital" href="/lever-des-fonds" lien="Lever des fonds" icone={<IconeCapital />}>
            Préparation du dossier, identification des investisseurs et négociation : nous vous aidons à accueillir le bon partenaire.
          </Carte>
        </div>
      </Section>

      {/* Pourquoi BIP */}
      <Section>
        <TitreSection surtitre="Pourquoi BIP" titre="Un conseil indépendant, au service du dirigeant" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {atouts.map((a) => (
            <div key={a.titre}>
              <div className="mb-4 text-rouge">{a.icone}</div>
              <h3 className="text-lg">{a.titre}</h3>
              <p className="mt-2 text-base text-gris">{a.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Méthode */}
      <Section alternee>
        <TitreSection
          surtitre="Notre méthode"
          titre="Un processus structuré en 5 phases"
          intro="Le standard des banques d'affaires, adapté aux PME d'Afrique de l'Ouest."
        />
        <FriseMethode />
        <div className="mt-10">
          <LienBouton href="/methode" variante="secondaire">
            Découvrir la méthode en détail
          </LienBouton>
        </div>
      </Section>

      {/* Deux outils */}
      <Section>
        <TitreSection surtitre="Nos outils gratuits" titre="Faites le point en quelques minutes" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-lg border border-bordure bg-white p-8 shadow-sm">
            <div className="text-rouge"><IconeCalcul /></div>
            <h3 className="mt-4 text-2xl">Simulateur de valorisation</h3>
            <p className="mt-3 flex-1 text-gris">
              Une fourchette de valeur indicative en 5 étapes, fondée sur les méthodes reconnues par les normes internationales :
              multiples de transactions et capitalisation des flux, avec vos hypothèses visibles.
            </p>
            <div className="mt-6">
              <LienBouton href="/simulateur">Estimer mon entreprise</LienBouton>
            </div>
          </div>
          <div className="flex flex-col rounded-lg border border-bordure bg-white p-8 shadow-sm">
            <div className="text-rouge"><IconeRadar /></div>
            <h3 className="mt-4 text-2xl">Score de préparation à la cession</h3>
            <p className="mt-3 flex-1 text-gris">
              15 questions pour mesurer si votre entreprise est prête à être cédée : finances, clients, organisation, juridique et
              projet personnel. Avec vos 3 actions prioritaires.
            </p>
            <div className="mt-6">
              <LienBouton href="/score-cession" variante="secondaire">
                Calculer mon score
              </LienBouton>
            </div>
          </div>
        </div>
      </Section>

      {/* Références */}
      <Section alternee>
        {tombstones.length > 0 ? (
          <>
            <TitreSection surtitre="Références" titre="Opérations accompagnées" />
            <div className="grid gap-6 md:grid-cols-3">
              {tombstones.map((r) => (
                <Tombstone key={r.id} reference={r} />
              ))}
            </div>
            <p className="mt-6 text-base text-gris italic">Opérations présentées avec l&apos;accord de nos clients.</p>
          </>
        ) : (
          <>
            <TitreSection
              surtitre="Références"
              titre="Ils nous ont confié leurs enjeux financiers"
              intro="Quelques missions de conseil réalisées par le groupe BIP pour des institutions et des entreprises."
            />
            <GrilleMissions missions={missionsReference.filter((m) => m.finance)} />
          </>
        )}
        <div className="mt-6">
          <Link href="/references" className="font-semibold text-rouge hover:text-rouge-fonce">
            Toutes nos références <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>

      {/* Chiffres clés */}
      <Section>
        <TitreSection surtitre="Chiffres clés" titre="BIP en quelques chiffres" />
        <dl className="grid gap-8 sm:grid-cols-3">
          {chiffresCles.map((c) => (
            <div key={c.libelle} className="flex flex-col-reverse border-l-4 border-orange pl-5">
              <dt className="mt-2 text-base text-gris">{c.libelle}</dt>
              <dd className="texte-degrade font-titre text-5xl font-bold">{c.valeur}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Dernières analyses */}
      <Section alternee>
        <TitreSection surtitre="Analyses" titre="Nos dernières publications" />
        <div className="grid gap-6 md:grid-cols-3">
          {derniers.map((a) => (
            <CarteArticle key={a.slug} article={a} />
          ))}
        </div>
      </Section>

      <AppelFinal />
    </>
  );
}
