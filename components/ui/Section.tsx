import type { ReactNode } from "react";
import { Aurores } from "./Atmosphere";
import { Container } from "./Container";

type Fond = "blanc" | "ivoire" | "motif" | "sable" | "nuit";

const classesFond: Record<Fond, string> = {
  blanc: "bg-white",
  ivoire: "bg-ivoire",
  motif: "fond-ivoire",
  sable: "fond-sable",
  nuit: "fond-nuit grain",
};

/**
 * Section de page. `alternee` applique le fond ivoire ; `fond` permet de
 * choisir une autre atmosphère (motif tissé, sable, nuit).
 */
export function Section({
  children,
  alternee = false,
  fond,
  id,
  className = "",
  etroit = false,
  aurores = false,
}: {
  children: ReactNode;
  alternee?: boolean;
  fond?: Fond;
  /** Halos animés en arrière-plan (fond nuit). */
  aurores?: boolean;
  id?: string;
  className?: string;
  etroit?: boolean;
}) {
  const choix: Fond = fond ?? (alternee ? "ivoire" : "blanc");
  return (
    <section id={id} className={`relative ${classesFond[choix]} py-16 sm:py-24 ${className}`}>
      {aurores && <Aurores />}
      <Container className={`relative ${etroit ? "max-w-3xl" : ""}`}>{children}</Container>
    </section>
  );
}

/** Surtitre précédé d'un trait dégradé. */
export function Surtitre({ children, sombre = false, className = "" }: { children: ReactNode; sombre?: boolean; className?: string }) {
  return (
    <p
      className={`mb-4 flex items-center gap-3 text-sm font-semibold tracking-[0.2em] uppercase ${sombre ? "text-corail" : "text-rouge"} ${className}`}
    >
      <span aria-hidden="true" className="degrade-bip inline-block h-0.5 w-8 shrink-0 rounded-full" />
      {children}
    </p>
  );
}

/** Titre de section avec surtitre et soulignement dégradé. */
export function TitreSection({
  surtitre,
  titre,
  intro,
  centre = false,
  niveau = 2,
  sombre = false,
}: {
  surtitre?: string;
  titre: string;
  intro?: ReactNode;
  centre?: boolean;
  niveau?: 1 | 2;
  sombre?: boolean;
}) {
  const Balise = niveau === 1 ? "h1" : "h2";
  return (
    <div className={`revele mb-12 max-w-3xl ${centre ? "centre mx-auto text-center" : ""}`}>
      {surtitre && <Surtitre sombre={sombre} className={centre ? "justify-center" : ""}>{surtitre}</Surtitre>}
      <Balise className={`text-3xl tracking-tight sm:text-[2.6rem] sm:leading-[1.15] ${sombre ? "text-white" : ""}`}>{titre}</Balise>
      {intro && <div className={`mt-6 text-lg ${sombre ? "text-white/75" : "text-gris"}`}>{intro}</div>}
    </div>
  );
}
