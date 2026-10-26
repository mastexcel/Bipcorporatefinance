import { lienWhatsApp } from "@/config/site";
import { Fond } from "@/components/ui/Fond";
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
    <section className="fond-nuit grain py-20 sm:py-28">
      <Fond nom="final" voile="centre" position="center 55%" />
      <Container className="revele text-center">
        <h2 className="mx-auto max-w-3xl text-3xl tracking-tight text-white sm:text-5xl sm:leading-[1.1]">{titre}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-xl text-white/85">{texte}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LienBouton href="/contact">Prendre contact</LienBouton>
          {whatsapp ? (
            <LienBouton href={whatsapp} externe variante="clair">
              Parler à un associé sur WhatsApp
            </LienBouton>
          ) : (
            <LienBouton href="/simulateur" variante="clair">
              Estimer mon entreprise
            </LienBouton>
          )}
        </div>
      </Container>
    </section>
  );
}
