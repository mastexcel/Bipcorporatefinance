import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AVERTISSEMENT_SIMULATEUR } from "@/config/valuation";
import { site } from "@/config/site";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description:
    "Conditions générales d'utilisation du site de BIP Corporate Finance : accès au site, simulateur de valorisation et score de préparation, propriété intellectuelle, responsabilité.",
  alternates: { canonical: "/conditions-utilisation" },
};

function Bloc({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl">{titre}</h2>
      <div className="mt-4 space-y-3 text-gris [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-anthracite">{children}</div>
    </section>
  );
}

const lien = "text-rouge underline underline-offset-2";

export default function ConditionsUtilisation() {
  return (
    <Section etroit>
      <TitreSection
        niveau={1}
        titre="Conditions générales d'utilisation"
        intro={
          <>
            Les présentes conditions encadrent l&apos;utilisation du site{" "}
            <span className="[overflow-wrap:anywhere]">{site.url.replace("https://", "")}</span>, édité par {site.societe.denomination}. En naviguant
            sur le site, vous les acceptez.
          </>
        }
      />
      <p className="text-base text-gris">Dernière mise à jour : 3 octobre 2026.</p>

      <Bloc titre="1. Éditeur du site">
        <p>
          Le site est édité par {site.societe.denomination}, {site.societe.formeJuridique.replace("Société", "société")} au capital de{" "}
          {site.societe.capital}, immatriculée au RCCM sous le numéro {site.societe.rccm}. Les informations complètes figurent dans les{" "}
          <Link href="/mentions-legales" className={lien}>mentions légales</Link>.
        </p>
      </Bloc>

      <Bloc titre="2. Objet du site">
        <p>
          Le site présente les services de conseil en fusions-acquisitions de BIP Corporate Finance (valorisation, cession, transmission,
          acquisition et levée de fonds) et met à disposition, gratuitement, deux outils d&apos;aide à la réflexion : un simulateur de
          valorisation et un score de préparation à la cession.
        </p>
      </Bloc>

      <Bloc titre="3. Accès au site">
        <p>
          Le site est accessible gratuitement, sans création de compte. BIP s&apos;efforce d&apos;en assurer la disponibilité mais ne peut
          la garantir : l&apos;accès peut être interrompu pour maintenance, mise à jour ou en cas d&apos;incident technique.
        </p>
      </Bloc>

      <Bloc titre="4. Simulateur de valorisation et score de préparation">
        <p>{AVERTISSEMENT_SIMULATEUR}</p>
        <p>
          Le score de préparation à la cession est un outil d&apos;autodiagnostic : il ne constitue ni un audit, ni un avis juridique ou
          fiscal. Les résultats des deux outils reposent exclusivement sur les informations que vous saisissez, que BIP ne vérifie pas.
        </p>
        <p>
          Les hypothèses retenues sont affichées avec chaque résultat du simulateur ; les méthodes d&apos;évaluation sont expliquées
          dans l&apos;article{" "}
          <Link href="/analyses/trois-methodes-evaluer-pme" className={lien}>Les 3 méthodes pour évaluer une PME</Link>.
        </p>
      </Bloc>

      <Bloc titre="5. Engagements de l'utilisateur">
        <ul>
          <li>Fournir, dans les formulaires, des informations exactes et vous concernant ;</li>
          <li>Ne pas utiliser le site à des fins illicites, ni pour envoyer des messages non sollicités ;</li>
          <li>Ne pas tenter de perturber le fonctionnement du site, d&apos;en contourner les protections ou d&apos;en extraire les contenus de manière automatisée.</li>
        </ul>
      </Bloc>

      <Bloc titre="6. Propriété intellectuelle">
        <p>
          Les textes, analyses, logos, photographies, graphiques et outils du site sont la propriété de BIP ou utilisés avec
          l&apos;autorisation de leurs titulaires. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite
          préalable de BIP est interdite. Le partage d&apos;un lien vers une page du site est libre.
        </p>
      </Bloc>

      <Bloc titre="7. Responsabilité">
        <p>
          Les contenus du site sont fournis à titre d&apos;information générale. Ils ne remplacent pas un conseil personnalisé : toute
          décision de cession, d&apos;acquisition ou d&apos;investissement doit être prise avec l&apos;accompagnement de professionnels
          (conseil financier, avocat, expert-comptable). BIP ne saurait être tenu responsable d&apos;une décision prise sur la seule base
          des informations ou des résultats affichés sur le site.
        </p>
      </Bloc>

      <Bloc titre="8. Liens vers d'autres sites">
        <p>
          Le site contient des liens vers des services tiers (WhatsApp, LinkedIn, etc.). BIP n&apos;exerce aucun contrôle sur ces services
          et décline toute responsabilité quant à leur contenu ou à leur fonctionnement.
        </p>
      </Bloc>

      <Bloc titre="9. Données personnelles et cookies">
        <p>
          Le traitement de vos données et l&apos;utilisation des cookies sont décrits dans la{" "}
          <Link href="/confidentialite" className={lien}>politique de confidentialité</Link>.
        </p>
      </Bloc>

      <Bloc titre="10. Modification des conditions">
        <p>
          BIP peut modifier les présentes conditions à tout moment. La version applicable est celle publiée sur le site au moment de
          votre visite.
        </p>
      </Bloc>

      <Bloc titre="11. Droit applicable">
        <p>
          Les présentes conditions sont régies par le droit ivoirien. À défaut d&apos;accord amiable, tout litige relatif à
          l&apos;utilisation du site relève des juridictions compétentes d&apos;Abidjan.
        </p>
        <p>
          Pour toute question :{" "}
          <a href={`mailto:${site.coordonnees.email}`} className={lien}>{site.coordonnees.email}</a>.
        </p>
      </Bloc>
    </Section>
  );
}
