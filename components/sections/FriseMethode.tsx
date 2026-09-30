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
    <ol className="grid gap-6 md:grid-cols-5 md:gap-4">
      {PHASES.map((p, i) => (
        <li key={p.titre} className="relative flex gap-4 md:flex-col md:gap-0">
          <div className="flex flex-col items-center md:flex-row">
            <span className="degrade-bip flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-titre text-lg font-bold text-white">
              {i + 1}
            </span>
            {i < PHASES.length - 1 && <span aria-hidden="true" className="w-0.5 flex-1 bg-bordure md:h-0.5 md:w-auto" />}
          </div>
          <div className="pb-2 md:pt-5 md:pr-2">
            <h3 className="text-lg">{p.titre}</h3>
            <p className="mt-2 text-base text-gris">{p.texte}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
