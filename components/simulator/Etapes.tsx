"use client";

import { ChampMontant } from "@/components/forms/ChampMontant";
import { ChampSelect, ChampTexte, GroupeRadio } from "@/components/forms/Champs";
import { FORMES_JURIDIQUES, LIBELLES_EFFECTIF, multiplesSectoriels, PAYS, TRANCHES_EFFECTIF } from "@/config/valuation";
import { calculerEBERetraite } from "@/lib/valuation";
import { formaterFCFA } from "@/lib/valuation/format";
import { convertir, type SaisieSimulateur } from "./saisie";

interface PropsEtape<K extends keyof SaisieSimulateur> {
  valeurs: SaisieSimulateur[K];
  maj: (cle: keyof SaisieSimulateur[K], valeur: string) => void;
  erreurs: Record<string, string>;
}

/* -------------------------------------------------------------------------- */
/*  Étape 1 — L'entreprise                                                     */
/* -------------------------------------------------------------------------- */

export function EtapeEntreprise({ valeurs, maj, erreurs }: PropsEtape<"entreprise">) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <ChampSelect
          id="sim-secteur"
          label="Secteur d'activité"
          valeur={valeurs.secteur}
          onChange={(v) => maj("secteur", v)}
          options={multiplesSectoriels.secteurs.map((s) => ({ valeur: s.id, libelle: s.libelle }))}
          erreur={erreurs.secteur}
        />
      </div>
      <ChampSelect
        id="sim-pays"
        label="Pays"
        valeur={valeurs.pays}
        onChange={(v) => maj("pays", v)}
        options={PAYS.map((p) => ({ valeur: p.code, libelle: p.libelle }))}
        erreur={erreurs.pays}
      />
      <ChampTexte
        id="sim-annee"
        label="Année de création"
        valeur={valeurs.anneeCreation}
        onChange={(v) => maj("anneeCreation", v.replace(/\D/g, "").slice(0, 4))}
        inputMode="numeric"
        placeholder="ex. 2012"
        erreur={erreurs.anneeCreation}
      />
      <div className="sm:col-span-2">
        <GroupeRadio
          nom="sim-effectif"
          legende="Effectif"
          valeur={valeurs.effectif as (typeof TRANCHES_EFFECTIF)[number] | ""}
          onChange={(v) => maj("effectif", v)}
          options={TRANCHES_EFFECTIF.map((t) => ({ valeur: t, libelle: LIBELLES_EFFECTIF[t] }))}
          erreur={erreurs.effectif}
        />
      </div>
      <div className="sm:col-span-2">
        <GroupeRadio
          nom="sim-forme"
          legende="Forme juridique"
          valeur={valeurs.formeJuridique as (typeof FORMES_JURIDIQUES)[number] | ""}
          onChange={(v) => maj("formeJuridique", v)}
          options={FORMES_JURIDIQUES.map((f) => ({ valeur: f, libelle: f }))}
          erreur={erreurs.formeJuridique}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 2 — Les chiffres du dernier exercice clos                            */
/* -------------------------------------------------------------------------- */

export function EtapeChiffres({ valeurs, maj, erreurs }: PropsEtape<"chiffres">) {
  return (
    <div className="space-y-8">
      <p className="text-base text-gris">
        Montants en FCFA, issus de vos états financiers du dernier exercice clos. Saisissez 0 si un poste est nul.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <ChampMontant id="sim-ca" label="Chiffre d'affaires" obligatoire valeur={valeurs.chiffreAffaires} onChange={(v) => maj("chiffreAffaires", v)} erreur={erreurs.chiffreAffaires} />
        <ChampMontant
          id="sim-ebe"
          label="Excédent brut d'exploitation (EBE)"
          aide="Résultat de l'activité avant amortissements, frais financiers et impôts. Peut être négatif (saisir « - » devant)."
          obligatoire
          negatifAutorise
          valeur={valeurs.ebe}
          onChange={(v) => maj("ebe", v)}
          erreur={erreurs.ebe}
        />
        <ChampMontant id="sim-dotations" label="Dotations aux amortissements" obligatoire valeur={valeurs.dotationsAmortissements} onChange={(v) => maj("dotationsAmortissements", v)} erreur={erreurs.dotationsAmortissements} />
        <ChampMontant
          id="sim-dettes"
          label="Dettes financières"
          aide="Emprunts bancaires et crédit-bail restant dus."
          obligatoire
          valeur={valeurs.dettesFinancieres}
          onChange={(v) => maj("dettesFinancieres", v)}
          erreur={erreurs.dettesFinancieres}
        />
        <ChampMontant id="sim-treso" label="Trésorerie disponible" obligatoire valeur={valeurs.tresorerie} onChange={(v) => maj("tresorerie", v)} erreur={erreurs.tresorerie} />
        <ChampMontant
          id="sim-cp"
          label="Capitaux propres"
          aide="Peuvent être négatifs (saisir « - » devant)."
          obligatoire
          negatifAutorise
          valeur={valeurs.capitauxPropres}
          onChange={(v) => maj("capitauxPropres", v)}
          erreur={erreurs.capitauxPropres}
        />
        <div className="sm:col-span-2">
          <ChampMontant
            id="sim-dettes-fiscales"
            label="Dettes fiscales et sociales échues ou en retard"
            aide="Impôts et cotisations sociales dont l'échéance est dépassée."
            valeur={valeurs.dettesFiscalesSocialesEchues}
            onChange={(v) => maj("dettesFiscalesSocialesEchues", v)}
            erreur={erreurs.dettesFiscalesSocialesEchues}
          />
        </div>
      </div>
      <fieldset className="rounded-lg border border-bordure p-5">
        <legend className="px-2 font-titre font-semibold">Historique (pour mesurer la croissance)</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <ChampMontant id="sim-ca-n1" label="Chiffre d'affaires de l'exercice précédent (N-1)" valeur={valeurs.chiffreAffairesN1} onChange={(v) => maj("chiffreAffairesN1", v)} erreur={erreurs.chiffreAffairesN1} />
          <ChampMontant id="sim-ca-n2" label="Chiffre d'affaires il y a deux exercices (N-2)" valeur={valeurs.chiffreAffairesN2} onChange={(v) => maj("chiffreAffairesN2", v)} erreur={erreurs.chiffreAffairesN2} />
        </div>
      </fieldset>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 3 — Retraitements                                                    */
/* -------------------------------------------------------------------------- */

export function EtapeRetraitements({ saisie, maj, erreurs }: { saisie: SaisieSimulateur; maj: PropsEtape<"retraitements">["maj"]; erreurs: Record<string, string> }) {
  const valeurs = saisie.retraitements;
  const c = convertir(saisie);
  const ebe = c.chiffres.ebe;
  const apercu =
    ebe !== null
      ? calculerEBERetraite(
          { ebe },
          {
            remunerationDirigeantActuelle: c.retraitements.remunerationDirigeantActuelle,
            remunerationDirigeantMarche: c.retraitements.remunerationDirigeantMarche,
            chargesExceptionnelles: c.retraitements.chargesExceptionnelles,
            produitsExceptionnels: c.retraitements.produitsExceptionnels,
            loyerActuel: c.retraitements.loyerActuel,
            loyerMarche: c.retraitements.loyerMarche,
          },
        )
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-8">
        <p className="rounded-lg bg-fond p-4 text-base">
          <strong>Un acquéreur évalue votre entreprise sur sa rentabilité normale, hors éléments exceptionnels.</strong> Cette étape
          est facultative mais recommandée.
        </p>
        <fieldset className="space-y-5">
          <legend className="mb-2 font-titre text-lg font-semibold">Rémunération du dirigeant</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <ChampMontant id="sim-rem-actuelle" label="Votre rémunération annuelle actuelle" valeur={valeurs.remunerationDirigeantActuelle} onChange={(v) => maj("remunerationDirigeantActuelle", v)} erreur={erreurs.remunerationDirigeantActuelle} />
            <ChampMontant
              id="sim-rem-marche"
              label="Coût annuel d'un directeur général salarié pour vous remplacer"
              valeur={valeurs.remunerationDirigeantMarche}
              onChange={(v) => maj("remunerationDirigeantMarche", v)}
              erreur={erreurs.remunerationDirigeantMarche}
            />
          </div>
        </fieldset>
        <fieldset className="space-y-5">
          <legend className="mb-2 font-titre text-lg font-semibold">Éléments exceptionnels de l&apos;exercice</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <ChampMontant id="sim-charges-exc" label="Charges exceptionnelles non récurrentes (à rajouter)" valeur={valeurs.chargesExceptionnelles} onChange={(v) => maj("chargesExceptionnelles", v)} erreur={erreurs.chargesExceptionnelles} />
            <ChampMontant id="sim-produits-exc" label="Produits exceptionnels (à retirer)" valeur={valeurs.produitsExceptionnels} onChange={(v) => maj("produitsExceptionnels", v)} erreur={erreurs.produitsExceptionnels} />
          </div>
        </fieldset>
        <fieldset className="space-y-5">
          <legend className="mb-2 font-titre text-lg font-semibold">Loyer versé à une société ou une personne liée</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <ChampMontant id="sim-loyer-actuel" label="Loyer annuel actuellement payé" valeur={valeurs.loyerActuel} onChange={(v) => maj("loyerActuel", v)} erreur={erreurs.loyerActuel} />
            <ChampMontant id="sim-loyer-marche" label="Loyer annuel au prix du marché" valeur={valeurs.loyerMarche} onChange={(v) => maj("loyerMarche", v)} erreur={erreurs.loyerMarche} />
          </div>
        </fieldset>
      </div>

      {apercu && (
        <aside aria-live="polite" className="h-fit rounded-lg border border-bordure bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h3 className="text-lg">EBE retraité</h3>
          <dl className="mt-4 space-y-2 text-base">
            <div className="flex justify-between gap-3">
              <dt className="text-gris">EBE déclaré</dt>
              <dd className="tabular-nums">{formaterFCFA(apercu.ebeDeclare)}</dd>
            </div>
            {apercu.lignes.map((l) => (
              <div key={l.libelle} className="flex justify-between gap-3">
                <dt className="text-gris">{l.libelle}</dt>
                <dd className="whitespace-nowrap tabular-nums">
                  {l.montant > 0 ? "+" : ""}
                  {formaterFCFA(l.montant)}
                </dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-t border-anthracite pt-2 font-semibold">
              <dt>EBE retraité</dt>
              <dd className="whitespace-nowrap tabular-nums">{formaterFCFA(apercu.ebeRetraite)}</dd>
            </div>
          </dl>
        </aside>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Étape 4 — Profil qualitatif                                                */
/* -------------------------------------------------------------------------- */

const ON = [
  { valeur: "oui", libelle: "Oui" },
  { valeur: "non", libelle: "Non" },
] as const;
const OPN = [
  { valeur: "oui", libelle: "Oui" },
  { valeur: "en_partie", libelle: "En partie" },
  { valeur: "non", libelle: "Non" },
] as const;

export function EtapeProfil({ valeurs, maj, erreurs }: PropsEtape<"profil">) {
  const q = (cle: keyof SaisieSimulateur["profil"], legende: string, options: readonly { valeur: string; libelle: string }[]) => (
    <GroupeRadio
      key={cle}
      nom={`sim-${cle}`}
      legende={legende}
      valeur={valeurs[cle]}
      onChange={(v) => maj(cle, v)}
      options={[...options]}
      erreur={erreurs[cle]}
    />
  );
  return (
    <div className="space-y-7">
      {q("dependanceDirigeant", "L'entreprise peut-elle tourner 3 mois sans vous ?", OPN)}
      {q("premierClientPlus30", "Votre premier client représente-t-il plus de 30 % du chiffre d'affaires ?", ON)}
      {q("top5ClientsPlus60", "Vos 5 premiers clients représentent-ils plus de 60 % du chiffre d'affaires ?", ON)}
      {q("expertComptable", "Vos comptes sont-ils établis par un expert-comptable ?", ON)}
      {q("comptesCertifies", "Vos comptes sont-ils certifiés par un commissaire aux comptes ?", ON)}
      {q("fiscalSocialAJour", "Votre situation fiscale et sociale est-elle à jour ?", [
        { valeur: "oui", libelle: "Oui" },
        { valeur: "non", libelle: "Non" },
        { valeur: "ne_sait_pas", libelle: "Je ne sais pas" },
      ])}
      {q("contratsEcrits", "Vos contrats clients et fournisseurs sont-ils écrits ?", OPN)}
      {q("recurrentPlus50", "Plus de 50 % de votre chiffre d'affaires est-il récurrent (contrats, abonnements) ?", ON)}
      {q("equipeDirection", "Une équipe de direction est-elle en place en dehors de vous ?", ON)}
      {q("litigeImportant", "Avez-vous un litige important en cours ?", ON)}
    </div>
  );
}
