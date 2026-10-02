import type { Metadata } from "next";
import { images } from "@/config/images";
import { lienWhatsApp, site } from "@/config/site";
import { FormulaireContact } from "@/components/forms/FormulaireContact";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Contact : échange confidentiel avec un associé",
  description: "Contactez BIP Corporate Finance à Abidjan pour un premier échange confidentiel sur votre projet de cession, de transmission, d'acquisition ou de levée de fonds.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const whatsapp = lienWhatsApp();
  return (
    <>
      <PageHero
        image={images.contact}
        surtitre="Contact"
        titre="Parlons de votre projet"
        intro="Un premier échange confidentiel et sans engagement avec un associé BIP. Nous vous répondons rapidement."
      />
      <Section fond="motif">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-black/5 ring-1 ring-black/5 sm:p-8">
            <h2 className="mb-6 text-2xl">Votre demande</h2>
            <FormulaireContact />
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-xl">Coordonnées</h2>
              <address className="mt-4 space-y-2 text-base text-gris not-italic">
                <p className="font-semibold text-anthracite">BIP – Bridge Investment Partners</p>
                <p>{site.coordonnees.adresse}</p>
                <p>
                  Tél. :{" "}
                  <a href={site.coordonnees.telephoneLien} className="whitespace-nowrap text-anthracite underline underline-offset-2 hover:text-rouge">
                    {site.coordonnees.telephone}
                  </a>
                </p>
                <p>
                  E-mail :{" "}
                  <a href={`mailto:${site.coordonnees.email}`} className="break-all text-anthracite underline underline-offset-2 hover:text-rouge">
                    {site.coordonnees.email}
                  </a>
                </p>
                {whatsapp && (
                  <p>
                    WhatsApp :{" "}
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-anthracite underline underline-offset-2 hover:text-rouge">
                      {site.whatsapp.affichage}
                    </a>
                  </p>
                )}
              </address>
              <ul className="mt-4 space-y-2 text-base">
                {whatsapp && (
                  <li>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-rouge hover:text-rouge-fonce">
                      Écrire sur WhatsApp
                    </a>
                  </li>
                )}
                {site.reseaux.linkedin && (
                  <li>
                    <a href={site.reseaux.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-rouge hover:text-rouge-fonce">
                      LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-2xl border-l-4 border-rouge bg-white/80 p-6">
              <p className="font-titre font-semibold">Confidentialité</p>
              <p className="mt-2 text-base text-gris">Vos informations sont traitées de manière strictement confidentielle.</p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
