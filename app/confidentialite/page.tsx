import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { ACompleter } from "@/components/ui/ACompleter";
import { Section, TitreSection } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Protection des données personnelles sur le site de BIP Corporate Finance, conformément à la loi ivoirienne n° 2013-450 du 19 juin 2013.",
  alternates: { canonical: "/confidentialite" },
};

function Bloc({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl">{titre}</h2>
      <div className="mt-4 space-y-3 text-gris [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-anthracite">{children}</div>
    </section>
  );
}

export default function Confidentialite() {
  return (
    <Section etroit>
      <TitreSection
        niveau={1}
        titre="Politique de confidentialité"
        intro="La présente politique décrit la manière dont Bridge Investment Partners (BIP) traite vos données à caractère personnel, conformément à la loi ivoirienne n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel. L'autorité de contrôle est l'Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire (ARTCI)."
      />
      <p className="text-base text-gris">
        Dernière mise à jour : <ACompleter>DATE</ACompleter>
      </p>

      <Bloc titre="1. Responsable du traitement">
        <p>
          {site.societe.denomination}, SARL au capital de {site.societe.capital}, immatriculée au RCCM d&apos;Abidjan sous le
          numéro {site.societe.rccm}, dont le siège est situé {site.societe.siege}.
        </p>
        <p>
          Contact pour toute question relative à vos données :{" "}
          <a href={`mailto:${site.coordonnees.email}`} className="text-rouge underline underline-offset-2">{site.coordonnees.email}</a>.
        </p>
        <p>
          Formalités auprès de l&apos;ARTCI : <ACompleter>RÉFÉRENCE DE LA DÉCLARATION OU DE L&apos;AUTORISATION</ACompleter>
        </p>
      </Bloc>

      <Bloc titre="2. Données collectées">
        <ul>
          <li>
            <strong>Formulaires de contact et de rendez-vous</strong> : nom, fonction, entreprise, téléphone, e-mail, type et horizon du
            projet, message.
          </li>
          <li>
            <strong>Simulateur de valorisation</strong> : les informations financières et qualitatives que vous saisissez. Elles restent
            dans votre navigateur pendant votre session et ne nous sont transmises que si vous validez le formulaire de contact du
            simulateur. Elles ne sont stockées dans aucune base de données du site.
          </li>
          <li>
            <strong>Score de préparation à la cession</strong> : vos réponses au questionnaire, transmises uniquement si vous validez le
            formulaire de contact.
          </li>
          <li>
            <strong>Formulaire « critères d&apos;investissement »</strong> : type d&apos;investisseur, secteurs, taille de ticket, type de
            participation, pays et coordonnées.
          </li>
          <li>
            <strong>Mesure d&apos;audience</strong> (uniquement avec votre consentement) : données de navigation collectées par Google
            Analytics et Meta Pixel.
          </li>
        </ul>
      </Bloc>

      <Bloc titre="3. Finalités et bases légales">
        <ul>
          <li>Répondre à vos demandes et organiser un échange avec un associé (base légale : votre consentement et les mesures précontractuelles prises à votre demande).</li>
          <li>Vous adresser la synthèse de votre simulation ou de votre score (base légale : votre consentement).</li>
          <li>Constituer le réseau d&apos;investisseurs et d&apos;acquéreurs de BIP (base légale : votre consentement).</li>
          <li>Mesurer l&apos;audience du site (base légale : votre consentement, recueilli par le bandeau cookies).</li>
          <li>Protéger le site contre les abus et le spam (base légale : l&apos;intérêt légitime de BIP).</li>
        </ul>
      </Bloc>

      <Bloc titre="4. Destinataires">
        <p>
          Vos données sont destinées exclusivement aux associés et collaborateurs habilités de BIP. Elles ne sont ni vendues, ni louées, ni
          cédées à des tiers.
        </p>
        <p>Elles sont traitées, pour le compte de BIP, par les prestataires techniques suivants :</p>
        <ul>
          <li>Vercel (hébergement du site) ;</li>
          <li>Resend (envoi des e-mails) ;</li>
          <li>Cloudflare Turnstile (protection anti-spam) ;</li>
          <li>Google (Google Analytics) et Meta (Meta Pixel), uniquement si vous y avez consenti.</li>
        </ul>
        <p>
          Certains de ces prestataires sont situés hors de Côte d&apos;Ivoire. BIP veille à ce que ces transferts respectent les
          conditions prévues par la loi n° 2013-450 et, le cas échéant, les formalités requises auprès de l&apos;ARTCI.{" "}
          <ACompleter>À VALIDER PAR UN JURISTE</ACompleter>
        </p>
      </Bloc>

      <Bloc titre="5. Durée de conservation">
        <ul>
          <li>
            Demandes de contact et synthèses de simulation : <ACompleter>DURÉE À VALIDER, ex. 3 ans après le dernier contact</ACompleter>.
          </li>
          <li>
            Réseau d&apos;investisseurs : <ACompleter>DURÉE À VALIDER</ACompleter>, ou jusqu&apos;à votre demande de suppression.
          </li>
          <li>Mesure d&apos;audience : 13 mois maximum pour les cookies, selon les paramètres des outils.</li>
          <li>Données de limitation d&apos;envoi (adresse IP) : conservées en mémoire quelques minutes, sans stockage durable.</li>
        </ul>
      </Bloc>

      <Bloc titre="6. Vos droits">
        <p>
          Conformément à la loi n° 2013-450, vous disposez d&apos;un droit d&apos;<strong>accès</strong>, de{" "}
          <strong>rectification</strong>, de <strong>suppression</strong> et d&apos;<strong>opposition</strong> au traitement de vos
          données. Vous pouvez retirer votre consentement à tout moment.
        </p>
        <p>
          Pour exercer ces droits, écrivez-nous à{" "}
          <a href={`mailto:${site.coordonnees.email}`} className="text-rouge underline underline-offset-2">{site.coordonnees.email}</a> en précisant votre demande. Si vous estimez que
          vos droits ne sont pas respectés, vous pouvez saisir l&apos;ARTCI.
        </p>
      </Bloc>

      <Bloc titre="7. Cookies et mesure d'audience">
        <p>
          Aucun cookie de mesure d&apos;audience n&apos;est déposé sans votre consentement. Le bandeau affiché lors de votre première visite
          vous permet d&apos;accepter ou de refuser, aussi simplement l&apos;un que l&apos;autre. Vous pouvez modifier votre choix à tout
          moment via le lien « Gérer les cookies » en bas de chaque page.
        </p>
        <p>
          Votre choix est mémorisé dans votre navigateur. Cloudflare Turnstile, qui protège les formulaires, peut utiliser des données
          techniques strictement nécessaires à la détection des robots.
        </p>
        <p>Vos données financières ne sont jamais transmises aux outils de mesure d&apos;audience.</p>
      </Bloc>

      <Bloc titre="8. Sécurité">
        <p>
          Le site est accessible uniquement en HTTPS. Les formulaires sont protégés contre les envois automatisés, et les données
          financières saisies ne sont ni enregistrées dans une base de données, ni inscrites dans les journaux techniques du serveur.
        </p>
      </Bloc>
    </Section>
  );
}
