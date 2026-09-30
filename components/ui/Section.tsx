import type { ReactNode } from "react";
import { Container } from "./Container";

/** Section de page ; `alternee` applique le fond gris clair (#F7F7F8). */
export function Section({
  children,
  alternee = false,
  id,
  className = "",
  etroit = false,
}: {
  children: ReactNode;
  alternee?: boolean;
  id?: string;
  className?: string;
  etroit?: boolean;
}) {
  return (
    <section id={id} className={`${alternee ? "bg-fond" : "bg-white"} py-16 sm:py-20 ${className}`}>
      <Container className={etroit ? "max-w-3xl" : ""}>{children}</Container>
    </section>
  );
}

/** Titre de section avec surtitre et soulignement dégradé. */
export function TitreSection({
  surtitre,
  titre,
  intro,
  centre = false,
  niveau = 2,
}: {
  surtitre?: string;
  titre: string;
  intro?: ReactNode;
  centre?: boolean;
  niveau?: 1 | 2;
}) {
  const Balise = niveau === 1 ? "h1" : "h2";
  return (
    <div className={`mb-10 max-w-3xl ${centre ? "centre mx-auto text-center" : ""}`}>
      {surtitre && (
        <p className="mb-3 text-sm font-semibold tracking-widest text-rouge uppercase">{surtitre}</p>
      )}
      <Balise className={`souligne-bip text-3xl sm:text-4xl ${centre ? "centre" : ""}`}>{titre}</Balise>
      {intro && <div className="mt-6 text-lg text-gris">{intro}</div>}
    </div>
  );
}
