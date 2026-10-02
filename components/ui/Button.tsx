import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "principal" | "secondaire" | "clair" | "discret";

const styles: Record<Variante, string> = {
  // Bouton principal : dégradé rouge → orange (contraste AA avec le texte blanc).
  principal:
    "degrade-bip lueur text-white hover:-translate-y-0.5 hover:brightness-110",
  secondaire:
    "border-2 border-anthracite text-anthracite bg-white hover:border-rouge hover:text-rouge",
  // Contour clair, pour les fonds sombres.
  clair: "border-2 border-white/70 text-white bg-white/5 hover:bg-white hover:text-anthracite",
  discret: "text-rouge underline underline-offset-4 hover:text-rouge-fonce px-0",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-semibold font-titre transition disabled:cursor-not-allowed disabled:opacity-60";

export function classesBouton(variante: Variante = "principal", className = "") {
  return `${base} ${styles[variante]} ${className}`;
}

export function LienBouton({
  href,
  children,
  variante = "principal",
  className = "",
  externe = false,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variante?: Variante;
  className?: string;
  externe?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  if (externe) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classesBouton(variante, className)} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classesBouton(variante, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Bouton({
  children,
  variante = "principal",
  className = "",
  ...rest
}: { variante?: Variante } & ComponentProps<"button">) {
  return (
    <button className={classesBouton(variante, className)} {...rest}>
      {children}
    </button>
  );
}
