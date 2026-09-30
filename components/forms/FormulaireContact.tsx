"use client";

import { useState, type FormEvent } from "react";
import { Bouton } from "@/components/ui/Button";
import { HORIZONS, erreursParChamp } from "@/lib/schemas/commun";
import { contactSchema, TYPES_PROJET } from "@/lib/schemas/formulaires";
import { CaseConsentement, ChampPiege, ChampSelect, ChampZoneTexte } from "./Champs";
import { BlocCoordonnees, coordonneesVides } from "./Coordonnees";
import { RetourEnvoi } from "./RetourEnvoi";
import { Turnstile } from "./Turnstile";
import { useEnvoi } from "./useEnvoi";

export function FormulaireContact() {
  const [coord, setCoord] = useState(coordonneesVides);
  const [typeProjet, setTypeProjet] = useState("");
  const [horizon, setHorizon] = useState("");
  const [message, setMessage] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [siteWeb, setSiteWeb] = useState("");
  const [jeton, setJeton] = useState("");
  const [versionTurnstile, setVersionTurnstile] = useState(0);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const { etat, message: messageEnvoi, erreursServeur, envoyer } = useEnvoi("/api/contact");

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    const donnees = { ...coord, typeProjet, horizon, message, consentement, siteWeb, turnstileToken: jeton };
    const r = contactSchema.safeParse(donnees);
    if (!r.success) {
      setErreurs(erreursParChamp(r.error));
      return;
    }
    setErreurs({});
    const ok = await envoyer(donnees);
    if (!ok) setVersionTurnstile((v) => v + 1);
  }

  if (etat === "succes") {
    return <RetourEnvoi etat={etat} message={null} succes="Un associé BIP vous répondra rapidement, en toute confidentialité." />;
  }

  const err = { ...erreursServeur, ...erreurs };
  return (
    <form onSubmit={soumettre} noValidate className="relative space-y-6">
      <p className="text-base text-gris">Les champs marqués d&apos;un astérisque (*) sont obligatoires.</p>
      <BlocCoordonnees prefixe="contact" valeurs={coord} onChange={setCoord} erreurs={err} />
      <div className="grid gap-5 sm:grid-cols-2">
        <ChampSelect
          id="contact-type"
          label="Type de projet"
          valeur={typeProjet}
          onChange={setTypeProjet}
          options={Object.entries(TYPES_PROJET).map(([valeur, libelle]) => ({ valeur, libelle }))}
          erreur={err.typeProjet}
        />
        <ChampSelect
          id="contact-horizon"
          label="Horizon du projet"
          valeur={horizon}
          onChange={setHorizon}
          options={Object.entries(HORIZONS).map(([valeur, libelle]) => ({ valeur, libelle }))}
          erreur={err.horizon}
        />
      </div>
      <ChampZoneTexte id="contact-message" label="Message" valeur={message} onChange={setMessage} erreur={err.message} />
      <ChampPiege valeur={siteWeb} onChange={setSiteWeb} />
      <CaseConsentement id="contact-consentement" coche={consentement} onChange={setConsentement} erreur={err.consentement} />
      <Turnstile onJeton={setJeton} version={versionTurnstile} />
      <RetourEnvoi etat={etat} message={messageEnvoi} succes="" />
      <Bouton type="submit" disabled={etat === "envoi"}>
        {etat === "envoi" ? "Envoi en cours…" : "Envoyer ma demande"}
      </Bouton>
      <p className="text-base text-gris">Vos informations sont traitées de manière strictement confidentielle.</p>
    </form>
  );
}
