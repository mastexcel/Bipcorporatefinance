"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bouton } from "@/components/ui/Button";
import { suivre } from "@/lib/analytics";
import { evaluer } from "@/lib/valuation";
import { EtapeChiffres, EtapeEntreprise, EtapeProfil, EtapeRetraitements } from "./Etapes";
import { Resultat } from "./Resultat";
import { donneesCompletes, saisieInitiale, validerEtape, type SaisieSimulateur } from "./saisie";

const ETAPES = ["L'entreprise", "Les chiffres", "Retraitements", "Profil", "Résultat"] as const;
type NumeroEtape = 1 | 2 | 3 | 4 | 5;

/**
 * Sauvegarde en SESSION uniquement (sessionStorage) : effacée à la fermeture
 * de l'onglet. Rien n'est envoyé au serveur avant la validation du formulaire.
 */
const CLE_SESSION = "bip-simulateur-v1";

export function Simulateur() {
  const [saisie, setSaisie] = useState<SaisieSimulateur>(saisieInitiale);
  const [etape, setEtape] = useState<NumeroEtape>(1);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [restaure, setRestaure] = useState(false);
  const titreRef = useRef<HTMLHeadingElement>(null);
  const commence = useRef(false);
  const premierRendu = useRef(true);

  // Restauration de la session
  useEffect(() => {
    try {
      const brut = window.sessionStorage.getItem(CLE_SESSION);
      if (brut) {
        const { saisie: s, etape: e } = JSON.parse(brut) as { saisie: SaisieSimulateur; etape: NumeroEtape };
        setSaisie({ ...saisieInitiale, ...s });
        setEtape(e);
      }
    } catch {
      // Stockage indisponible : on repart de zéro.
    }
    setRestaure(true);
  }, []);

  // Sauvegarde en session
  useEffect(() => {
    if (!restaure) return;
    try {
      window.sessionStorage.setItem(CLE_SESSION, JSON.stringify({ saisie, etape }));
    } catch {
      // Ignoré
    }
  }, [saisie, etape, restaure]);

  // Focus sur le titre de l'étape à chaque changement (lecteurs d'écran, clavier)
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    titreRef.current?.focus();
    titreRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [etape]);

  const donnees = useMemo(() => (etape === 5 ? donneesCompletes(saisie) : null), [etape, saisie]);
  const resultat = useMemo(() => {
    if (!donnees) return null;
    try {
      return evaluer(donnees, { anneeReference: new Date().getFullYear() });
    } catch {
      return null;
    }
  }, [donnees]);

  useEffect(() => {
    if (resultat) suivre("simulation_terminee");
  }, [resultat]);

  function majBloc<K extends keyof SaisieSimulateur>(bloc: K) {
    return (cle: keyof SaisieSimulateur[K], valeur: string) => {
      if (!commence.current) {
        commence.current = true;
        suivre("simulation_commencee");
      }
      setSaisie((s) => ({ ...s, [bloc]: { ...s[bloc], [cle]: valeur } }));
      setErreurs((e) => {
        if (!((cle as string) in e)) return e;
        const { [cle as string]: _retire, ...reste } = e;
        return reste;
      });
    };
  }

  function suivant() {
    if (etape === 5) return;
    const e = validerEtape(etape, saisie);
    setErreurs(e);
    if (Object.keys(e).length > 0) {
      // Focus sur le premier champ en erreur
      requestAnimationFrame(() => {
        const champ = document.querySelector<HTMLElement>("[aria-invalid='true'], fieldset [role='alert']");
        (champ?.closest("fieldset")?.querySelector("input") ?? champ)?.focus();
      });
      return;
    }
    setEtape((etape + 1) as NumeroEtape);
  }

  function precedent() {
    setErreurs({});
    if (etape > 1) setEtape((etape - 1) as NumeroEtape);
  }

  function recommencer() {
    try {
      window.sessionStorage.removeItem(CLE_SESSION);
    } catch {
      // Ignoré
    }
    setSaisie(saisieInitiale);
    setErreurs({});
    commence.current = false;
    setEtape(1);
  }

  return (
    <div>
      {/* Barre de progression */}
      <nav aria-label="Progression du simulateur" className="mb-10">
        <p className="mb-3 text-base font-semibold text-anthracite">
          Étape {etape} sur 5 : {ETAPES[etape - 1]}
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-bordure" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={etape} aria-label="Progression">
          <div className="degrade-bip h-full rounded-full transition-all" style={{ width: `${(etape / 5) * 100}%` }} />
        </div>
        <ol className="mt-3 hidden grid-cols-5 gap-2 text-sm sm:grid">
          {ETAPES.map((libelle, i) => (
            <li key={libelle} aria-current={etape === i + 1 ? "step" : undefined} className={etape === i + 1 ? "font-semibold text-rouge" : i + 1 < etape ? "text-anthracite" : "text-gris"}>
              {i + 1}. {libelle}
            </li>
          ))}
        </ol>
      </nav>

      <h2 ref={titreRef} tabIndex={-1} className="mb-8 scroll-mt-28 text-2xl outline-none sm:text-3xl">
        {etape === 5 ? "Votre résultat" : ETAPES[etape - 1]}
      </h2>

      {etape === 1 && <EtapeEntreprise valeurs={saisie.entreprise} maj={majBloc("entreprise")} erreurs={erreurs} />}
      {etape === 2 && <EtapeChiffres valeurs={saisie.chiffres} maj={majBloc("chiffres")} erreurs={erreurs} />}
      {etape === 3 && <EtapeRetraitements saisie={saisie} maj={majBloc("retraitements")} erreurs={erreurs} />}
      {etape === 4 && <EtapeProfil valeurs={saisie.profil} maj={majBloc("profil")} erreurs={erreurs} />}
      {etape === 5 &&
        (resultat && donnees ? (
          <Resultat resultat={resultat} donnees={donnees} onRecommencer={recommencer} onModifier={() => setEtape(4)} />
        ) : (
          <div role="alert" className="rounded-lg border border-rouge p-6">
            <p>Certaines informations sont incomplètes ou incohérentes. Merci de vérifier les étapes précédentes.</p>
            <div className="mt-4">
              <Bouton type="button" onClick={() => setEtape(1)}>Revenir au début</Bouton>
            </div>
          </div>
        ))}

      {etape < 5 && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-bordure pt-6">
          {etape > 1 ? (
            <button type="button" onClick={precedent} className="min-h-12 rounded-md border-2 border-anthracite px-5 font-titre font-semibold hover:border-rouge hover:text-rouge">
              ← Retour
            </button>
          ) : (
            <span />
          )}
          <Bouton type="button" onClick={suivant}>
            {etape === 4 ? "Voir mon résultat" : "Continuer"} →
          </Bouton>
        </div>
      )}
      {Object.keys(erreurs).length > 0 && (
        <p role="alert" className="mt-4 text-base text-rouge-fonce">
          Merci de corriger les champs signalés avant de continuer.
        </p>
      )}
    </div>
  );
}
