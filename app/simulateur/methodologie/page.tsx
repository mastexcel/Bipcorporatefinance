import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ajustementsQualitatifs as aq,
  croissanceLongTerme,
  decoteTaille,
  LIBELLES_EFFECTIF,
  multiplesSectoriels,
  PAYS,
  primeMarcheMature,
  primeRisquePays,
  primeTaille,
  reglesCalcul,
  tauxImpotSocietes,
  tauxSansRisque,
  TRANCHES_EFFECTIF,
  type MetaParametre,
} from "@/config/valuation";
import { Section } from "@/components/ui/Section";
import { parametresEnVigueur, parametresManquants } from "@/lib/valuation";
import { formaterAjustement, formaterPoints, formaterPourcentage } from "@/lib/valuation/format";

/** Page interne de relecture par l'équipe BIP : non indexée. */
export const metadata: Metadata = {
  title: "Méthodologie du simulateur (interne)",
  robots: { index: false, follow: false },
};

function Statut({ meta }: { meta: MetaParametre }) {
  return (
    <p className="mt-1 text-sm text-gris">
      Source : {meta.source} · Mise à jour : {meta.dateMiseAJour} ·{" "}
      <span className={meta.statut === "valide" ? "font-semibold text-[#1f7a45]" : "a-completer"}>
        {meta.statut === "valide" ? "Validé" : "À valider"}
      </span>
    </p>
  );
}

function Formule({ children }: { children: ReactNode }) {
  return <pre className="mt-3 overflow-x-auto rounded-md bg-fond p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">{children}</pre>;
}

const taux = (v: number | null, d = 2) => (v === null ? "[À COMPLÉTER]" : formaterPourcentage(v, d));

export default function Methodologie() {
  const manquants = parametresManquants(parametresEnVigueur);
  return (
    <Section etroit>
      <p className="mb-3 text-sm font-semibold tracking-widest text-rouge uppercase">Document interne — non indexé</p>
      <h1 className="souligne-bip text-3xl sm:text-4xl">Méthodologie du simulateur de valorisation</h1>
      <p className="mt-6 text-gris">
        Cette page présente les formules et les paramètres en vigueur (config/valuation.ts), pour relecture par l&apos;équipe BIP.
      </p>
      {manquants.length > 0 ? (
        <p role="alert" className="mt-4 rounded-md border border-rouge p-4 text-rouge-fonce">
          Paramètres manquants (le build de production échouera) : {manquants.join(", ")}
        </p>
      ) : (
        <p className="mt-4 rounded-md bg-[#eef8f2] p-4 text-anthracite">Tous les paramètres obligatoires sont renseignés.</p>
      )}

      <h2 className="mt-12 text-2xl">A. EBE retraité</h2>
      <Formule>
        EBE retraité = EBE déclaré{"\n"}+ (rémunération actuelle du dirigeant − coût d&apos;un DG salarié){"\n"}+ charges exceptionnelles −
        produits exceptionnels{"\n"}+ (loyer actuel − loyer de marché)
      </Formule>

      <h2 className="mt-12 text-2xl">B. Approche par le marché (multiples de transactions)</h2>
      <Formule>
        VE = EBE retraité × multiple sectoriel (bas / central / haut){"\n"}   × (1 + ajustements qualitatifs, plafonnés de{" "}
        {formaterAjustement(aq.plafond.min)} à {formaterAjustement(aq.plafond.max)}){"\n"}   × (1 − décote de taille){"\n\n"}Si EBE retraité ≤ 0 : VE
        = CA × multiple de CA × (1 + ajustements) × (1 − décote de taille) × (1 − {formaterPourcentage(reglesCalcul.decoteEBENegatif, 0)})
      </Formule>
      <p className="mt-3 text-base text-gris">
        Pas de décote d&apos;illiquidité : les multiples proviennent de transactions sur des PME non cotées. La décote de taille ne
        s&apos;applique qu&apos;à cette approche (la prime de taille s&apos;applique à l&apos;approche par le revenu).
      </p>
      <h3 className="mt-6 text-lg">Multiples sectoriels</h3>
      <Statut meta={multiplesSectoriels} />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-anthracite">
              <th scope="col" className="py-2 pr-3">Secteur</th>
              <th scope="col" className="py-2 pr-3">EBE bas – central – haut</th>
              <th scope="col" className="py-2">CA bas – central – haut</th>
            </tr>
          </thead>
          <tbody>
            {multiplesSectoriels.secteurs.map((s) => (
              <tr key={s.id} className="border-b border-bordure">
                <th scope="row" className="py-2 pr-3 font-normal">{s.libelle}</th>
                <td className="py-2 pr-3 tabular-nums">{s.multipleEBE.bas} – {s.multipleEBE.central} – {s.multipleEBE.haut}</td>
                <td className="py-2 tabular-nums">{s.multipleCA.bas} – {s.multipleCA.central} – {s.multipleCA.haut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="mt-6 text-lg">Décote de taille</h3>
      <Statut meta={decoteTaille} />
      <ul className="mt-2 text-base text-gris">
        {TRANCHES_EFFECTIF.map((t) => (
          <li key={t}>{LIBELLES_EFFECTIF[t]} : {formaterPourcentage(decoteTaille.valeurs[t], 0)}</li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl">C. Approche par le revenu (capitalisation du flux normatif)</h2>
      <Formule>
        Flux normatif = (EBE retraité − dotations) × (1 − IS) + dotations − investissements de maintien (= dotations){"\n"}Taux = taux
        sans risque + prime de marché + prime pays + prime de taille + prime spécifique (0 à {formaterPoints(aq.primeSpecifique.max)}){"\n"}VE = flux ×
        (1 + g) / (taux − g) ; fourchette : taux ± {formaterPoints(reglesCalcul.ecartTauxFourchette)}{"\n"}Non affichée si flux ≤ 0.
      </Formule>
      <dl className="mt-4 space-y-4 text-base">
        {[
          { l: "Taux sans risque (Bund 10 ans)", v: taux(tauxSansRisque.valeur), m: tauxSansRisque },
          { l: "Prime de risque du marché mature", v: taux(primeMarcheMature.valeur), m: primeMarcheMature },
          { l: "Croissance à long terme (g)", v: taux(croissanceLongTerme.valeur, 1), m: croissanceLongTerme },
          { l: "Taux d'impôt sur les sociétés", v: taux(tauxImpotSocietes.valeur, 0), m: tauxImpotSocietes },
        ].map((x) => (
          <div key={x.l}>
            <dt className="font-semibold">{x.l} : {x.v}</dt>
            <dd><Statut meta={x.m} /></dd>
          </div>
        ))}
        <div>
          <dt className="font-semibold">Prime de risque pays</dt>
          <dd>
            <ul className="text-gris">
              {PAYS.map((p) => (
                <li key={p.code}>
                  {p.libelle} : {primeRisquePays.valeurs[p.code] === null ? <span className="a-completer">non renseignée (prime CI appliquée)</span> : taux(primeRisquePays.valeurs[p.code])}
                </li>
              ))}
            </ul>
            <Statut meta={primeRisquePays} />
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Prime de taille PME</dt>
          <dd>
            <ul className="text-gris">
              {TRANCHES_EFFECTIF.map((t) => (
                <li key={t}>{LIBELLES_EFFECTIF[t]} : {formaterPoints(primeTaille.valeurs[t])}</li>
              ))}
            </ul>
            <Statut meta={primeTaille} />
          </dd>
        </div>
      </dl>

      <h2 className="mt-12 text-2xl">D. Approche patrimoniale</h2>
      <Formule>Actif net comptable = capitaux propres (repère et plancher : note si valeur des titres &lt; actif net)</Formule>

      <h2 className="mt-12 text-2xl">E. Synthèse et pont de valeur</h2>
      <Formule>
        VE retenue = {reglesCalcul.ponderation.marche * 100} % marché + {reglesCalcul.ponderation.revenu * 100} % revenu (100 % sur l&apos;une si
        l&apos;autre manque){"\n"}Valeur des titres = VE − dettes financières + trésorerie − dettes fiscales et sociales échues{"\n"}Arrondi au
        million ; valeurs négatives ramenées à 0 avec message.
      </Formule>
      <Statut meta={reglesCalcul} />

      <h2 className="mt-12 text-2xl">Ajustements qualitatifs</h2>
      <Statut meta={aq} />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-anthracite">
              <th scope="col" className="py-2 pr-3">Critère</th>
              <th scope="col" className="py-2 pr-3">Multiple (marché)</th>
              <th scope="col" className="py-2">Prime spécifique (revenu)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Dépendance au dirigeant : non", aq.dependanceDirigeant.non],
              ["Dépendance au dirigeant : en partie", aq.dependanceDirigeant.en_partie],
              ["Premier client > 30 % du CA", aq.premierClientPlus30],
              ["5 premiers clients > 60 % du CA", aq.top5ClientsPlus60],
              ["Pas d'expert-comptable", aq.sansExpertComptable],
              ["Comptes certifiés", aq.comptesCertifies],
              ["Fiscal/social non à jour", aq.fiscalSocial.non],
              ["Fiscal/social : je ne sais pas", aq.fiscalSocial.ne_sait_pas],
              ["Contrats non écrits", aq.contratsNonEcrits],
              ["CA récurrent > 50 %", aq.recurrentPlus50],
              ["Équipe de direction en place", aq.equipeDirection],
              ["Litige important", aq.litigeImportant],
              ["Croissance du CA > 10 %/an", aq.croissanceForte],
              ["Baisse du CA > 10 %/an", aq.baisseForte],
              ["Entreprise de moins de 3 ans", aq.entrepriseRecente],
            ].map(([libelle, a]) => {
              const aj = a as { multiple: number; points: number };
              return (
                <tr key={libelle as string} className="border-b border-bordure">
                  <th scope="row" className="py-2 pr-3 font-normal">{libelle as string}</th>
                  <td className="py-2 pr-3 tabular-nums">{formaterAjustement(aj.multiple)}</td>
                  <td className="py-2 tabular-nums">{formaterPoints(aj.points)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
