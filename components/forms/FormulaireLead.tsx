"use client";

import { useState, type FormEvent } from "react";
import { Bouton } from "@/components/ui/Button";
import { suivre } from "@/lib/analytics";
import { HORIZONS, erreursParChamp } from "@/lib/schemas/commun";
import { coordonneesLeadSchema } from "@/lib/schemas/formulaires";
import { CaseConsentement, ChampPiege, ChampSelect } from "./Champs";
import { BlocCoordonnees, coordonneesVides } from "./Coordonnees";
import { RetourEnvoi } from "./RetourEnvoi";
import { Turnstile } from "./Turnstile";
import { useEnvoi } from "./useEnvoi";

/**
 * Formulaire de capture en fin de simulateur ou de score.
 * `charge` : données propres à l'outil (réponses), recalculées côté serveur.
 */
export function FormulaireLead({
  url,
  prefixe,
  charge,
  titre,
  texteSucces,
}: {
  url: string;
  prefixe: string;
  charge: Record<string, unknown>;
  titre: string;
  texteSucces: string;
}) {
  const [coord, setCoord] = useState(coordonneesVides);
  const [horizon, setHorizon] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [siteWeb, setSiteWeb] = useState("");
  const [jeton, setJeton] = useState("");
  const [versionTurnstile, setVersionTurnstile] = useState(0);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const { etat, message, erreursServeur, envoyer } = useEnvoi(url);

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    const coordonnees = { ...coord, horizon, consentement };
    const r = coordonneesLeadSchema.safeParse(coordonnees);
    if (!r.success) {
      setErreurs(erreursParChamp(r.error));
      return;
    }
    setErreurs({});
    const ok = await envoyer({ ...coordonnees, ...charge, siteWeb, turnstileToken: jeton });
    if (ok) suivre("coordonnees_envoyees", { outil: prefixe });
    else setVersionTurnstile((v) => v + 1);
  }

  if (etat === "succes") return <RetourEnvoi etat={etat} message={null} succes={texteSucces} />;

  const err = { ...erreursServeur, ...erreurs };
  return (
    <form onSubmit={soumettre} noValidate className="relative space-y-6 rounded-lg border border-bordure bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-2xl">{titre}</h2>
      <p className="text-base text-gris">Les champs marqués d&apos;un astérisque (*) sont obligatoires.</p>
      <BlocCoordonnees prefixe={prefixe} valeurs={coord} onChange={setCoord} erreurs={err} />
      <ChampSelect
        id={`${prefixe}-horizon`}
        label="Horizon de votre projet"
        valeur={horizon}
        onChange={setHorizon}
        options={Object.entries(HORIZONS).map(([valeur, libelle]) => ({ valeur, libelle }))}
        erreur={err.horizon}
      />
      <ChampPiege valeur={siteWeb} onChange={setSiteWeb} />
      <CaseConsentement
        id={`${prefixe}-consentement`}
        coche={consentement}
        onChange={setConsentement}
        erreur={err.consentement}
        texte="J'accepte que BIP reçoive mes réponses et mes coordonnées pour m'adresser ma synthèse et me recontacter."
      />
      {Object.keys(erreursServeur).some((k) => k.startsWith("donnees") || k === "reponses") && (
        <p className="text-base text-rouge-fonce" role="alert">
          Certaines réponses du questionnaire sont invalides : revenez aux étapes précédentes pour les vérifier.
        </p>
      )}
      <Turnstile onJeton={setJeton} version={versionTurnstile} />
      <RetourEnvoi etat={etat} message={message} succes="" />
      <Bouton type="submit" disabled={etat === "envoi"}>
        {etat === "envoi" ? "Envoi en cours…" : "Recevoir ma synthèse"}
      </Bouton>
      <p className="text-base text-gris">Vos informations sont traitées de manière strictement confidentielle.</p>
    </form>
  );
}
