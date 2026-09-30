import type { PontValeur as TypePont } from "@/lib/valuation";
import { formaterFCFA } from "@/lib/valuation/format";

/**
 * Pont de valeur (hypothèse centrale) : valeur d'entreprise → valeur des titres.
 * Présenté comme un tableau de passage (lisible sur mobile et au lecteur d'écran).
 */
export function PontValeur({ pont }: { pont: TypePont }) {
  const lignes: { libelle: string; detail?: string; montant: number; total?: boolean; signe?: string }[] = [
    { libelle: "Valeur d'entreprise", detail: "Valeur de l'activité, dette comprise", montant: pont.valeurEntreprise.central, total: true },
    {
      libelle: "Dette financière nette",
      detail: `Dettes financières ${formaterFCFA(pont.dettesFinancieres)} − trésorerie ${formaterFCFA(pont.tresorerie)}`,
      montant: -pont.detteFinanciereNette,
      signe: pont.detteFinanciereNette >= 0 ? "−" : "+",
    },
    { libelle: "Autres dettes assimilées", detail: "Dettes fiscales et sociales échues", montant: -pont.autresDettes, signe: "−" },
    { libelle: "Valeur des titres", detail: "Ce qui revient aux actionnaires", montant: pont.valeurTitres.central, total: true },
  ];
  return (
    <table className="w-full text-left">
      <caption className="sr-only">Pont de valeur, hypothèse centrale</caption>
      <tbody>
        {lignes.map((l, i) => (
          <tr key={l.libelle} className={`${l.total ? "bg-fond" : ""} ${i === lignes.length - 1 ? "border-t-2 border-anthracite" : "border-b border-bordure"}`}>
            <th scope="row" className="px-3 py-3 font-normal">
              <span className={`block ${l.total ? "font-titre font-semibold text-anthracite" : "text-anthracite"}`}>
                {!l.total && <span aria-hidden="true" className="mr-1 text-gris">{l.signe}</span>}
                {l.libelle}
              </span>
              {l.detail && <span className="block text-sm text-gris">{l.detail}</span>}
            </th>
            <td className={`px-3 py-3 text-right whitespace-nowrap tabular-nums ${l.total ? "font-titre font-semibold" : ""}`}>
              {formaterFCFA(l.montant)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
