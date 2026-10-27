/** Frise des 5 phases de la méthode BIP. */
export const PHASES = [
  { titre: "Diagnostic et valorisation", texte: "Analyse de l'entreprise, retraitement des comptes et fourchette de valeur argumentée." },
  { titre: "Préparation", texte: "Dossier de présentation, mémorandum d'information et data room." },
  { titre: "Approche ciblée des acquéreurs", texte: "Teaser anonyme, sélection des acquéreurs et signature d'accords de confidentialité." },
  { titre: "Négociation et due diligence", texte: "Comparaison des offres, négociation du prix et des garanties, suivi des audits." },
  { titre: "Closing et transition", texte: "Signature, paiement du prix et accompagnement de la transition." },
];

export function FriseMethode() {
  return (
    <ol className="relative grid gap-6 md:grid-cols-5 md:gap-4">
      {/* Fil conducteur : le « pont » qui relie les étapes. */}
      <span
        aria-hidden="true"
        className="absolute top-6 right-[10%] left-[10%] hidden h-0.5 bg-gradient-to-r from-rouge via-orange to-or md:block"
      />
      {PHASES.map((p, i) => (
        <li key={p.titre} className="revele relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
          <div className="flex flex-col items-center">
            <span className="degrade-bip lueur relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-titre text-lg font-bold text-white ring-8 ring-ivoire">
              {i + 1}
            </span>
            {i < PHASES.length - 1 && <span aria-hidden="true" className="w-0.5 flex-1 bg-gradient-to-b from-orange/60 to-transparent md:hidden" />}
          </div>
          <div className="pb-2 md:mt-5 md:rounded-xl md:bg-white/70 md:p-4 md:shadow-sm md:ring-1 md:ring-black/5">
            <h3 className="text-lg">{p.titre}</h3>
            <p className="mt-2 text-base text-gris">{p.texte}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
