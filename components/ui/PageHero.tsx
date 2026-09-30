import type { ReactNode } from "react";
import type { EmplacementImage } from "@/config/images";
import { Container } from "./Container";
import { Visuel } from "./Visuel";

/** En-tête des pages intérieures. */
export function PageHero({
  surtitre,
  titre,
  intro,
  image,
  children,
}: {
  surtitre?: string;
  titre: string;
  intro?: ReactNode;
  image?: EmplacementImage;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-bordure bg-fond py-14 sm:py-20">
      <Container className={image ? "grid items-center gap-10 lg:grid-cols-2" : ""}>
        <div className="max-w-3xl">
          {surtitre && <p className="mb-3 text-sm font-semibold tracking-widest text-rouge uppercase">{surtitre}</p>}
          <h1 className="souligne-bip text-4xl sm:text-5xl">{titre}</h1>
          {intro && <div className="mt-6 text-lg text-gris sm:text-xl">{intro}</div>}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
        {image && <Visuel image={image} priority className="hidden aspect-[4/3] lg:block" />}
      </Container>
    </section>
  );
}
