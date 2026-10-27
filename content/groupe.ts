/**
 * Groupe BIP : marques, réseau d'experts, missions de référence et partenaires.
 * Source : présentation institutionnelle de Bridge Investment Partners
 * (diapositives fournies le 30/09/2026).
 *
 * ⚠️ Les missions ci-dessous sont des missions de CONSEIL (études, business
 * plans, notation, tableaux de bord), et non des opérations de
 * fusion-acquisition : elles ne doivent pas être présentées comme des
 * « tombstones » (config/references.ts).
 */

export const marques = [
  {
    nom: "BIP Expertise",
    pole: "Conseil",
    description:
      "Formation, structuration des organisations, études, business plans, IA et aide à la décision. BIP Corporate Finance en est la branche dédiée à la valorisation, à la cession et à la levée de fonds.",
  },
  { nom: "BIP Transport", pole: "Transport", description: "Livraison de colis à moto et transport de personnes en voiture." },
  { nom: "BIP Immobilier", pole: "Immobilier", description: "Aménagement, construction, finitions et vitrerie." },
];

export const reseauExperts = {
  total: 17,
  libelle: "consultants et formateurs",
  domaines: [
    { domaine: "Finance et entrepreneuriat", nombre: 4 },
    { domaine: "Données et statistique", nombre: 4 },
    { domaine: "Agro-économie", nombre: 4 },
    { domaine: "Phytopathologie et biotechnologie", nombre: 3 },
    { domaine: "Stratégie commerciale", nombre: 2 },
  ],
  profils:
    "Chercheurs du CNRA et de l'INP-HB, anciens cadres de la BICICI, de la Société Générale et d'Olam, consultants passés par le PNUD et le CIRAD.",
};

export interface Mission {
  client: string;
  mission: string;
  /** Missions les plus proches du conseil financier : mises en avant sur l'accueil. */
  finance?: boolean;
}

export const missionsReference: Mission[] = [
  { client: "CCI Côte d'Ivoire / Banque africaine de développement", mission: "Notation financière et managériale de PME (programme CHAMPION)", finance: true },
  { client: "GESTOCI", mission: "Plan d'affaires et étude de rentabilité des contrats B2B", finance: true },
  { client: "McRays, AF-CHEM SOFACO", mission: "Tableaux de bord et gestion de trésorerie", finance: true },
  { client: "Solidaridad", mission: "Business model et business plans des programmes CORIP 1 et 2 (cacao)" },
  { client: "Lady Agri / COLEAD", mission: "Modèle économique des marchés de proximité" },
  { client: "IPS-CNAM", mission: "Audit organisationnel pour la couverture maladie universelle" },
  { client: "Conseil régional du Cavally", mission: "Formation des jeunes et des femmes au montage de projet" },
  { client: "Bureau international du Travail", mission: "Formation de formateurs en entrepreneuriat" },
];

/** Partenaires, bailleurs et clients (noms uniquement, sans logos). */
export const partenaires = [
  "GIZ",
  "Union européenne",
  "Banque africaine de développement",
  "Bureau international du Travail",
  "AGEFOP",
  "Solidaridad",
  "COLEAD",
  "MTN",
  "Lady Agri",
  "OCPV",
  "Conseil régional du Cavally",
  "Mairie de Dabou",
  "Institut Universitaire d'Abidjan",
  "Université Méthodiste de Côte d'Ivoire",
  "Agro Expertises",
  "McRays Consultants & Partners",
  "AF-CHEM SOFACO",
  "DGAimmo360",
  "Lycée professionnel de Bimbresso",
];
