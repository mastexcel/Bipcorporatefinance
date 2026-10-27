/**
 * Moteur de valorisation — point d'entrée.
 *
 * Fonctions pures, sans dépendance à l'interface. Le même code est exécuté
 * dans le navigateur (affichage du résultat) et sur le serveur (recalcul
 * avant envoi de l'e-mail, pour ne jamais faire confiance au navigateur).
 *
 * Étapes :
 *   A. EBE retraité                      (normalize.ts)
 *   —  Ajustements qualitatifs           (qualitative.ts)
 *   B. Approche par le marché            (market.ts)
 *   C. Approche par le revenu            (income.ts)
 *   D. Approche patrimoniale (repère)    (ci-dessous)
 *   E. Synthèse, pont de valeur, arrondi (ci-dessous)
 */
import { MESSAGE_DEFICITAIRE, PAYS, type Fourchette } from "@/config/valuation";
import { formaterPourcentage } from "./format";
import { calculerApprocheRevenu } from "./income";
import { calculerApprocheMarche } from "./market";
import { calculerEBERetraite } from "./normalize";
import { parametresEnVigueur, verifierParametres } from "./params";
import { calculerAjustements } from "./qualitative";
import type {
  BarreFootballField,
  DonneesProfil,
  DonneesSimulation,
  ParametresValorisation,
  PointAnalyse,
  PontValeur,
  ResultatAjustements,
  ResultatValorisation,
} from "./types";

export * from "./types";
export { calculerEBERetraite } from "./normalize";
export { calculerAjustements, calculerCroissanceAnnuelle } from "./qualitative";
export { calculerApprocheMarche } from "./market";
export { calculerApprocheRevenu } from "./income";
export { parametresEnVigueur, parametresManquants, verifierParametres, ParametreManquantError } from "./params";

export interface OptionsEvaluation {
  /** Année de référence pour l'ancienneté de l'entreprise (année en cours). */
  anneeReference: number;
  /** Paramètres (par défaut : ceux de config/valuation.ts). */
  parametres?: ParametresValorisation;
}

const combiner = (a: Fourchette, b: Fourchette, fn: (x: number, y: number) => number): Fourchette => ({
  bas: fn(a.bas, b.bas),
  central: fn(a.central, b.central),
  haut: fn(a.haut, b.haut),
});

const decaler = (f: Fourchette, delta: number): Fourchette => ({
  bas: f.bas + delta,
  central: f.central + delta,
  haut: f.haut + delta,
});

/** Arrondi au multiple le plus proche (1 million de FCFA par défaut). */
export function arrondir(x: number, pas: number): number {
  // « + 0 » évite de renvoyer −0.
  return Math.round(x / pas) * pas + 0;
}

export function evaluer(donnees: DonneesSimulation, options: OptionsEvaluation): ResultatValorisation {
  const p = options.parametres ?? parametresEnVigueur;
  verifierParametres(p);

  const { entreprise, chiffres, retraitements, profil } = donnees;
  if (!(chiffres.chiffreAffaires > 0)) {
    throw new RangeError("Le chiffre d'affaires doit être strictement positif.");
  }
  const secteur = p.secteurs.find((s) => s.id === entreprise.secteur);
  if (!secteur) throw new RangeError(`Secteur inconnu : ${entreprise.secteur}`);

  const messages: string[] = [];

  // A. EBE retraité
  const ebe = calculerEBERetraite(chiffres, retraitements);
  const deficitaire = ebe.ebeRetraite <= 0;

  // Ajustements qualitatifs
  const ajustements = calculerAjustements(entreprise, chiffres, profil, p, options.anneeReference);

  // B. Approche par le marché
  const marche = deficitaire
    ? calculerApprocheMarche({
        methode: "ca",
        agregat: chiffres.chiffreAffaires,
        secteur,
        effectif: entreprise.effectif,
        cumulAjustements: ajustements.cumulMultiple,
        appliquerDecoteEBENegatif: true,
        p,
      })
    : calculerApprocheMarche({
        methode: "ebe",
        agregat: ebe.ebeRetraite,
        secteur,
        effectif: entreprise.effectif,
        cumulAjustements: ajustements.cumulMultiple,
        appliquerDecoteEBENegatif: false,
        p,
      });

  // Multiple de CA : simple repère quand l'EBE est positif (non pondéré).
  const repereCA = deficitaire
    ? null
    : calculerApprocheMarche({
        methode: "ca",
        agregat: chiffres.chiffreAffaires,
        secteur,
        effectif: entreprise.effectif,
        cumulAjustements: ajustements.cumulMultiple,
        appliquerDecoteEBENegatif: false,
        p,
      });

  // C. Approche par le revenu
  const { primePaysParDefaut, ...revenu } = calculerApprocheRevenu({
    ebeRetraite: ebe.ebeRetraite,
    dotations: chiffres.dotationsAmortissements,
    pays: entreprise.pays,
    effectif: entreprise.effectif,
    primeSpecifique: ajustements.primeSpecifique,
    p,
  });

  // E. Synthèse : 60 % marché + 40 % revenu, borne par borne ;
  // 100 % sur l'approche disponible si l'autre ne l'est pas.
  const ponderation = revenu.disponible ? p.ponderation : { marche: 1, revenu: 0 };
  const valeurEntreprise = revenu.disponible
    ? combiner(
        marche.valeurEntreprise,
        revenu.valeurEntreprise,
        (m, r) => ponderation.marche * m + ponderation.revenu * r,
      )
    : marche.valeurEntreprise;

  // Pont de valeur : titres = VE − dettes financières + trésorerie − dettes fiscales et sociales échues
  const detteFinanciereNette = chiffres.dettesFinancieres - chiffres.tresorerie;
  const autresDettes = chiffres.dettesFiscalesSocialesEchues;
  const passageTitres = -detteFinanciereNette - autresDettes;
  const pont: PontValeur = {
    valeurEntreprise,
    dettesFinancieres: chiffres.dettesFinancieres,
    tresorerie: chiffres.tresorerie,
    detteFinanciereNette,
    autresDettes,
    valeurTitres: decaler(valeurEntreprise, passageTitres),
  };

  const valeurBasseNegative = pont.valeurTitres.bas < 0;
  const arrondiPlancher = (x: number) => Math.max(0, arrondir(x, p.arrondi));
  const valeurTitres: Fourchette = {
    bas: arrondiPlancher(pont.valeurTitres.bas),
    central: arrondiPlancher(pont.valeurTitres.central),
    haut: arrondiPlancher(pont.valeurTitres.haut),
  };

  // D. Approche patrimoniale : actif net comptable = capitaux propres (repère et plancher).
  const actifNet = chiffres.capitauxPropres;
  const plancherPatrimonial = actifNet > 0 && pont.valeurTitres.central < actifNet;

  // Messages
  if (deficitaire) {
    messages.push(MESSAGE_DEFICITAIRE);
    messages.push(
      "L'EBE retraité étant nul ou négatif, seule la méthode du multiple de chiffre d'affaires est utilisée, avec une décote supplémentaire de 20 %.",
    );
  }
  if (!revenu.disponible && !deficitaire) messages.push(revenu.raison);
  if (primePaysParDefaut) {
    const nomPays = PAYS.find((x) => x.code === entreprise.pays)?.libelle ?? entreprise.pays;
    messages.push(
      `La prime de risque propre à ce pays (${nomPays}) n'est pas encore renseignée : celle de la Côte d'Ivoire est appliquée à titre indicatif.`,
    );
  }
  if (ajustements.plafondAtteint === "min") {
    messages.push("Les ajustements défavorables ont été plafonnés à −35 % du multiple.");
  } else if (ajustements.plafondAtteint === "max") {
    messages.push("Les ajustements favorables ont été plafonnés à +15 % du multiple.");
  }
  if (valeurBasseNegative) {
    messages.push(
      pont.valeurTitres.haut < 0
        ? "Les dettes de l'entreprise dépassent la valeur de son activité : la valeur des titres est ramenée à 0. Une restructuration de la dette ou un apport en capital peut être étudié avec un conseiller."
        : "Dans l'hypothèse basse, les dettes dépassent la valeur de l'activité : la valeur basse des titres est ramenée à 0.",
    );
  }
  if (plancherPatrimonial) {
    messages.push(
      "La valeur obtenue est inférieure à l'actif net comptable (capitaux propres). Pour une entreprise peu rentable ou disposant d'un patrimoine important, la valeur patrimoniale peut être retenue, sous réserve de la réévaluation des actifs.",
    );
  }

  // Football field : fourchette de valeur des TITRES par méthode.
  const versTitres = (f: Fourchette) => decaler(f, passageTitres);
  const footballField: BarreFootballField[] = [];
  const mt = versTitres(marche.valeurEntreprise);
  footballField.push({
    id: "marche",
    libelle: marche.methode === "ebe" ? "Multiple d'EBE retraité" : "Multiple de chiffre d'affaires",
    ...mt,
  });
  if (revenu.disponible) {
    footballField.push({ id: "revenu", libelle: "Capitalisation des flux", ...versTitres(revenu.valeurEntreprise) });
  }
  if (repereCA) {
    footballField.push({
      id: "repereCA",
      libelle: "Multiple de CA (repère)",
      repere: true,
      ...versTitres(repereCA.valeurEntreprise),
    });
  }
  footballField.push({
    id: "actifNet",
    libelle: "Actif net comptable (repère)",
    repere: true,
    bas: actifNet,
    central: actifNet,
    haut: actifNet,
  });
  footballField.push({ id: "retenue", libelle: "Fourchette retenue", retenue: true, ...valeurTitres });

  // Points forts et points de vigilance
  const { pointsForts, pointsVigilance } = analyserProfil(profil, ajustements, marche.valeurBaseCentrale);

  return {
    secteur,
    ebe,
    ajustements,
    marche,
    repereCA,
    revenu,
    ponderation,
    valeurEntreprise,
    pont,
    valeurTitres,
    valeurBasseNegative,
    actifNet,
    plancherPatrimonial,
    deficitaire,
    primePaysParDefaut,
    footballField,
    pointsForts,
    pointsVigilance,
    messages,
  };
}

/**
 * Génère 3 points forts et 3 points de vigilance à partir du profil.
 * L'effet chiffré est indicatif : ajustement du multiple × valeur d'entreprise
 * de base (approche par le marché, hypothèse centrale, avant ajustements).
 */
export function analyserProfil(
  profil: DonneesProfil,
  ajustements: ResultatAjustements,
  valeurBaseCentrale: number,
): { pointsForts: PointAnalyse[]; pointsVigilance: PointAnalyse[] } {
  const effet = (id: string) => ajustements.lignes.find((l) => l.id === id)?.multiple ?? 0;
  const point = (id: string, libelle: string): PointAnalyse => {
    const effetMultiple = effet(id);
    return { id, libelle, effetMultiple, effetValeur: effetMultiple * valeurBaseCentrale };
  };

  const forts: PointAnalyse[] = [];
  const vigilance: PointAnalyse[] = [];

  // L'ordre des critères sert à départager les points de même effet.
  if (profil.dependanceDirigeant === "oui") forts.push(point("dependanceDirigeant", "L'entreprise peut fonctionner sans vous pendant plusieurs mois"));
  else vigilance.push(point("dependanceDirigeant", profil.dependanceDirigeant === "non" ? "Forte dépendance au dirigeant : l'acquéreur craindra une perte de valeur à votre départ" : "Dépendance partielle au dirigeant : à réduire en déléguant davantage"));

  if (profil.equipeDirection) forts.push(point("equipeDirection", "Une équipe de direction est en place"));
  else vigilance.push(point("equipeDirection", "Pas d'équipe de direction autour de vous : un point que les acquéreurs examineront"));

  if (profil.premierClientPlus30) vigilance.push(point("premierClient", "Un client représente plus de 30 % du chiffre d'affaires"));
  else forts.push(point("premierClient", "Aucun client ne dépasse 30 % du chiffre d'affaires"));

  if (profil.top5ClientsPlus60) vigilance.push(point("top5Clients", "Les 5 premiers clients dépassent 60 % du chiffre d'affaires"));

  if (profil.recurrentPlus50) forts.push(point("recurrent", "Plus de la moitié du chiffre d'affaires est récurrente"));

  if (profil.comptesCertifies) forts.push(point("comptesCertifies", "Comptes certifiés par un commissaire aux comptes"));
  if (profil.expertComptable) {
    if (!profil.comptesCertifies) forts.push(point("expertComptable", "Comptes établis par un expert-comptable"));
  } else {
    vigilance.push(point("expertComptable", "Comptes non établis par un expert-comptable : leur fiabilité sera questionnée"));
  }

  if (profil.fiscalSocialAJour === "oui") forts.push(point("fiscalSocial", "Situation fiscale et sociale à jour"));
  else vigilance.push(point("fiscalSocial", profil.fiscalSocialAJour === "non" ? "Situation fiscale et sociale non à jour : risque de passif pour l'acquéreur" : "Situation fiscale et sociale à vérifier avant toute démarche"));

  if (profil.contratsEcrits === "oui") forts.push(point("contrats", "Contrats clients et fournisseurs formalisés par écrit"));
  else vigilance.push(point("contrats", profil.contratsEcrits === "non" ? "Contrats clients et fournisseurs non écrits" : "Contrats clients et fournisseurs partiellement écrits"));

  if (profil.litigeImportant) vigilance.push(point("litige", "Un litige important est en cours"));
  else forts.push(point("litige", "Aucun litige important en cours"));

  const croissance = ajustements.lignes.find((l) => l.id === "croissance");
  if (croissance && croissance.multiple > 0) forts.push(point("croissance", "Croissance du chiffre d'affaires supérieure à 10 % par an"));
  if (croissance && croissance.multiple < 0) vigilance.push(point("croissance", "Baisse du chiffre d'affaires supérieure à 10 % par an"));
  if (ajustements.lignes.some((l) => l.id === "entrepriseRecente")) vigilance.push(point("entrepriseRecente", "Entreprise récente (moins de 3 ans) : historique encore court"));

  // Tri stable : effet le plus favorable (forts) ou le plus défavorable (vigilance) d'abord.
  const pointsForts = forts
    .map((x, i) => ({ x, i }))
    .sort((a, b) => b.x.effetMultiple - a.x.effetMultiple || a.i - b.i)
    .slice(0, 3)
    .map(({ x }) => x);
  const pointsVigilance = vigilance
    .map((x, i) => ({ x, i }))
    .sort((a, b) => a.x.effetMultiple - b.x.effetMultiple || a.i - b.i)
    .slice(0, 3)
    .map(({ x }) => x);

  return { pointsForts, pointsVigilance };
}

/** Taux d'actualisation lisible (utilisé dans les hypothèses et l'e-mail). */
export function decrireTaux(r: ResultatValorisation): string {
  return formaterPourcentage(r.revenu.taux.total, 2);
}
