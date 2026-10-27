"use client";

import { FootballField } from "@/components/charts/FootballField";
import { PontValeur } from "@/components/charts/PontValeur";
import { FormulaireLead } from "@/components/forms/FormulaireLead";
import { AVERTISSEMENT_SIMULATEUR, PAYS } from "@/config/valuation";
import type { DonneesSimulation, PointAnalyse, ResultatValorisation } from "@/lib/valuation";
import { formaterAjustement, formaterFCFA, formaterMillions, formaterPoints, formaterPourcentage } from "@/lib/valuation/format";

function Montant({ libelle, valeur, principal = false }: { libelle: string; valeur: number; principal?: boolean }) {
  return (
    <div className={`rounded-lg p-5 text-center ${principal ? "border-2 border-rouge bg-white shadow-md" : "bg-white"}`}>
      <p className="text-sm font-semibold tracking-wider text-gris uppercase">{libelle}</p>
      <p className={`mt-2 font-titre font-bold tabular-nums ${principal ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
        {formaterMillions(valeur)}
      </p>
      <p className="mt-1 text-sm text-gris tabular-nums">{formaterFCFA(valeur)}</p>
    </div>
  );
}

function ListePoints({ titre, points, favorable }: { titre: string; points: PointAnalyse[]; favorable: boolean }) {
  return (
    <div className="rounded-lg border border-bordure bg-white p-6">
      <h3 className="flex items-center gap-2 text-lg">
        <span aria-hidden="true" className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-white ${favorable ? "bg-[#1f8f4e]" : "bg-rouge"}`}>
          {favorable ? "+" : "!"}
        </span>
        {titre}
      </h3>
      {points.length === 0 ? (
        <p className="mt-4 text-base text-gris">Aucun élément particulier relevé.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {points.map((p) => (
            <li key={p.id} className="text-base">
              <span className="text-anthracite">{p.libelle}</span>
              {p.effetMultiple !== 0 && (
                <span className="block text-sm text-gris">
                  Effet indicatif : {formaterAjustement(p.effetMultiple)} sur le multiple, soit environ {p.effetValeur > 0 ? "+" : ""}
                  {formaterMillions(p.effetValeur)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Resultat({
  resultat: r,
  donnees,
  onRecommencer,
  onModifier,
}: {
  resultat: ResultatValorisation;
  donnees: DonneesSimulation;
  onRecommencer: () => void;
  onModifier: () => void;
}) {
  const pays = PAYS.find((p) => p.code === donnees.entreprise.pays)?.libelle ?? donnees.entreprise.pays;

  return (
    <div className="space-y-12">
      {/* 1. Fourchette */}
      <section aria-labelledby="res-fourchette">
        <h2 id="res-fourchette" className="text-2xl">Fourchette indicative de valeur de vos titres</h2>
        <p className="mt-2 text-base text-gris">
          {r.secteur.libelle} · {pays} · arrondi au million de FCFA
        </p>
        <div className="mt-6 grid gap-4 rounded-lg bg-fond p-4 sm:grid-cols-3 sm:items-center">
          <Montant libelle="Valeur basse" valeur={r.valeurTitres.bas} />
          <Montant libelle="Valeur centrale" valeur={r.valeurTitres.central} principal />
          <Montant libelle="Valeur haute" valeur={r.valeurTitres.haut} />
        </div>
        {r.messages.length > 0 && (
          <ul className="mt-6 space-y-3">
            {r.messages.map((m) => (
              <li key={m} className="rounded-md border-l-4 border-orange bg-[#fff7f3] p-4 text-base text-anthracite">
                {m}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 2. Football field */}
      <section aria-labelledby="res-methodes">
        <h2 id="res-methodes" className="text-2xl">Valeur des titres selon chaque méthode</h2>
        <p className="mt-2 mb-6 text-base text-gris">
          Chaque barre montre la fourchette obtenue par une méthode ; la barre rouge est la fourchette retenue (pondération{" "}
          {r.ponderation.marche * 100} % marché{r.ponderation.revenu > 0 ? ` / ${r.ponderation.revenu * 100} % revenu` : ""}). Les
          repères ne sont pas pondérés.
        </p>
        <FootballField barres={r.footballField} />
      </section>

      {/* 3. Pont de valeur */}
      <section aria-labelledby="res-pont">
        <h2 id="res-pont" className="text-2xl">De la valeur d&apos;entreprise à la valeur de vos titres</h2>
        <p className="mt-2 mb-6 text-base text-gris">Hypothèse centrale.</p>
        <PontValeur pont={r.pont} />
      </section>

      {/* 4. Hypothèses */}
      <section>
        <details className="rounded-lg border border-bordure bg-white p-5">
          <summary className="cursor-pointer font-titre text-lg font-semibold">Hypothèses utilisées</summary>
          <dl className="mt-5 grid gap-x-8 gap-y-3 text-base sm:grid-cols-2">
            <div>
              <dt className="font-semibold">EBE retraité</dt>
              <dd className="text-gris">
                {formaterFCFA(r.ebe.ebeRetraite)} (EBE déclaré : {formaterFCFA(r.ebe.ebeDeclare)})
              </dd>
            </div>
            <div>
              <dt className="font-semibold">{r.marche.methode === "ebe" ? "Multiples d'EBE du secteur" : "Multiples de CA du secteur"}</dt>
              <dd className="text-gris">
                {r.marche.multiplesReference.bas} – {r.marche.multiplesReference.central} – {r.marche.multiplesReference.haut} (référence) ;{" "}
                {r.marche.multiplesEffectifs.bas.toFixed(2).replace(".", ",")} – {r.marche.multiplesEffectifs.central.toFixed(2).replace(".", ",")} –{" "}
                {r.marche.multiplesEffectifs.haut.toFixed(2).replace(".", ",")} (retenus)
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Ajustements qualitatifs du multiple</dt>
              <dd className="text-gris">
                {formaterAjustement(r.ajustements.cumulMultiple)}
                {r.ajustements.plafondAtteint && ` (plafonné ; total brut ${formaterAjustement(r.ajustements.cumulMultipleBrut)})`}
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Décotes appliquées (approche par le marché)</dt>
              <dd className="text-gris">
                Taille : {formaterPourcentage(r.marche.decoteTaille, 0)}
                {r.marche.decoteEBENegatif > 0 && ` ; EBE négatif : ${formaterPourcentage(r.marche.decoteEBENegatif, 0)}`}
                <span className="block text-sm">Pas de décote d&apos;illiquidité : les multiples de PME non cotées l&apos;intègrent déjà.</span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold">Taux d&apos;actualisation (approche par le revenu)</dt>
              <dd className="text-gris">
                {formaterPourcentage(r.revenu.taux.total, 2)} = taux sans risque {formaterPourcentage(r.revenu.taux.tauxSansRisque, 2)} + prime de
                marché {formaterPourcentage(r.revenu.taux.primeMarcheMature, 2)} + prime pays {formaterPourcentage(r.revenu.taux.primeRisquePays, 2)} +
                prime de taille {formaterPourcentage(r.revenu.taux.primeTaille, 1)} + prime spécifique {formaterPoints(r.revenu.taux.primeSpecifique)}
                {r.revenu.disponible
                  ? ` ; fourchette de ${formaterPourcentage(r.revenu.tauxFourchette.haut, 2)} à ${formaterPourcentage(r.revenu.tauxFourchette.bas, 2)}, croissance à long terme ${formaterPourcentage(r.revenu.croissance, 1)}, flux normatif ${formaterFCFA(r.revenu.fluxNormatif)}.`
                  : ` — approche non retenue : ${r.revenu.raison}`}
              </dd>
            </div>
            {r.ajustements.lignes.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="font-semibold">Détail des ajustements</dt>
                <dd>
                  <ul className="mt-2 space-y-1 text-gris">
                    {r.ajustements.lignes.map((l) => (
                      <li key={l.id}>
                        {l.libelle} : {formaterAjustement(l.multiple)} / {formaterPoints(l.points)}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-5 text-base">
            <a href="/simulateur/methodologie" className="text-rouge underline underline-offset-2">Voir la méthodologie détaillée</a>
          </p>
        </details>
      </section>

      {/* 5. Points forts / vigilance */}
      <section aria-labelledby="res-points">
        <h2 id="res-points" className="text-2xl">Ce qu&apos;un acquéreur regardera</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ListePoints titre="Points forts" points={r.pointsForts} favorable />
          <ListePoints titre="Points de vigilance" points={r.pointsVigilance} favorable={false} />
        </div>
      </section>

      {/* Avertissement */}
      <p className="rounded-lg bg-fond p-5 text-base text-gris">
        <strong className="text-anthracite">Avertissement. </strong>
        {AVERTISSEMENT_SIMULATEUR}
      </p>

      {/* 6. Capture */}
      <FormulaireLead
        url="/api/simulation"
        prefixe="sim-lead"
        charge={{ donnees }}
        titre="Recevez votre synthèse et échangez 30 minutes avec un associé BIP, en toute confidentialité"
        texteSucces="Votre synthèse vous a été envoyée par e-mail. Un associé BIP vous contactera prochainement pour convenir d'un échange."
      />

      {/* 7. Recommencer */}
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={onModifier} className="min-h-12 rounded-md border-2 border-anthracite px-5 font-titre font-semibold hover:border-rouge hover:text-rouge">
          Modifier mes réponses
        </button>
        <button type="button" onClick={onRecommencer} className="min-h-12 rounded-md px-5 font-titre font-semibold text-rouge underline underline-offset-4 hover:text-rouge-fonce">
          Recommencer
        </button>
      </div>
    </div>
  );
}
