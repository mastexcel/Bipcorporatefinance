/**
 * Équipe — page À propos.
 * Source : CV de M. ATTEMENE Zatri Jean-Jacques fournis le 30/09/2026.
 * Aucune donnée personnelle (âge, situation familiale, coordonnées privées)
 * n'est publiée. Pour ajouter un membre : dupliquer l'objet et déposer sa
 * photo dans public/equipe/ (champ `photo`).
 */

export interface MembreEquipe {
  nom: string;
  fonction: string;
  /** Chemin d'une photo dans public/equipe/, ou null (initiales affichées). */
  photo: string | null;
  initiales: string;
  presentation: string[];
  experiences: { titre: string; detail: string; periode: string }[];
  enseignement: string[];
  formation: { intitule: string; etablissement: string; annee?: string }[];
  distinctions: string[];
  langues: string;
  linkedin: string | null;
}

export const equipe: MembreEquipe[] = [
  {
    nom: "Jean-Jacques ATTEMENE ZATRI",
    fonction: "Directeur général et co-fondateur",
    photo: null,
    initiales: "JJA",
    presentation: [
      "Titulaire d'un MBA Banque et Finance du CESAG (Dakar), Jean-Jacques ATTEMENE ZATRI cumule plus de 16 ans d'expérience en finance d'entreprise, analyse financière et accompagnement de PME en Afrique de l'Ouest.",
      "Co-fondateur et directeur général de Bridge Investment Partners (conseil, transport, immobilier), il a conduit plus de 35 études de marché et business plans pour des PME et des startups (commerce, logistique, services, industrie, immobilier), dont 9 projets immobiliers menés jusqu'au financement. Il accompagne les dirigeants dans leur stratégie, leur structuration financière et leurs levées de fonds auprès d'institutions financières et d'investisseurs privés.",
    ],
    experiences: [
      {
        titre: "Programme CHAMPION (Banque africaine de développement) — Chambre de Commerce et d'Industrie de Côte d'Ivoire",
        detail:
          "Supervision de la notation financière de 12 PME avec Bloomfield Investment ; pilotage d'un portefeuille de 102 PME et conception d'un référentiel de 46 indicateurs de performance.",
        periode: "2015-2019",
      },
      {
        titre: "Chef de projet — Cabinet ELITES",
        detail:
          "Business models et business plans quinquennaux, plans stratégiques et procédures financières pour des institutions de premier plan (CNAM, CDC-CI, NPSP, GESTOCI, CARITAS).",
        periode: "2021-2023",
      },
      {
        titre: "Ingénierie financière et études de marché",
        detail:
          "Missions pour la GIZ, Enabel, l'Union européenne, le PNUD et Solidaridad : business plans, modélisation financière, évaluation des risques et recherche de financements pour plus de 25 entreprises.",
        periode: "2024-2026",
      },
      {
        titre: "Consultant senior — Euromonitor International",
        detail: "Études de marché sectorielles, analyse concurrentielle et des canaux de distribution.",
        periode: "2019-2020",
      },
      {
        titre: "Développement de marché — PANEX Afrique (bourse de commodités CEDEAO)",
        detail: "Suivi des transactions commerciales et couverture du risque de change.",
        periode: "2014-2015",
      },
    ],
    enseignement: [
      "Analyse financière, évaluation d'actifs, produits dérivés et gestion des risques — Institut Universitaire d'Abidjan (Licence 3 à Master 2)",
      "Fiscalité — Université Méthodiste de Côte d'Ivoire",
    ],
    formation: [
      { intitule: "MBA Banque et Finance", etablissement: "CESAG Business School, Dakar", annee: "2014" },
      { intitule: "Certificat en gestion comptable et financière", etablissement: "COLEAD" },
      { intitule: "Certificat en gestion de projet", etablissement: "Chaire UNESCO, Université Alassane Ouattara" },
      { intitule: "Formateur certifié en création d'entreprise (GERME)", etablissement: "Bureau international du Travail" },
      { intitule: "Certificat Business Development Services", etablissement: "JICA, Nagoya (Japon)", annee: "2016" },
    ],
    distinctions: ["Lauréat 2024 de l'appel à projets « Shaping the Future with AI » de l'Ambassade des États-Unis en Côte d'Ivoire"],
    langues: "Français, anglais professionnel",
    linkedin: null,
  },
];

/**
 * Chiffres clés de la page d'accueil.
 * Source : CV du gérant (activité de BIP depuis 2022 et parcours). À mettre à
 * jour au fil des missions.
 */
export const chiffresCles = [
  { valeur: "16+", libelle: "années d'expérience en finance d'entreprise et en conseil aux PME" },
  { valeur: "35+", libelle: "études de marché et business plans réalisés pour des PME et startups" },
  { valeur: "9", libelle: "projets immobiliers accompagnés jusqu'au financement" },
];
