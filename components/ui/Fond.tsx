/**
 * Image de fond d'un bandeau (fichiers dans public/fonds/) : version paysage
 * pour tablette et ordinateur, version portrait pour téléphone. Les fichiers
 * sont déjà compressés en WebP (30 à 70 Ko), d'où une balise <picture> simple.
 */
export type NomFond =
  | "accueil"
  | "ceder"
  | "investir"
  | "lever-des-fonds"
  | "methode"
  | "references"
  | "analyses"
  | "a-propos"
  | "contact"
  | "final"
  | "outils";

export function Fond({
  nom,
  prioritaire = false,
  position = "center 62%",
  voile = "lateral",
}: {
  nom: NomFond;
  prioritaire?: boolean;
  /** Point de cadrage de l'image (object-position). */
  position?: string;
  /** Voile sombre qui garantit la lisibilité du texte : à gauche (texte aligné à gauche) ou centré. */
  voile?: "lateral" | "centre";
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
      <picture>
        <source media="(min-width: 768px)" srcSet={`/fonds/${nom}.webp`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/fonds/${nom}-mobile.webp`}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: position }}
          loading={prioritaire ? "eager" : "lazy"}
          fetchPriority={prioritaire ? "high" : "auto"}
          decoding="async"
        />
      </picture>
      {voile === "lateral" ? (
        <div className="absolute inset-0 bg-gradient-to-b from-nuit/85 via-nuit/65 to-nuit/75 md:bg-gradient-to-r md:from-nuit/90 md:via-nuit/55 md:to-nuit/10" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(18_19_26/0.75),rgb(18_19_26/0.35)_70%)]" />
      )}
    </div>
  );
}
