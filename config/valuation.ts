/* ==========================================================================
 *  ⚠️  PARAMÈTRES PROVISOIRES — À VALIDER PAR L'ÉQUIPE BIP AVANT LA MISE EN LIGNE.
 *      METTRE À JOUR AU MOINS UNE FOIS PAR AN.
 *      INDIQUER LA SOURCE ET LA DATE DE CHAQUE MISE À JOUR.
 * ==========================================================================
 *
 *  Ce fichier regroupe TOUS les paramètres du simulateur de valorisation.
 *  Le moteur de calcul (lib/valuation/) ne contient aucune valeur « en dur ».
 *
 *  Conventions :
 *  - les taux sont exprimés en décimal (0.0361 = 3,61 %) ;
 *  - les « points » de prime de risque sont aussi en décimal (0.02 = 2 points) ;
 *  - chaque groupe porte `source` et `dateMiseAJour` (format AAAA-MM-JJ) ;
 *  - `statut` : "valide" (validé par BIP) ou "a_valider" (valeur par défaut
 *    proposée, à confirmer) ;
 *  - une valeur `null` signifie « [À COMPLÉTER] » : tant qu'un paramètre
 *    obligatoire vaut `null`, le build de production échoue (voir
 *    lib/valuation/params.ts et next.config.ts).
 */

export type StatutParametre = "valide" | "a_valider";

export interface MetaParametre {
  source: string;
  dateMiseAJour: string;
  statut: StatutParametre;
}

export interface ParametreTaux extends MetaParametre {
  /** Valeur décimale, ou null si [À COMPLÉTER]. */
  valeur: number | null;
}

export interface Fourchette {
  bas: number;
  central: number;
  haut: number;
}

/* --------------------------------------------------------------------------
 *  Listes de référence (formulaire du simulateur)
 * ------------------------------------------------------------------------ */

export const TRANCHES_EFFECTIF = ["1-9", "10-49", "50-249", "250+"] as const;
export type TrancheEffectif = (typeof TRANCHES_EFFECTIF)[number];

export const LIBELLES_EFFECTIF: Record<TrancheEffectif, string> = {
  "1-9": "1 à 9 salariés",
  "10-49": "10 à 49 salariés",
  "50-249": "50 à 249 salariés",
  "250+": "250 salariés et plus",
};

export const FORMES_JURIDIQUES = ["SARL", "SA", "SAS", "Autre"] as const;
export type FormeJuridique = (typeof FORMES_JURIDIQUES)[number];

/** Pays de la zone UEMOA. */
export const PAYS = [
  { code: "CI", libelle: "Côte d'Ivoire" },
  { code: "BJ", libelle: "Bénin" },
  { code: "BF", libelle: "Burkina Faso" },
  { code: "GW", libelle: "Guinée-Bissau" },
  { code: "ML", libelle: "Mali" },
  { code: "NE", libelle: "Niger" },
  { code: "SN", libelle: "Sénégal" },
  { code: "TG", libelle: "Togo" },
] as const;
export type CodePays = (typeof PAYS)[number]["code"];

/* --------------------------------------------------------------------------
 *  Multiples sectoriels (approche par le marché — transactions comparables)
 * ------------------------------------------------------------------------ */

export interface Secteur {
  id: string;
  libelle: string;
  /** Multiple de l'EBE retraité (valeur d'entreprise / EBE). */
  multipleEBE: Fourchette;
  /** Multiple du chiffre d'affaires (valeur d'entreprise / CA). */
  multipleCA: Fourchette;
}

export const multiplesSectoriels: MetaParametre & { secteurs: Secteur[] } = {
  source:
    "Grille de départ BIP (transactions sur PME non cotées en Afrique de l'Ouest) — provisoire",
  dateMiseAJour: "2026-09-30",
  statut: "a_valider",
  secteurs: [
    { id: "commerce", libelle: "Commerce et distribution", multipleEBE: { bas: 3, central: 4, haut: 5 }, multipleCA: { bas: 0.2, central: 0.3, haut: 0.5 } },
    { id: "industrie", libelle: "Industrie et transformation", multipleEBE: { bas: 4, central: 5, haut: 6 }, multipleCA: { bas: 0.4, central: 0.6, haut: 0.8 } },
    { id: "agro", libelle: "Agro-industrie et agriculture", multipleEBE: { bas: 4, central: 5, haut: 6 }, multipleCA: { bas: 0.4, central: 0.6, haut: 0.9 } },
    { id: "btp", libelle: "BTP et construction", multipleEBE: { bas: 3, central: 4, haut: 5 }, multipleCA: { bas: 0.2, central: 0.3, haut: 0.5 } },
    { id: "transport", libelle: "Transport et logistique", multipleEBE: { bas: 3, central: 4, haut: 5 }, multipleCA: { bas: 0.3, central: 0.4, haut: 0.6 } },
    { id: "services", libelle: "Services aux entreprises", multipleEBE: { bas: 4, central: 5, haut: 7 }, multipleCA: { bas: 0.5, central: 0.8, haut: 1.2 } },
    { id: "tech", libelle: "Technologies, numérique, télécoms", multipleEBE: { bas: 5, central: 7, haut: 9 }, multipleCA: { bas: 0.8, central: 1.5, haut: 2.5 } },
    { id: "sante", libelle: "Santé, pharmacie, cliniques", multipleEBE: { bas: 5, central: 6, haut: 8 }, multipleCA: { bas: 0.6, central: 1.0, haut: 1.5 } },
    { id: "education", libelle: "Éducation et formation", multipleEBE: { bas: 4, central: 5, haut: 7 }, multipleCA: { bas: 0.6, central: 0.9, haut: 1.3 } },
    { id: "hotellerie", libelle: "Hôtellerie et restauration", multipleEBE: { bas: 3, central: 4, haut: 6 }, multipleCA: { bas: 0.4, central: 0.7, haut: 1.0 } },
    { id: "immobilier", libelle: "Immobilier et services immobiliers", multipleEBE: { bas: 5, central: 7, haut: 9 }, multipleCA: { bas: 1.0, central: 1.5, haut: 2.5 } },
    { id: "energie", libelle: "Énergie et mines (services)", multipleEBE: { bas: 4, central: 5, haut: 7 }, multipleCA: { bas: 0.5, central: 0.8, haut: 1.2 } },
    { id: "autre", libelle: "Autre", multipleEBE: { bas: 3, central: 4, haut: 5 }, multipleCA: { bas: 0.3, central: 0.5, haut: 0.7 } },
  ],
};

/* --------------------------------------------------------------------------
 *  Taux d'actualisation — coût des fonds propres par empilement (« build-up »)
 *
 *  k = taux sans risque + prime de marché mature + prime pays
 *      + prime de taille PME + prime de risque spécifique
 *
 *  Cohérence des devises : le FCFA est arrimé à l'euro à parité fixe ; on
 *  retient donc un taux sans risque en euros (Bund allemand 10 ans) auquel on
 *  ajoute la prime pays de Damodaran. On n'utilise PAS le rendement d'une
 *  obligation d'État UEMOA : il contient déjà le risque pays, qui serait alors
 *  compté deux fois.
 * ------------------------------------------------------------------------ */

export const tauxSansRisque: ParametreTaux = {
  valeur: 0.0361,
  source: "Trading Economics — rendement du Bund allemand à 10 ans (29/09/2026)",
  dateMiseAJour: "2026-09-29",
  statut: "valide",
};

export const primeMarcheMature: ParametreTaux = {
  valeur: 0.042,
  source: "A. Damodaran — prime de risque implicite du marché mature (mise à jour du 01/07/2026)",
  dateMiseAJour: "2026-07-01",
  statut: "valide",
};

/**
 * Prime de risque pays, par pays de l'UEMOA.
 * Seule la Côte d'Ivoire est obligatoire (blocage du build si vide).
 * Pour les autres pays, `null` = non renseigné : le simulateur applique alors
 * la prime de la Côte d'Ivoire et affiche un avertissement.
 */
export const primeRisquePays: MetaParametre & { valeurs: Record<CodePays, number | null> } = {
  source:
    "A. Damodaran — fichier « ctryprem », mise à jour du 05/01/2026 (Côte d'Ivoire : Moody's Ba2)",
  dateMiseAJour: "2026-01-05",
  statut: "valide",
  valeurs: {
    CI: 0.039,
    BJ: null,
    BF: null,
    GW: null,
    ML: null,
    NE: null,
    SN: null,
    TG: null,
  },
};

/**
 * Prime de taille PME — s'applique UNIQUEMENT à l'approche par le revenu.
 * (L'approche par le marché utilise la décote de taille ci-dessous : jamais
 * les deux sur la même approche.)
 */
export const primeTaille: MetaParametre & { valeurs: Record<TrancheEffectif, number> } = {
  source: "BIP — barème validé le 30/09/2026",
  dateMiseAJour: "2026-09-30",
  statut: "valide",
  valeurs: { "1-9": 0.05, "10-49": 0.04, "50-249": 0.035, "250+": 0.03 },
};

/**
 * Décote de taille sur la valeur d'entreprise — s'applique UNIQUEMENT à
 * l'approche par le marché. (L'approche par le revenu intègre la taille via
 * la prime de taille ci-dessus : jamais les deux sur la même approche.)
 */
export const decoteTaille: MetaParametre & { valeurs: Record<TrancheEffectif, number> } = {
  source: "BIP — barème validé le 30/09/2026",
  dateMiseAJour: "2026-09-30",
  statut: "valide",
  valeurs: { "1-9": 0.15, "10-49": 0.05, "50-249": 0, "250+": 0 },
};

export const croissanceLongTerme: ParametreTaux = {
  valeur: 0.03,
  source: "Hypothèse BIP par défaut — à valider",
  dateMiseAJour: "2026-09-30",
  statut: "a_valider",
};

export const tauxImpotSocietes: ParametreTaux = {
  valeur: 0.25,
  source: "Code général des impôts de Côte d'Ivoire — à valider avec le conseil fiscal",
  dateMiseAJour: "2026-09-30",
  statut: "a_valider",
};

/* --------------------------------------------------------------------------
 *  Règles de calcul et de synthèse
 * ------------------------------------------------------------------------ */

export const reglesCalcul = {
  source: "Cahier des charges BIP (version 2) et réponses du 30/09/2026",
  dateMiseAJour: "2026-09-30",
  statut: "valide" as StatutParametre,
  /** Pondération de la valeur d'entreprise quand les deux approches existent. */
  ponderation: { marche: 0.6, revenu: 0.4 },
  /** Écart appliqué au taux d'actualisation pour la fourchette (± 1 point). */
  ecartTauxFourchette: 0.01,
  /**
   * Décote supplémentaire quand l'EBE retraité est nul ou négatif (méthode du
   * multiple de CA seule). Appliquée EN DERNIER, hors plafond des ajustements.
   */
  decoteEBENegatif: 0.2,
  /** Arrondi de la fourchette finale (1 million de FCFA). */
  arrondi: 1_000_000,
  /** Écart minimal exigé entre taux d'actualisation et croissance (sécurité). */
  ecartMinimalTauxCroissance: 0.02,
};

/* --------------------------------------------------------------------------
 *  Ajustements qualitatifs (étape 4 du simulateur)
 *
 *  Chaque réponse ajuste :
 *   - le multiple de l'approche par le marché (en %, ex. -0.15 = -15 %) ;
 *   - la prime de risque spécifique de l'approche par le revenu (en points
 *     décimaux, ex. 0.02 = +2 points).
 *  Cumul des ajustements de multiple plafonné entre -35 % et +15 % ;
 *  prime de risque spécifique bornée entre 0 et 6 points.
 * ------------------------------------------------------------------------ */

export interface Ajustement {
  multiple: number;
  points: number;
}

export const ajustementsQualitatifs = {
  source: "Cahier des charges BIP (version 2) — valeurs par défaut",
  dateMiseAJour: "2026-09-30",
  statut: "a_valider" as StatutParametre,
  plafond: { min: -0.35, max: 0.15 },
  primeSpecifique: { min: 0, max: 0.06 },
  dependanceDirigeant: {
    non: { multiple: -0.15, points: 0.02 },
    en_partie: { multiple: -0.07, points: 0.01 },
  },
  premierClientPlus30: { multiple: -0.1, points: 0.015 },
  top5ClientsPlus60: { multiple: -0.05, points: 0.005 },
  sansExpertComptable: { multiple: -0.1, points: 0.01 },
  comptesCertifies: { multiple: 0.05, points: -0.005 },
  fiscalSocial: {
    non: { multiple: -0.1, points: 0.01 },
    ne_sait_pas: { multiple: -0.05, points: 0.005 },
  },
  contratsNonEcrits: { multiple: -0.05, points: 0.005 },
  recurrentPlus50: { multiple: 0.05, points: -0.005 },
  equipeDirection: { multiple: 0.05, points: -0.005 },
  litigeImportant: { multiple: -0.1, points: 0.01 },
  /**
   * Croissance annuelle moyenne du CA sur 2 ans. Le cahier des charges ne
   * prévoit pas d'effet sur la prime spécifique : points = 0.
   */
  croissanceForte: { seuil: 0.1, multiple: 0.05, points: 0 },
  baisseForte: { seuil: -0.1, multiple: -0.1, points: 0 },
  entrepriseRecente: { ageMaximum: 3, multiple: -0.1, points: 0.01 },
};

/* --------------------------------------------------------------------------
 *  Textes réglementaires
 * ------------------------------------------------------------------------ */

export const AVERTISSEMENT_SIMULATEUR =
  "Cette estimation est indicative. Elle repose sur les informations que vous avez déclarées, non vérifiées, et sur des paramètres de marché moyens. Elle ne constitue ni une évaluation au sens des normes professionnelles, ni une offre, ni un conseil en investissement. Seule une analyse approfondie par un conseiller BIP permet d'apprécier la valeur de votre entreprise. La valeur n'est pas le prix : le prix résulte de la négociation.";

export const MESSAGE_DEFICITAIRE =
  "Votre entreprise est actuellement déficitaire : sa valeur dépend surtout de son redressement et de son patrimoine. Un échange avec un conseiller est recommandé.";
