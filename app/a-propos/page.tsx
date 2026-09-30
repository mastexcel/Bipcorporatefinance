import type { Metadata } from "next";
import Image from "next/image";
import { equipe } from "@/content/equipe";
import { marques, reseauExperts } from "@/content/groupe";
import { images } from "@/config/images";
import { site } from "@/config/site";
import { AppelFinal } from "@/components/sections/AppelFinal";
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
            <p className="mt-4 text-lg text-gris">
              Depuis sa création, BIP a réalisé plus de 35 études de marché et business plans pour des PME et des startups, et
              accompagné leurs dirigeants auprès des banques et des investisseurs. Cette connaissance de terrain des entreprises
              ivoiriennes a conduit à la création de BIP Corporate Finance, dédiée à la valorisation, à la cession, à la
              transmission et à l&apos;ouverture du capital des PME.
            </p>
          </div>
        </div>
      </Section>

      <Section alternee>
        <TitreSection
          surtitre="Le groupe BIP"
          titre="Une société ivoirienne, trois métiers"
          intro="Bridge Investment Partners réunit trois marques sous un même siège à Riviera Faya. BIP Corporate Finance s'appuie sur le pôle conseil, BIP Expertise."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {marques.map((m) => (
            <div key={m.nom} className="rounded-lg border border-bordure bg-white p-6">
              <p className="text-sm font-semibold tracking-widest text-rouge uppercase">{m.pole}</p>
              <h3 className="mt-2 text-xl">{m.nom}</h3>
              <p className="mt-2 text-base text-gris">{m.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[16rem_1fr]">
          <div className="text-center lg:text-left">
            <p className="texte-degrade font-titre text-7xl font-bold">{reseauExperts.total}</p>
            <p className="mt-2 font-titre text-xl font-semibold">{reseauExperts.libelle}</p>
          </div>
          <div>
            <h2 className="souligne-bip text-3xl">Une équipe pluridisciplinaire</h2>
            <p className="mt-6 text-lg text-gris">{reseauExperts.profils}</p>
            <table className="mt-6 w-full max-w-lg text-left text-base">
              <caption className="sr-only">Répartition des experts par domaine</caption>
              <tbody>
                {reseauExperts.domaines.map((d) => (
                  <tr key={d.domaine} className="border-b border-bordure">
                    <th scope="row" className="py-2 pr-4 font-normal text-anthracite">{d.domaine}</th>
                    <td className="py-2 text-right font-semibold tabular-nums">{d.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <TitreSection
          surtitre="L'équipe"
          titre="Un associé senior à vos côtés"
          intro="Chaque dossier est suivi personnellement par un associé, du premier échange jusqu'au closing."
        />
        {equipe.map((m) => (
          <article key={m.nom} className="grid grid-cols-1 gap-10 rounded-lg border border-bordure p-6 sm:p-8 lg:grid-cols-[18rem_1fr]">
            <div>
              {m.photo ? (
                <Image src={m.photo} alt={`Portrait de ${m.nom}`} width={288} height={288} className="aspect-square w-full rounded-md object-cover" />
              ) : (
                <div aria-hidden="true" className="degrade-bip flex aspect-square w-full max-w-72 items-center justify-center rounded-md font-titre text-6xl font-bold text-white">
                  {m.initiales}
                </div>
              )}
              <h3 className="mt-5 text-2xl">{m.nom}</h3>
              <p className="font-semibold text-rouge">{m.fonction}</p>
              <p className="mt-3 text-base text-gris">Langues : {m.langues}</p>
              {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-rouge underline underline-offset-2">
                  Profil LinkedIn
                </a>
              )}
            </div>
            <div className="space-y-8">
              <div className="space-y-4 text-lg text-gris">
                {m.presentation.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div>
                <h4 className="font-titre text-lg font-semibold">Parcours</h4>
                <ul className="mt-4 space-y-4">
                  {m.experiences.map((e) => (
                    <li key={e.titre} className="border-l-2 border-orange pl-4">
                      <p className="font-semibold text-anthracite">
                        {e.titre} <span className="font-normal text-gris">· {e.periode}</span>
                      </p>
                      <p className="mt-1 text-base text-gris">{e.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h4 className="font-titre text-lg font-semibold">Formation et certifications</h4>
                  <ul className="mt-3 space-y-2 text-base text-gris">
                    {m.formation.map((f) => (
                      <li key={f.intitule}>
                        <span className="text-anthracite">{f.intitule}</span> — {f.etablissement}
                        {f.annee ? ` (${f.annee})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-titre text-lg font-semibold">Enseignement</h4>
                  <ul className="mt-3 space-y-2 text-base text-gris">
                    {m.enseignement.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {m.distinctions.length > 0 && (
                    <>
                      <h4 className="mt-6 font-titre text-lg font-semibold">Distinction</h4>
                      <ul className="mt-3 space-y-2 text-base text-gris">
                        {m.distinctions.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
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
