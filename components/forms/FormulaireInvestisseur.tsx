"use client";

import { useState, type FormEvent } from "react";
import { multiplesSectoriels, PAYS } from "@/config/valuation";
import { Bouton } from "@/components/ui/Button";
import { erreursParChamp } from "@/lib/schemas/commun";
import { investisseurSchema, PARTICIPATIONS, TYPES_INVESTISSEUR } from "@/lib/schemas/formulaires";
import { lireMontant } from "@/lib/valuation/format";
import { CaseConsentement, CasesMultiples, ChampPiege, ChampSelect, ChampZoneTexte, GroupeRadio } from "./Champs";
import { BlocCoordonnees, coordonneesVides } from "./Coordonnees";
import { ChampMontant } from "./ChampMontant";
import { RetourEnvoi } from "./RetourEnvoi";
import { Turnstile } from "./Turnstile";
import { useEnvoi } from "./useEnvoi";

export function FormulaireInvestisseur() {
  const [coord, setCoord] = useState(coordonneesVides);
  const [typeInvestisseur, setTypeInvestisseur] = useState("");
  const [secteurs, setSecteurs] = useState<string[]>([]);
  const [devise, setDevise] = useState<"FCFA" | "EUR">("FCFA");
  const [ticketMin, setTicketMin] = useState("");
  const [ticketMax, setTicketMax] = useState("");
  const [participation, setParticipation] = useState("");
  const [pays, setPays] = useState<string[]>(["CI"]);
  const [message, setMessage] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [siteWeb, setSiteWeb] = useState("");
  const [jeton, setJeton] = useState("");
  const [versionTurnstile, setVersionTurnstile] = useState(0);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const { etat, message: messageEnvoi, erreursServeur, envoyer } = useEnvoi("/api/investisseur");

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    const donnees = {
      ...coord,
      typeInvestisseur,
      secteurs,
      devise,
      ticketMin: lireMontant(ticketMin),
      ticketMax: lireMontant(ticketMax),
      participation,
      pays,
      message,
      consentement,
      siteWeb,
      turnstileToken: jeton,
    };
    const r = investisseurSchema.safeParse(donnees);
    if (!r.success) {
      setErreurs(erreursParChamp(r.error));
      return;
    }
    setErreurs({});
    const ok = await envoyer(donnees);
    if (!ok) setVersionTurnstile((v) => v + 1);
  }

  if (etat === "succes") {
    return (
      <RetourEnvoi
        etat={etat}
        message={null}
        succes="Vos critères ont été enregistrés. Nous vous présenterons, en toute confidentialité, les opportunités qui y correspondent."
      />
    );
  }

  const err = { ...erreursServeur, ...erreurs };
  return (
    <form onSubmit={soumettre} noValidate className="relative space-y-6 rounded-lg bg-white p-5 shadow-sm sm:p-8">
      <p className="text-base text-gris">Les champs marqués d&apos;un astérisque (*) sont obligatoires.</p>
      <ChampSelect
        id="inv-type"
        label="Type d'investisseur"
        valeur={typeInvestisseur}
        onChange={setTypeInvestisseur}
        options={Object.entries(TYPES_INVESTISSEUR).map(([valeur, libelle]) => ({ valeur, libelle }))}
        erreur={err.typeInvestisseur}
      />
      <CasesMultiples
        nom="inv-secteurs"
        legende="Secteurs recherchés"
        valeurs={secteurs}
        onChange={setSecteurs}
        options={multiplesSectoriels.secteurs.map((s) => ({ valeur: s.id, libelle: s.libelle }))}
        erreur={err.secteurs}
      />
      <GroupeRadio
        nom="inv-devise"
        legende="Devise du ticket"
        valeur={devise}
        onChange={setDevise}
        options={[
          { valeur: "FCFA", libelle: "FCFA" },
          { valeur: "EUR", libelle: "Euros" },
        ]}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ChampMontant id="inv-ticket-min" label="Ticket minimum" devise={devise === "EUR" ? "€" : "FCFA"} valeur={ticketMin} onChange={setTicketMin} erreur={err.ticketMin} obligatoire />
        <ChampMontant id="inv-ticket-max" label="Ticket maximum" devise={devise === "EUR" ? "€" : "FCFA"} valeur={ticketMax} onChange={setTicketMax} erreur={err.ticketMax} obligatoire />
      </div>
      <GroupeRadio
        nom="inv-participation"
        legende="Participation recherchée"
        valeur={participation as keyof typeof PARTICIPATIONS | ""}
        onChange={setParticipation}
        options={Object.entries(PARTICIPATIONS).map(([valeur, libelle]) => ({ valeur: valeur as keyof typeof PARTICIPATIONS, libelle }))}
        erreur={err.participation}
      />
      <CasesMultiples
        nom="inv-pays"
        legende="Pays ciblés"
        valeurs={pays}
        onChange={setPays}
        options={PAYS.map((p) => ({ valeur: p.code, libelle: p.libelle }))}
        erreur={err.pays}
      />
      <h3 className="pt-2 text-lg">Vos coordonnées</h3>
      <BlocCoordonnees prefixe="inv" valeurs={coord} onChange={setCoord} erreurs={err} />
      <ChampZoneTexte id="inv-message" label="Précisions sur vos critères" valeur={message} onChange={setMessage} erreur={err.message} />
      <ChampPiege valeur={siteWeb} onChange={setSiteWeb} />
      <CaseConsentement
        id="inv-consentement"
        coche={consentement}
        onChange={setConsentement}
        erreur={err.consentement}
        texte="J'accepte que BIP conserve ces informations pour me présenter des opportunités d'investissement correspondant à mes critères."
      />
      <Turnstile onJeton={setJeton} version={versionTurnstile} />
      <RetourEnvoi etat={etat} message={messageEnvoi} succes="" />
      <Bouton type="submit" disabled={etat === "envoi"}>
        {etat === "envoi" ? "Envoi en cours…" : "Envoyer mes critères"}
      </Bouton>
    </form>
  );
}
