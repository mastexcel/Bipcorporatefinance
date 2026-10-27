import "server-only";
import { readiness } from "@/config/readiness";
import { AVERTISSEMENT_SIMULATEUR, LIBELLES_EFFECTIF, PAYS } from "@/config/valuation";
import { site } from "@/config/site";
import type { ResultatReadiness } from "@/lib/readiness/score";
import { HORIZONS } from "@/lib/schemas/commun";
import {
  PARTICIPATIONS,
  TYPES_INVESTISSEUR,
  TYPES_PROJET,
  type DonneesContact,
  type DonneesInvestisseur,
  type DonneesLeadScore,
  type DonneesLeadSimulation,
} from "@/lib/schemas/formulaires";
import type { ResultatValorisation } from "@/lib/valuation";
import { formaterAjustement, formaterFCFA, formaterPourcentage, separerMilliers } from "@/lib/valuation/format";
import { multiplesSectoriels } from "@/config/valuation";
import type { Email } from "./envoyer";

/* ---------------------------------------------------------------------------
 * Mise en page
 * ------------------------------------------------------------------------- */

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

type Ligne = [string, string];

interface Bloc {
  titre: string;
  lignes?: Ligne[];
  paragraphes?: string[];
  liste?: string[];
}

function rendreHTML(titre: string, intro: string, blocs: Bloc[], pied: string): string {
  const contenu = blocs
    .map((b) => {
      let html = `<h2 style="font-family:Arial,sans-serif;font-size:17px;color:#3A3A3A;margin:28px 0 10px;border-bottom:2px solid #F26522;padding-bottom:6px">${echapper(b.titre)}</h2>`;
      if (b.lignes?.length) {
        html += `<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">${b.lignes
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 8px 6px 0;color:#6B6B6B;vertical-align:top;width:45%">${echapper(k)}</td><td style="padding:6px 0;color:#3A3A3A;font-weight:600">${echapper(v)}</td></tr>`,
          )
          .join("")}</table>`;
      }
      for (const p of b.paragraphes ?? []) html += `<p style="font-size:14px;color:#3A3A3A;line-height:1.6">${echapper(p)}</p>`;
      if (b.liste?.length) {
        html += `<ul style="font-size:14px;color:#3A3A3A;line-height:1.6;padding-left:20px">${b.liste.map((l) => `<li>${echapper(l)}</li>`).join("")}</ul>`;
      }
      return html;
    })
    .join("");

  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F7F7F8;padding:24px 12px">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;padding:28px;font-family:Arial,sans-serif">
<img src="${site.url}/logo.png" alt="BIP Corporate Finance" width="200" style="display:block;height:auto;margin-bottom:20px">
<h1 style="font-size:21px;color:#3A3A3A;margin:0 0 12px">${echapper(titre)}</h1>
<p style="font-size:15px;color:#3A3A3A;line-height:1.6">${echapper(intro)}</p>
${contenu}
<p style="font-size:12px;color:#6B6B6B;line-height:1.5;margin-top:28px;border-top:1px solid #E4E4E7;padding-top:14px">${echapper(pied)}</p>
</div></body></html>`;
}

function rendreTexte(titre: string, intro: string, blocs: Bloc[], pied: string): string {
  const parties = [titre, "", intro];
  for (const b of blocs) {
    parties.push("", `== ${b.titre} ==`);
    for (const [k, v] of b.lignes ?? []) parties.push(`${k} : ${v}`);
    for (const p of b.paragraphes ?? []) parties.push(p);
    for (const l of b.liste ?? []) parties.push(`- ${l}`);
  }
  parties.push("", pied);
  return parties.join("\n");
}

function construire(a: string | string[], sujet: string, intro: string, blocs: Bloc[], pied: string, repondreA?: string): Email {
  return { a, sujet, repondreA, html: rendreHTML(sujet, intro, blocs, pied), texte: rendreTexte(sujet, intro, blocs, pied) };
}

const PIED_BIP = `Message envoyé depuis le site ${site.url}. Informations strictement confidentielles.`;
const PIED_VISITEUR = `${site.mentionConfidentialite} © BIP – Bridge Investment Partners.`;

const coordonnees = (d: { nom: string; fonction: string; entreprise: string; indicatif: string; telephone: string; email: string }): Ligne[] => [
  ["Nom", d.nom],
  ["Fonction", d.fonction],
  ["Entreprise", d.entreprise],
  ["Téléphone", `${d.indicatif} ${d.telephone}`],
  ["E-mail", d.email],
];

const ouiNon = (b: boolean) => (b ? "Oui" : "Non");
const ouiPartieNon = { oui: "Oui", en_partie: "En partie", non: "Non" } as const;
const libelleSecteur = (id: string) => multiplesSectoriels.secteurs.find((s) => s.id === id)?.libelle ?? id;
const libellePays = (code: string) => PAYS.find((p) => p.code === code)?.libelle ?? code;
const fourchetteTexte = (f: { bas: number; central: number; haut: number }) =>
  `${formaterFCFA(f.bas)} – ${formaterFCFA(f.central)} – ${formaterFCFA(f.haut)}`;

/* ---------------------------------------------------------------------------
 * Contact et investisseurs
 * ------------------------------------------------------------------------- */

export function emailContact(d: DonneesContact, a: string[]): Email {
  return construire(
    a,
    `Nouvelle demande de contact — ${TYPES_PROJET[d.typeProjet]}`,
    "Une nouvelle demande a été envoyée depuis le formulaire de contact.",
    [
      { titre: "Coordonnées", lignes: coordonnees(d) },
      { titre: "Projet", lignes: [["Type de projet", TYPES_PROJET[d.typeProjet]], ["Horizon", HORIZONS[d.horizon]]] },
      ...(d.message ? [{ titre: "Message", paragraphes: [d.message] }] : []),
    ],
    PIED_BIP,
    d.email,
  );
}

export function emailInvestisseur(d: DonneesInvestisseur, a: string[]): Email {
  return construire(
    a,
    `Nouveaux critères d'investissement — ${TYPES_INVESTISSEUR[d.typeInvestisseur]}`,
    "Un investisseur a partagé ses critères depuis la page « Investir en Côte d'Ivoire ».",
    [
      { titre: "Coordonnées", lignes: coordonnees(d) },
      {
        titre: "Critères",
        lignes: [
          ["Type d'investisseur", TYPES_INVESTISSEUR[d.typeInvestisseur]],
          ["Secteurs", d.secteurs.map(libelleSecteur).join(", ")],
          ["Taille de ticket", `${separerMilliers(d.ticketMin)} à ${separerMilliers(d.ticketMax)} ${d.devise}`],
          ["Participation", PARTICIPATIONS[d.participation]],
          ["Pays", d.pays.map(libellePays).join(", ")],
        ],
      },
      ...(d.message ? [{ titre: "Message", paragraphes: [d.message] }] : []),
    ],
    PIED_BIP,
    d.email,
  );
}

/* ---------------------------------------------------------------------------
 * Simulateur de valorisation
 * ------------------------------------------------------------------------- */

function blocsResultat(r: ResultatValorisation): Bloc[] {
  const blocs: Bloc[] = [
    {
      titre: "Fourchette de valeur des titres (indicative)",
      lignes: [
        ["Valeur basse", formaterFCFA(r.valeurTitres.bas)],
        ["Valeur centrale", formaterFCFA(r.valeurTitres.central)],
        ["Valeur haute", formaterFCFA(r.valeurTitres.haut)],
      ],
    },
    {
      titre: "Pont de valeur (hypothèse centrale)",
      lignes: [
        ["Valeur d'entreprise", formaterFCFA(r.pont.valeurEntreprise.central)],
        ["− Dette financière nette", formaterFCFA(r.pont.detteFinanciereNette)],
        ["− Dettes fiscales et sociales échues", formaterFCFA(r.pont.autresDettes)],
        ["= Valeur des titres", formaterFCFA(r.pont.valeurTitres.central)],
      ],
    },
    {
      titre: "Hypothèses",
      lignes: [
        ["EBE retraité", formaterFCFA(r.ebe.ebeRetraite)],
        [
          r.marche.methode === "ebe" ? "Multiples d'EBE retenus" : "Multiples de CA retenus",
          `${r.marche.multiplesEffectifs.bas.toFixed(2)} – ${r.marche.multiplesEffectifs.central.toFixed(2)} – ${r.marche.multiplesEffectifs.haut.toFixed(2)}`,
        ],
        ["Ajustements qualitatifs", formaterAjustement(r.ajustements.cumulMultiple)],
        ["Décote de taille (marché)", formaterPourcentage(r.marche.decoteTaille, 0)],
        ["Taux d'actualisation", r.revenu.disponible ? formaterPourcentage(r.revenu.taux.total, 2) : "Approche non applicable"],
        ["Pondération marché / revenu", `${r.ponderation.marche * 100} % / ${r.ponderation.revenu * 100} %`],
        ["Actif net comptable (repère)", formaterFCFA(r.actifNet)],
      ],
    },
    { titre: "Points forts", liste: r.pointsForts.map((p) => p.libelle) },
    { titre: "Points de vigilance", liste: r.pointsVigilance.map((p) => p.libelle) },
  ];
  if (r.messages.length) blocs.push({ titre: "Remarques", liste: r.messages });
  blocs.push({ titre: "Avertissement", paragraphes: [AVERTISSEMENT_SIMULATEUR] });
  return blocs;
}

export function emailSimulationBIP(d: DonneesLeadSimulation, r: ResultatValorisation, a: string[]): Email {
  const { entreprise: e, chiffres: c, retraitements: rt, profil: p } = d.donnees;
  const facultatif = (v: number | null) => (v === null ? "Non renseigné" : formaterFCFA(v));
  return construire(
    a,
    `Nouvelle simulation de valorisation — ${d.entreprise}`,
    "Un dirigeant a terminé le simulateur et demande un échange avec un associé.",
    [
      { titre: "Coordonnées", lignes: [...coordonnees(d), ["Horizon du projet", HORIZONS[d.horizon]]] },
      ...blocsResultat(r),
      {
        titre: "Réponses — L'entreprise",
        lignes: [
          ["Secteur", libelleSecteur(e.secteur)],
          ["Pays", libellePays(e.pays)],
          ["Année de création", String(e.anneeCreation)],
          ["Effectif", LIBELLES_EFFECTIF[e.effectif]],
          ["Forme juridique", e.formeJuridique],
        ],
      },
      {
        titre: "Réponses — Chiffres du dernier exercice",
        lignes: [
          ["Chiffre d'affaires", formaterFCFA(c.chiffreAffaires)],
          ["EBE", formaterFCFA(c.ebe)],
          ["Dotations aux amortissements", formaterFCFA(c.dotationsAmortissements)],
          ["Dettes financières", formaterFCFA(c.dettesFinancieres)],
          ["Trésorerie", formaterFCFA(c.tresorerie)],
          ["Capitaux propres", formaterFCFA(c.capitauxPropres)],
          ["Dettes fiscales et sociales échues", formaterFCFA(c.dettesFiscalesSocialesEchues)],
          ["CA N-1", facultatif(c.chiffreAffairesN1)],
          ["CA N-2", facultatif(c.chiffreAffairesN2)],
        ],
      },
      {
        titre: "Réponses — Retraitements",
        lignes: [
          ["Rémunération actuelle du dirigeant", facultatif(rt.remunerationDirigeantActuelle)],
          ["Rémunération d'un DG salarié", facultatif(rt.remunerationDirigeantMarche)],
          ["Charges exceptionnelles", formaterFCFA(rt.chargesExceptionnelles)],
          ["Produits exceptionnels", formaterFCFA(rt.produitsExceptionnels)],
          ["Loyer actuel (partie liée)", facultatif(rt.loyerActuel)],
          ["Loyer de marché", facultatif(rt.loyerMarche)],
        ],
      },
      {
        titre: "Réponses — Profil qualitatif",
        lignes: [
          ["Fonctionne 3 mois sans le dirigeant", ouiPartieNon[p.dependanceDirigeant]],
          ["Premier client > 30 % du CA", ouiNon(p.premierClientPlus30)],
          ["5 premiers clients > 60 % du CA", ouiNon(p.top5ClientsPlus60)],
          ["Comptes établis par un expert-comptable", ouiNon(p.expertComptable)],
          ["Comptes certifiés", ouiNon(p.comptesCertifies)],
          ["Situation fiscale et sociale à jour", { oui: "Oui", non: "Non", ne_sait_pas: "Je ne sais pas" }[p.fiscalSocialAJour]],
          ["Contrats écrits", ouiPartieNon[p.contratsEcrits]],
          ["CA récurrent > 50 %", ouiNon(p.recurrentPlus50)],
          ["Équipe de direction en place", ouiNon(p.equipeDirection)],
          ["Litige important en cours", ouiNon(p.litigeImportant)],
        ],
      },
    ],
    PIED_BIP,
    d.email,
  );
}

export function emailSimulationVisiteur(d: DonneesLeadSimulation, r: ResultatValorisation): Email {
  return construire(
    d.email,
    "Votre estimation indicative — BIP Corporate Finance",
    `Bonjour ${d.nom}, merci pour votre confiance. Voici la synthèse de votre simulation. Un associé BIP vous contactera prochainement pour convenir d'un échange confidentiel de 30 minutes.`,
    blocsResultat(r),
    PIED_VISITEUR,
  );
}

/* ---------------------------------------------------------------------------
 * Score de préparation à la cession
 * ------------------------------------------------------------------------- */

function blocsScore(r: ResultatReadiness): Bloc[] {
  return [
    {
      titre: `Score : ${r.score} / 100 — ${r.libelleNiveau}`,
      lignes: r.blocs.map((b): Ligne => [b.libelle, `${b.points} / ${b.pointsMax}`]),
      paragraphes: r.blocages,
    },
    { titre: "Vos 3 actions prioritaires", liste: r.actions.map((a) => a.action) },
  ];
}

export function emailScoreBIP(d: DonneesLeadScore, r: ResultatReadiness, a: string[]): Email {
  const reponses: Ligne[] = [];
  for (const b of readiness.blocs) {
    for (const q of b.questions) {
      const option = q.options.find((o) => o.valeur === d.reponses[q.id]);
      reponses.push([q.libelle, option?.libelle ?? "—"]);
    }
  }
  return construire(
    a,
    `Nouveau score de préparation — ${d.entreprise} (${r.score}/100)`,
    "Un dirigeant a terminé le score de préparation à la cession et demande un échange.",
    [{ titre: "Coordonnées", lignes: [...coordonnees(d), ["Horizon du projet", HORIZONS[d.horizon]]] }, ...blocsScore(r), { titre: "Réponses", lignes: reponses }],
    PIED_BIP,
    d.email,
  );
}

export function emailScoreVisiteur(d: DonneesLeadScore, r: ResultatReadiness): Email {
  return construire(
    d.email,
    "Votre score de préparation à la cession — BIP Corporate Finance",
    `Bonjour ${d.nom}, voici la synthèse de votre score de préparation à la cession. Un associé BIP vous contactera prochainement pour en échanger, en toute confidentialité.`,
    [
      ...blocsScore(r),
      {
        titre: "Avertissement",
        paragraphes: ["Ce score est un outil d'auto-évaluation indicatif, fondé sur vos réponses déclaratives. Il ne constitue ni un audit, ni un conseil."],
      },
    ],
    PIED_VISITEUR,
  );
}
