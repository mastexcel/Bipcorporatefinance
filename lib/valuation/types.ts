/**
 * Types du moteur de valorisation.
 * Aucune dépendance à l'interface : ces types sont partagés entre le
 * navigateur (simulateur), le serveur (route d'envoi) et les tests.
 */
import type {
  Ajustement,
  CodePays,
  FormeJuridique,
  Fourchette,
  Secteur,
  TrancheEffectif,
} from "@/config/valuation";

export type { Fourchette };

export type OuiEnPartieNon = "oui" | "en_partie" | "non";
export type OuiNonNsp = "oui" | "non" | "ne_sait_pas";

/** Étape 1 — L'entreprise. */
export interface DonneesEntreprise {
  secteur: string;
  pays: CodePays;
  anneeCreation: number;
  effectif: TrancheEffectif;
  formeJuridique: FormeJuridique;
}

/** Étape 2 — Chiffres du dernier exercice clos (FCFA). */
export interface DonneesChiffres {
  chiffreAffaires: number;
  /** Excédent brut d'exploitation déclaré (peut être négatif). */
  ebe: number;
  dotationsAmortissements: number;
  dettesFinancieres: number;
  tresorerie: number;
  /** Capitaux propres (peuvent être négatifs). */
  capitauxPropres: number;
  dettesFiscalesSocialesEchues: number;
  /** CA de l'exercice N-1 (facultatif). */
  chiffreAffairesN1: number | null;
  /** CA de l'exercice N-2 (facultatif). */
  chiffreAffairesN2: number | null;
}

/** Étape 3 — Retraitements (facultatifs). */
export interface DonneesRetraitements {
  remunerationDirigeantActuelle: number | null;
  remunerationDirigeantMarche: number | null;
  chargesExceptionnelles: number;
  produitsExceptionnels: number;
  loyerActuel: number | null;
  loyerMarche: number | null;
}

/** Étape 4 — Profil qualitatif. */
export interface DonneesProfil {
  /** L'entreprise peut-elle tourner 3 mois sans le dirigeant ? */
  dependanceDirigeant: OuiEnPartieNon;
  premierClientPlus30: boolean;
  top5ClientsPlus60: boolean;
  expertComptable: boolean;
  comptesCertifies: boolean;
  fiscalSocialAJour: OuiNonNsp;
  contratsEcrits: OuiEnPartieNon;
  recurrentPlus50: boolean;
  equipeDirection: boolean;
  litigeImportant: boolean;
}

export interface DonneesSimulation {
  entreprise: DonneesEntreprise;
  chiffres: DonneesChiffres;
  retraitements: DonneesRetraitements;
  profil: DonneesProfil;
}

/** Paramètres « à plat » utilisés par le moteur (assemblés depuis config/valuation.ts). */
export interface ParametresValorisation {
  secteurs: Secteur[];
  tauxSansRisque: number | null;
  primeMarcheMature: number | null;
  primeRisquePays: Record<CodePays, number | null>;
  primeTaille: Record<TrancheEffectif, number>;
  decoteTaille: Record<TrancheEffectif, number>;
  croissanceLongTerme: number | null;
  tauxImpotSocietes: number | null;
  ponderation: { marche: number; revenu: number };
  ecartTauxFourchette: number;
  decoteEBENegatif: number;
  arrondi: number;
  ecartMinimalTauxCroissance: number;
  ajustements: {
    plafond: { min: number; max: number };
    primeSpecifique: { min: number; max: number };
    dependanceDirigeant: { non: Ajustement; en_partie: Ajustement };
    premierClientPlus30: Ajustement;
    top5ClientsPlus60: Ajustement;
    sansExpertComptable: Ajustement;
    comptesCertifies: Ajustement;
    fiscalSocial: { non: Ajustement; ne_sait_pas: Ajustement };
    contratsNonEcrits: Ajustement;
    recurrentPlus50: Ajustement;
    equipeDirection: Ajustement;
    litigeImportant: Ajustement;
    croissanceForte: Ajustement & { seuil: number };
    baisseForte: Ajustement & { seuil: number };
    entrepriseRecente: Ajustement & { ageMaximum: number };
  };
}

export interface LigneMontant {
  libelle: string;
  montant: number;
}

export interface ResultatEBERetraite {
  ebeDeclare: number;
  lignes: LigneMontant[];
  ebeRetraite: number;
}

export interface LigneAjustement {
  id: string;
  libelle: string;
  /** Ajustement du multiple (décimal). */
  multiple: number;
  /** Ajustement de la prime de risque spécifique (points décimaux). */
  points: number;
}

export interface ResultatAjustements {
  lignes: LigneAjustement[];
  cumulMultipleBrut: number;
  cumulMultiple: number;
  plafondAtteint: "min" | "max" | null;
  primeSpecifiqueBrute: number;
  primeSpecifique: number;
  /** Croissance annuelle moyenne du CA (null si non calculable). */
  croissanceAnnuelle: number | null;
  ageEntreprise: number;
}

export interface ResultatMarche {
  methode: "ebe" | "ca";
  /** Multiples de référence du secteur pour la méthode retenue. */
  multiplesReference: Fourchette;
  /** Multiples effectifs après ajustements, décote de taille et, le cas échéant, décote EBE négatif. */
  multiplesEffectifs: Fourchette;
  agregat: number;
  decoteTaille: number;
  decoteEBENegatif: number;
  valeurEntreprise: Fourchette;
  /** Valeur d'entreprise « de base » (centrale) avant ajustements qualitatifs. */
  valeurBaseCentrale: number;
}

export interface DetailTaux {
  tauxSansRisque: number;
  primeMarcheMature: number;
  primeRisquePays: number;
  primeTaille: number;
  primeSpecifique: number;
  total: number;
}

export type ResultatRevenu =
  | {
      disponible: true;
      fluxNormatif: number;
      resultatExploitation: number;
      impot: number;
      investissementsMaintien: number;
      croissance: number;
      taux: DetailTaux;
      /** Taux utilisés pour chaque borne (bas = taux + 1 pt, haut = taux − 1 pt). */
      tauxFourchette: Fourchette;
      valeurEntreprise: Fourchette;
    }
  | {
      disponible: false;
      raison: string;
      fluxNormatif: number;
      taux: DetailTaux;
    };

export interface PontValeur {
  valeurEntreprise: Fourchette;
  dettesFinancieres: number;
  tresorerie: number;
  detteFinanciereNette: number;
  autresDettes: number;
  valeurTitres: Fourchette;
}

export interface BarreFootballField {
  id: string;
  libelle: string;
  bas: number;
  haut: number;
  central: number;
  /** true pour la fourchette retenue. */
  retenue?: boolean;
  /** true pour un simple repère (non pondéré dans la synthèse). */
  repere?: boolean;
}

export interface PointAnalyse {
  id: string;
  libelle: string;
  /** Ajustement du multiple (décimal), 0 si aucun effet chiffré. */
  effetMultiple: number;
  /** Effet indicatif sur la valeur d'entreprise (FCFA), 0 si aucun. */
  effetValeur: number;
}

export interface ResultatValorisation {
  secteur: Secteur;
  ebe: ResultatEBERetraite;
  ajustements: ResultatAjustements;
  marche: ResultatMarche;
  /** Multiple de CA affiché comme repère quand l'EBE retraité est positif. */
  repereCA: ResultatMarche | null;
  revenu: ResultatRevenu;
  ponderation: { marche: number; revenu: number };
  valeurEntreprise: Fourchette;
  pont: PontValeur;
  /** Fourchette finale arrondie au million, plancher à 0. */
  valeurTitres: Fourchette;
  valeurBasseNegative: boolean;
  actifNet: number;
  /** Valeur des titres (centrale) inférieure à l'actif net comptable. */
  plancherPatrimonial: boolean;
  deficitaire: boolean;
  primePaysParDefaut: boolean;
  footballField: BarreFootballField[];
  pointsForts: PointAnalyse[];
  pointsVigilance: PointAnalyse[];
  messages: string[];
}
