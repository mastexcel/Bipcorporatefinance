import { lienWhatsApp } from "@/config/site";
import { LienBouton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/** Appel à l'action final, commun à plusieurs pages. */
export function AppelFinal({
  titre = "Un projet de cession, de transmission ou d'ouverture de capital ?",
  texte = "Parlons-en, en toute confidentialité.",
}: {
  titre?: string;
  texte?: string;
}) {
  const whatsapp = lienWhatsApp();
  return (
    <section className="bg-anthracite py-16 text-white sm:py-20">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl text-3xl text-white sm:text-4xl">{titre}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-xl text-white/90">{texte}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <LienBouton href="/contact">Prendre contact</LienBouton>
          {whatsapp ? (
            <LienBouton href={whatsapp} externe variante="secondaire">
              Parler à un associé sur WhatsApp
            </LienBouton>
          ) : (
            <LienBouton href="/simulateur" variante="secondaire">
              Estimer mon entreprise
            </LienBouton>
          )}
        </div>
      </Container>
    </section>
  );
}
