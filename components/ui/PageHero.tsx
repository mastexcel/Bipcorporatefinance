import type { ReactNode } from "react";
import type { EmplacementImage } from "@/config/images";
import { ArcsPont, Aurores } from "./Atmosphere";
import { Container } from "./Container";
import { Surtitre } from "./Section";
import { Visuel } from "./Visuel";

/** En-tête immersif des pages intérieures : fond nuit, halos et arche photo. */
export function PageHero({
  surtitre,
  titre,
  intro,
  image,
  children,
  chevauchement = false,
}: {
  surtitre?: string;
  titre: string;
  intro?: ReactNode;
  image?: EmplacementImage;
  children?: ReactNode;
  /** Laisse de la place sous le texte pour une carte qui chevauche le bandeau. */
  chevauchement?: boolean;
}) {
  return (
    <section className={`fond-nuit grain pt-16 sm:pt-24 ${chevauchement ? "pb-32 sm:pb-40" : "pb-16 sm:pb-24"}`}>
      <Aurores />
      <ArcsPont className="absolute inset-x-0 bottom-0 -z-10 h-56 w-full opacity-70 sm:h-72" />
      <Container className={image ? "grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]" : ""}>
        <div className="max-w-3xl">
          {surtitre && (
            <div className="entree">
              <Surtitre sombre>{surtitre}</Surtitre>
            </div>
          )}
          <h1 className="entree entree-2 text-4xl tracking-tight text-white sm:text-5xl sm:leading-[1.1]">{titre}</h1>
          {intro && <div className="entree entree-3 mt-6 text-lg text-white/80 sm:text-xl">{intro}</div>}
          {children && <div className="entree entree-4 mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
        {image && (
          <div className="entree entree-3 relative hidden lg:block">
            <div className="lisere-degrade cadre-arche mx-auto max-w-sm">
              <Visuel image={image} priority className="cadre-arche aspect-[4/5]" sizes="(min-width: 1024px) 384px, 0px" />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
