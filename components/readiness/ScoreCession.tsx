"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Radar } from "@/components/charts/Radar";
import { GroupeRadio } from "@/components/forms/Champs";
import { FormulaireLead } from "@/components/forms/FormulaireLead";
import { Bouton, LienBouton } from "@/components/ui/Button";
import { readiness } from "@/config/readiness";
import { suivre } from "@/lib/analytics";
import { calculerScore, type ReponsesReadiness } from "@/lib/readiness/score";

const CLE_SESSION = "bip-score-v1";
const NB_BLOCS = readiness.blocs.length;

const COULEUR_NIVEAU = {
  a_preparer: "border-rouge",
  en_progres: "border-orange",
  pret: "border-[#1f8f4e]",
} as const;

export function ScoreCession() {
  const [reponses, setReponses] = useState<ReponsesReadiness>({});
  const [bloc, setBloc] = useState(0); // 0..NB_BLOCS-1, NB_BLOCS = résultat
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [restaure, setRestaure] = useState(false);
  const titreRef = useRef<HTMLHeadingElement>(null);
  const commence = useRef(false);
  const premier = useRef(true);

  useEffect(() => {
    try {
      const brut = window.sessionStorage.getItem(CLE_SESSION);
      if (brut) {
        const s = JSON.parse(brut) as { reponses: ReponsesReadiness; bloc: number };
        setReponses(s.reponses);
        setBloc(Math.min(Math.max(0, s.bloc), NB_BLOCS));
      }
    } catch {
      // Ignoré
    }
    setRestaure(true);
  }, []);

  useEffect(() => {
    if (!restaure) return;
    try {
      window.sessionStorage.setItem(CLE_SESSION, JSON.stringify({ reponses, bloc }));
    } catch {
      // Ignoré
    }
  }, [reponses, bloc, restaure]);

  useEffect(() => {
    if (premier.current) {
      premier.current = false;
      return;
    }
    titreRef.current?.focus();
    titreRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [bloc]);

  const resultat = useMemo(() => {
    if (bloc < NB_BLOCS) return null;
    try {
      return calculerScore(reponses);
    } catch {
      return null;
    }
  }, [bloc, reponses]);

  useEffect(() => {
    if (resultat) suivre("score_termine");
  }, [resultat]);

  function repondre(question: string, valeur: string) {
    if (!commence.current) {
      commence.current = true;
      suivre("score_commence");
    }
    setReponses((r) => ({ ...r, [question]: valeur }));
    setErreurs((e) => {
      const { [question]: _retire, ...reste } = e;
      return reste;
    });
  }

  function suivant() {
    const courant = readiness.blocs[bloc];
    if (!courant) return;
    const manquantes: Record<string, string> = {};
    for (const q of courant.questions) if (!reponses[q.id]) manquantes[q.id] = "Veuillez répondre à cette question.";
    setErreurs(manquantes);
    if (Object.keys(manquantes).length > 0) {
      requestAnimationFrame(() => document.querySelector<HTMLInputElement>("fieldset[aria-describedby] input")?.focus());
      return;
    }
    setBloc(bloc + 1);
  }

  function recommencer() {
    try {
      window.sessionStorage.removeItem(CLE_SESSION);
    } catch {
      // Ignoré
    }
    setReponses({});
    setErreurs({});
    commence.current = false;
    setBloc(0);
  }

  const courant = readiness.blocs[bloc];

  return (
    <div>
      <nav aria-label="Progression du questionnaire" className="mb-10">
        <p className="mb-3 text-base font-semibold">
          {courant ? `Bloc ${bloc + 1} sur ${NB_BLOCS} : ${courant.libelle}` : "Votre résultat"}
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-bordure" role="progressbar" aria-valuemin={0} aria-valuemax={NB_BLOCS} aria-valuenow={bloc} aria-label="Progression">
          <div className="degrade-bip h-full rounded-full transition-all" style={{ width: `${(Math.min(bloc + 1, NB_BLOCS) / NB_BLOCS) * 100}%` }} />
        </div>
      </nav>

      <h2 ref={titreRef} tabIndex={-1} className="mb-8 scroll-mt-28 text-2xl outline-none sm:text-3xl">
        {courant ? courant.libelle : "Votre score de préparation à la cession"}
      </h2>

      {courant && (
        <>
          <div className="space-y-8">
            {courant.questions.map((q) => (
              <GroupeRadio
                key={q.id}
                nom={`score-${q.id}`}
                legende={q.libelle}
                aide={q.aide}
                valeur={reponses[q.id] ?? ""}
                onChange={(v) => repondre(q.id, v)}
                options={q.options.map((o) => ({ valeur: o.valeur, libelle: o.libelle }))}
                erreur={erreurs[q.id]}
                enLigne={false}
              />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-bordure pt-6">
            {bloc > 0 ? (
              <button type="button" onClick={() => setBloc(bloc - 1)} className="min-h-12 rounded-md border-2 border-anthracite px-5 font-titre font-semibold hover:border-rouge hover:text-rouge">
                ← Retour
              </button>
            ) : (
              <span />
            )}
            <Bouton type="button" onClick={suivant}>
              {bloc === NB_BLOCS - 1 ? "Voir mon score" : "Continuer"} →
            </Bouton>
          </div>
        </>
      )}

      {!courant && resultat && (
        <div className="space-y-12">
          <section className="grid items-center gap-8 lg:grid-cols-2">
            <div className={`rounded-lg border-l-8 bg-fond p-6 ${COULEUR_NIVEAU[resultat.niveau]}`}>
              <p className="text-sm font-semibold tracking-wider text-gris uppercase">Votre score</p>
              <p className="mt-2 font-titre text-6xl font-bold tabular-nums">
                {resultat.score}
                <span className="text-2xl text-gris"> / 100</span>
              </p>
              <p className="mt-3 font-titre text-2xl font-bold">Niveau : {resultat.libelleNiveau}</p>
              <p className="mt-2 text-base text-gris">Seuils : moins de 50 « À préparer » · 50 à 74 « En progrès » · 75 et plus « Prêt ».</p>
              {resultat.blocages.map((b) => (
                <p key={b} className="mt-4 rounded-md border-l-4 border-orange bg-white p-4 text-base">{b}</p>
              ))}
            </div>
            <div className="flex flex-col items-center">
              <Radar blocs={resultat.blocs} />
              <table className="mt-4 w-full max-w-sm text-base">
                <caption className="sr-only">Score par bloc</caption>
                <tbody>
                  {resultat.blocs.map((b) => (
                    <tr key={b.id} className="border-b border-bordure">
                      <th scope="row" className="py-2 text-left font-normal">{b.libelle}</th>
                      <td className="py-2 text-right tabular-nums">{b.points} / {b.pointsMax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="actions">
            <h2 id="actions" className="text-2xl">Vos 3 actions prioritaires</h2>
            {resultat.actions.length === 0 ? (
              <p className="mt-4 text-gris">Aucune action prioritaire : votre entreprise présente un très bon niveau de préparation.</p>
            ) : (
              <ol className="mt-6 space-y-4">
                {resultat.actions.map((a, i) => (
                  <li key={a.questionId} className="flex gap-4 rounded-lg border border-bordure p-5">
                    <span className="degrade-bip flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-titre font-bold text-white">{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold tracking-wider text-rouge uppercase">{a.bloc}</p>
                      <p className="mt-1">{a.action}</p>
                      <p className="mt-1 text-sm text-gris">{a.pointsPerdus} points à gagner</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <p className="rounded-lg bg-fond p-5 text-base text-gris">
            Ce score est un outil d&apos;auto-évaluation indicatif, fondé sur vos réponses déclaratives. Il ne constitue ni un audit, ni un
            conseil.
          </p>

          <FormulaireLead
            url="/api/score"
            prefixe="score-lead"
            charge={{ reponses }}
            titre="Recevez votre synthèse et échangez avec un associé BIP, en toute confidentialité"
            texteSucces="Votre synthèse vous a été envoyée par e-mail. Un associé BIP vous contactera prochainement."
          />

          <div className="flex flex-wrap gap-4">
            <LienBouton href="/simulateur" variante="secondaire">Estimer la valeur de mon entreprise</LienBouton>
            <button type="button" onClick={recommencer} className="min-h-12 px-5 font-titre font-semibold text-rouge underline underline-offset-4">
              Recommencer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
