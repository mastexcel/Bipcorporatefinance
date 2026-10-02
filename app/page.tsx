import Image from "next/image";
import Link from "next/link";
import { chiffresCles } from "@/content/equipe";
import { missionsReference } from "@/content/groupe";
import { images } from "@/config/images";
import { references } from "@/config/references";
import { lienWhatsApp } from "@/config/site";
import { AppelFinal } from "@/components/sections/AppelFinal";
import { CarteArticle } from "@/components/sections/CarteArticle";
import { FriseMethode } from "@/components/sections/FriseMethode";
import { BandeauPartenaires, GrilleMissions } from "@/components/sections/Missions";
import { Tombstone } from "@/components/sections/Tombstone";
import { LienBouton } from "@/components/ui/Button";
import { ArcsPont, Aurores } from "@/components/ui/Atmosphere";
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
import { Section, Surtitre, TitreSection } from "@/components/ui/Section";
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

const parcours = [
  {
    numero: "01",
    titre: "Je veux céder ou transmettre",
    texte:
      "Retraite, succession, recentrage ou adossement à un groupe : nous évaluons votre entreprise, la préparons et trouvons le bon acquéreur.",
    href: "/ceder",
    lien: "Céder mon entreprise",
    icone: <IconeCession />,
    accent: "from-rouge to-orange",
  },
  {
    numero: "02",
    titre: "Je veux investir ou acquérir",
    texte:
      "Fonds, groupes régionaux ou étrangers : nous identifions des cibles, les approchons en toute confidentialité et vous accompagnons jusqu'à la signature.",
    href: "/investir",
    lien: "Investir en Côte d'Ivoire",
    icone: <IconeInvestir />,
    accent: "from-lagune to-lagune-clair",
  },
  {
    numero: "03",
    titre: "Je veux ouvrir mon capital",
    texte: "Préparation du dossier, identification des investisseurs et négociation : nous vous aidons à accueillir le bon partenaire.",
    href: "/lever-des-fonds",
    lien: "Lever des fonds",
    icone: <IconeCapital />,
    accent: "from-orange to-or",
  },
];

export default function Accueil() {
  const whatsapp = lienWhatsApp();
  const derniers = listerArticles().slice(0, 3);
  const tombstones = references.slice(0, 3);

  return (
    <>
      {/* Bandeau d'accueil immersif */}
      <section className="fond-nuit grain pt-14 pb-28 sm:pt-20 sm:pb-40 lg:pt-24">
        <Aurores />
        <ArcsPont className="absolute inset-x-0 bottom-0 -z-10 h-56 w-full sm:h-80" />
        <Container className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="entree">
              <Surtitre sombre>Fusions-acquisitions · PME et ETI · Côte d&apos;Ivoire et UEMOA</Surtitre>
            </div>
            <h1 className="entree entree-2 text-[2.6rem] leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Combien vaut <span className="texte-degrade">vraiment</span> votre entreprise&nbsp;?
            </h1>
            <p className="entree entree-3 mt-7 max-w-xl text-lg text-white/80 sm:text-xl">
              BIP accompagne les dirigeants de PME dans la valorisation, la cession et la transmission de leur entreprise, en toute
              confidentialité.
            </p>
            <div className="entree entree-4 mt-9 flex flex-wrap gap-4">
              <LienBouton href="/simulateur">Estimer mon entreprise</LienBouton>
              {whatsapp ? (
                <LienBouton href={whatsapp} externe variante="clair">
                  Parler à un associé
                </LienBouton>
              ) : (
                <LienBouton href="/contact" variante="clair">
                  Parler à un associé
                </LienBouton>
              )}
            </div>
            <p className="entree entree-4 mt-7 flex items-center gap-2 text-base text-white/70">
              <span className="text-corail"><IconeCadenas /></span>
              Échange confidentiel et sans engagement.
            </p>
          </div>

          <div className="entree entree-3 relative mx-auto w-full max-w-md">
            <div className="lisere-degrade cadre-arche">
              <Visuel image={images.accueil} priority className="cadre-arche aspect-[4/5]" sizes="(min-width: 1024px) 448px, 90vw" />
            </div>
            <div className="verre absolute -bottom-8 -left-4 max-w-[16rem] rounded-2xl p-4 shadow-2xl sm:-left-10">
              <p className="font-titre text-3xl font-bold text-or">{chiffresCles[0]?.valeur} ans</p>
              <p className="mt-1 text-sm text-white/85">d&apos;expérience en finance d&apos;entreprise et en conseil aux PME</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Manifeste */}
      <Section fond="motif">
        <figure className="revele mx-auto max-w-4xl text-center">
          <span aria-hidden="true" className="texte-degrade block font-titre text-8xl leading-none font-bold">&ldquo;</span>
          <blockquote className="-mt-6 font-titre text-2xl leading-snug font-semibold text-anthracite sm:text-[2.1rem]">
            Une entreprise, c&apos;est une vie de travail, des équipes, des clients, une réputation. Sa transmission mérite le même soin
            que sa construction.
          </blockquote>
          <figcaption className="mt-8 text-lg text-gris">
            Notre rôle : être le <strong className="text-rouge">pont</strong> entre votre histoire et l&apos;avenir de votre entreprise.
          </figcaption>
        </figure>
      </Section>

      {/* Trois parcours */}
      <Section>
        <TitreSection surtitre="Votre projet" titre="Nous vous accompagnons à chaque étape de la vie de votre capital" />
        <div className="grid gap-6 md:grid-cols-3">
          {parcours.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="carte-vivante revele group relative flex flex-col overflow-hidden rounded-2xl border border-bordure bg-white p-7 shadow-sm"
            >
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${p.accent}`} />
              <span aria-hidden="true" className="numero-filigrane absolute -top-2 right-4 text-8xl">{p.numero}</span>
              <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${p.accent}`}>
                {p.icone}
              </span>
              <h3 className="relative mt-6 text-xl">{p.titre}</h3>
              <p className="relative mt-3 flex-1 text-gris">{p.texte}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 font-semibold text-rouge">
                {p.lien}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Pourquoi BIP */}
      <Section fond="nuit" aurores>
        <TitreSection sombre surtitre="Pourquoi BIP" titre="Un conseil indépendant, au service du dirigeant" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {atouts.map((a) => (
            <div key={a.titre} className="verre revele rounded-2xl p-6">
              <div className="degrade-bip lueur flex h-14 w-14 items-center justify-center rounded-full text-white">{a.icone}</div>
              <h3 className="mt-5 text-lg">{a.titre}</h3>
              <p className="mt-2 text-base text-white/75">{a.texte}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Méthode */}
      <Section fond="sable">
        <TitreSection
          surtitre="Notre méthode"
          titre="Un processus structuré en 5 phases"
          intro="Le standard des banques d'affaires, adapté aux PME d'Afrique de l'Ouest."
        />
        <FriseMethode />
        <div className="mt-12">
          <LienBouton href="/methode" variante="secondaire">
            Découvrir la méthode en détail
          </LienBouton>
        </div>
      </Section>

      {/* Deux outils */}
      <Section>
        <TitreSection surtitre="Nos outils gratuits" titre="Faites le point en quelques minutes" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="fond-nuit grain revele flex flex-col rounded-2xl p-8 shadow-xl sm:p-10">
            <svg aria-hidden="true" viewBox="0 0 200 90" className="absolute -right-10 -bottom-4 -z-10 w-56 opacity-20">
              <rect x="10" y="12" width="120" height="14" rx="7" fill="#d7261e" />
              <rect x="40" y="38" width="130" height="14" rx="7" fill="#f26522" />
              <rect x="25" y="64" width="110" height="14" rx="7" fill="#e3a84e" />
              <path d="M95 0 V90" stroke="#fff" strokeDasharray="3 4" />
            </svg>
            <div className="text-corail"><IconeCalcul /></div>
            <h3 className="mt-4 text-2xl">Simulateur de valorisation</h3>
            <p className="mt-3 flex-1 text-white/80">
              Une fourchette de valeur indicative en 5 étapes, fondée sur les méthodes reconnues par les normes internationales :
              multiples de transactions et capitalisation des flux, avec vos hypothèses visibles.
            </p>
            <div className="mt-8">
              <LienBouton href="/simulateur">Estimer mon entreprise</LienBouton>
            </div>
          </div>
          <div className="fond-ivoire revele relative flex flex-col overflow-hidden rounded-2xl border border-sable p-8 shadow-xl sm:p-10">
            <svg aria-hidden="true" viewBox="0 0 120 120" className="absolute -right-14 -bottom-14 w-44 opacity-20">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f2e7d8" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#0f6b6b" strokeWidth="12" strokeDasharray="240 400" strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div className="text-lagune"><IconeRadar /></div>
            <h3 className="mt-4 text-2xl">Score de préparation à la cession</h3>
            <p className="relative mt-3 flex-1 text-gris">
              15 questions pour mesurer si votre entreprise est prête à être cédée : finances, clients, organisation, juridique et
              projet personnel. Avec vos 3 actions prioritaires.
            </p>
            <div className="relative mt-8">
              <LienBouton href="/score-cession" variante="secondaire">
                Calculer mon score
              </LienBouton>
            </div>
          </div>
        </div>
      </Section>

      {/* Chiffres clés, sur photo de l'événement */}
      <section className="fond-nuit grain relative py-20 sm:py-28">
        {images.aPropos.src && (
          <Image src={images.aPropos.src} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-nuit via-nuit/85 to-nuit/60" />
        <Container>
          <TitreSection sombre surtitre="Chiffres clés" titre="BIP en quelques chiffres" />
          <dl className="grid gap-10 sm:grid-cols-3">
            {chiffresCles.map((c) => (
              <div key={c.libelle} className="revele flex flex-col-reverse border-l-2 border-or/60 pl-6">
                <dt className="mt-3 text-base text-white/75">{c.libelle}</dt>
                <dd className="font-titre text-6xl font-bold text-or">{c.valeur}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

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
        <div className="mt-14">
          <p className="mb-5 text-center text-sm font-semibold tracking-[0.2em] text-gris uppercase">Ils nous ont fait confiance</p>
          <BandeauPartenaires />
        </div>
        <div className="mt-10 text-center">
          <Link href="/references" className="font-semibold text-rouge hover:text-rouge-fonce">
            Toutes nos références <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>

      {/* Dernières analyses */}
      <Section>
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
