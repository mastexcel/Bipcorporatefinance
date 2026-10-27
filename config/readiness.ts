/* ==========================================================================
 *  Score de préparation à la cession — questions, barème et règles.
 *  Validé par BIP le 30/09/2026 :
 *   - 5 blocs de 20 points (3 questions par bloc), total sur 100 ;
 *   - seuils : < 50 « À préparer » ; 50 à 74 « En progrès » ; ≥ 75 « Prêt » ;
 *   - règle bloquante : situation fiscale et sociale non à jour OU litige
 *     important → niveau limité à « En progrès », quel que soit le score ;
 *   - 3 actions prioritaires = les 3 réponses qui font perdre le plus de points.
 *  Le détail des questions et des points est proposé par défaut [À VALIDER].
 * ========================================================================== */

export interface OptionReadiness {
  valeur: string;
  libelle: string;
  points: number;
}

export interface QuestionReadiness {
  id: string;
  libelle: string;
  aide?: string;
  pointsMax: number;
  options: OptionReadiness[];
  /** Action conseillée si la réponse ne donne pas le maximum de points. */
  action: string;
}

export interface BlocReadiness {
  id: string;
  libelle: string;
  questions: QuestionReadiness[];
}

export const NIVEAUX = [
  { id: "a_preparer", libelle: "À préparer", seuil: 0 },
  { id: "en_progres", libelle: "En progrès", seuil: 50 },
  { id: "pret", libelle: "Prêt", seuil: 75 },
] as const;
export type NiveauId = (typeof NIVEAUX)[number]["id"];

/** Réponses qui plafonnent le niveau à « En progrès ». */
export const REPONSES_BLOQUANTES: { question: string; valeur: string; explication: string }[] = [
  {
    question: "fiscalSocial",
    valeur: "non",
    explication:
      "Votre situation fiscale et sociale n'est pas à jour : tant qu'elle n'est pas régularisée, un acquéreur exigera des garanties importantes ou renoncera. Votre niveau est donc limité à « En progrès ».",
  },
  {
    question: "litiges",
    valeur: "important",
    explication:
      "Un litige important est en cours : il crée une incertitude sur la valeur et bloque souvent les négociations. Votre niveau est donc limité à « En progrès ».",
  },
];

export const readiness = {
  source: "BIP — barème validé le 30/09/2026 (questions et points par défaut à valider)",
  dateMiseAJour: "2026-09-30",
  blocs: [
    {
      id: "finances",
      libelle: "Finances",
      questions: [
        {
          id: "fiabiliteComptes",
          libelle: "Comment sont établis vos comptes annuels ?",
          pointsMax: 7,
          options: [
            { valeur: "certifies", libelle: "Certifiés par un commissaire aux comptes", points: 7 },
            { valeur: "expert", libelle: "Établis par un expert-comptable", points: 4 },
            { valeur: "interne", libelle: "Tenus en interne, sans expert-comptable", points: 0 },
          ],
          action:
            "Fiabiliser vos comptes : les faire établir par un expert-comptable, puis envisager une certification sur les deux derniers exercices.",
        },
        {
          id: "rentabilite",
          libelle: "Comment a évolué votre rentabilité (EBE) sur les 3 derniers exercices ?",
          pointsMax: 7,
          options: [
            { valeur: "hausse", libelle: "En hausse régulière", points: 7 },
            { valeur: "stable", libelle: "Stable", points: 5 },
            { valeur: "irreguliere", libelle: "Irrégulière", points: 2 },
            { valeur: "deficitaire", libelle: "Déficitaire", points: 0 },
          ],
          action:
            "Stabiliser la rentabilité et documenter les éléments exceptionnels : l'acquéreur valorise un résultat récurrent et explicable.",
        },
        {
          id: "endettement",
          libelle: "Vos dettes financières représentent combien d'années d'EBE ?",
          aide: "Emprunts bancaires et crédit-bail, diminués de la trésorerie disponible.",
          pointsMax: 6,
          options: [
            { valeur: "faible", libelle: "Moins d'une année (ou pas de dette)", points: 6 },
            { valeur: "moyen", libelle: "Entre 1 et 3 années", points: 4 },
            { valeur: "eleve", libelle: "Plus de 3 années", points: 1 },
            { valeur: "nsp", libelle: "Je ne sais pas", points: 0 },
          ],
          action:
            "Maîtriser l'endettement : chaque franc de dette nette est déduit du prix de vos titres.",
        },
      ],
    },
    {
      id: "clients",
      libelle: "Clients et marché",
      questions: [
        {
          id: "concentration",
          libelle: "Quelle part de votre chiffre d'affaires représente votre premier client ?",
          pointsMax: 7,
          options: [
            { valeur: "faible", libelle: "Moins de 15 %", points: 7 },
            { valeur: "moyenne", libelle: "Entre 15 % et 30 %", points: 4 },
            { valeur: "forte", libelle: "Plus de 30 %", points: 0 },
          ],
          action:
            "Réduire la dépendance à votre premier client en développant de nouveaux comptes.",
        },
        {
          id: "recurrence",
          libelle: "Quelle part de votre chiffre d'affaires est récurrente (contrats, abonnements) ?",
          pointsMax: 7,
          options: [
            { valeur: "forte", libelle: "Plus de 50 %", points: 7 },
            { valeur: "moyenne", libelle: "Entre 20 % et 50 %", points: 4 },
            { valeur: "faible", libelle: "Moins de 20 %", points: 1 },
          ],
          action:
            "Développer le chiffre d'affaires récurrent (contrats pluriannuels, maintenance, abonnements).",
        },
        {
          id: "contrats",
          libelle: "Vos relations avec les clients et fournisseurs clés sont-elles formalisées par écrit ?",
          pointsMax: 6,
          options: [
            { valeur: "oui", libelle: "Oui", points: 6 },
            { valeur: "en_partie", libelle: "En partie", points: 3 },
            { valeur: "non", libelle: "Non", points: 0 },
          ],
          action:
            "Formaliser par écrit les contrats avec vos principaux clients et fournisseurs, en vérifiant les clauses de changement de contrôle.",
        },
      ],
    },
    {
      id: "organisation",
      libelle: "Organisation",
      questions: [
        {
          id: "dependance",
          libelle: "Votre entreprise peut-elle fonctionner 3 mois sans vous ?",
          pointsMax: 7,
          options: [
            { valeur: "oui", libelle: "Oui", points: 7 },
            { valeur: "en_partie", libelle: "En partie", points: 3 },
            { valeur: "non", libelle: "Non", points: 0 },
          ],
          action:
            "Réduire votre rôle opérationnel : déléguer les relations clés (clients, banques, fournisseurs) et les décisions courantes.",
        },
        {
          id: "equipe",
          libelle: "Disposez-vous d'une équipe de direction en dehors de vous ?",
          pointsMax: 7,
          options: [
            { valeur: "complete", libelle: "Oui, une équipe complète", points: 7 },
            { valeur: "partielle", libelle: "Quelques responsables clés", points: 3 },
            { valeur: "non", libelle: "Non", points: 0 },
          ],
          action:
            "Structurer une équipe de direction (finances, commercial, opérations) capable d'assurer la continuité.",
        },
        {
          id: "procedures",
          libelle: "Vos procédures (achats, ventes, production, paie) sont-elles écrites ?",
          pointsMax: 6,
          options: [
            { valeur: "oui", libelle: "Oui", points: 6 },
            { valeur: "en_partie", libelle: "En partie", points: 3 },
            { valeur: "non", libelle: "Non", points: 0 },
          ],
          action:
            "Documenter les procédures clés : elles rassurent l'acquéreur sur la continuité de l'activité.",
        },
      ],
    },
    {
      id: "juridique",
      libelle: "Juridique et fiscal",
      questions: [
        {
          id: "fiscalSocial",
          libelle: "Votre situation fiscale et sociale (impôts, CNPS) est-elle à jour ?",
          pointsMax: 7,
          options: [
            { valeur: "oui", libelle: "Oui", points: 7 },
            { valeur: "nsp", libelle: "Je ne sais pas", points: 2 },
            { valeur: "non", libelle: "Non", points: 0 },
          ],
          action:
            "Régulariser votre situation fiscale et sociale avec votre expert-comptable et votre conseil fiscal : c'est un préalable à toute cession.",
        },
        {
          id: "litiges",
          libelle: "Avez-vous des litiges en cours (clients, salariés, administration) ?",
          pointsMax: 7,
          options: [
            { valeur: "aucun", libelle: "Aucun", points: 7 },
            { valeur: "mineurs", libelle: "Quelques litiges mineurs", points: 4 },
            { valeur: "important", libelle: "Un litige important", points: 0 },
          ],
          action:
            "Traiter ou provisionner les litiges en cours avec votre avocat avant d'approcher des acquéreurs.",
        },
        {
          id: "proprieteActifs",
          libelle: "Les actifs clés (terrains, équipements, marques) appartiennent-ils bien à la société ?",
          aide: "Par exemple : marques déposées à l'OAPI au nom de la société, titres de propriété à jour.",
          pointsMax: 6,
          options: [
            { valeur: "oui", libelle: "Oui, tous", points: 6 },
            { valeur: "en_partie", libelle: "En partie", points: 3 },
            { valeur: "non", libelle: "Non, ou je ne sais pas", points: 0 },
          ],
          action:
            "Sécuriser la propriété des actifs : marques déposées au nom de la société, titres fonciers et contrats de bail à jour.",
        },
      ],
    },
    {
      id: "projet",
      libelle: "Projet du dirigeant",
      questions: [
        {
          id: "horizon",
          libelle: "Dans quel délai envisagez-vous la cession ?",
          aide: "Une cession se prépare idéalement 2 à 3 ans à l'avance.",
          pointsMax: 7,
          options: [
            { valeur: "plus2ans", libelle: "Dans plus de 2 ans", points: 7 },
            { valeur: "1a2ans", libelle: "Dans 1 à 2 ans", points: 5 },
            { valeur: "moins1an", libelle: "Dans moins d'un an", points: 2 },
            { valeur: "indefini", libelle: "Je ne sais pas encore", points: 3 },
          ],
          action:
            "Fixer un calendrier réaliste : se donner le temps de préparer l'entreprise augmente le prix et le nombre d'acquéreurs.",
        },
        {
          id: "roleApres",
          libelle: "Êtes-vous prêt à accompagner le repreneur après la cession ?",
          pointsMax: 7,
          options: [
            { valeur: "long", libelle: "Oui, 6 à 24 mois si nécessaire", points: 7 },
            { valeur: "court", libelle: "Quelques mois seulement", points: 4 },
            { valeur: "non", libelle: "Non, je souhaite partir immédiatement", points: 0 },
          ],
          action:
            "Préparer une période d'accompagnement du repreneur : elle sécurise la transition et souvent le prix.",
        },
        {
          id: "attentesPrix",
          libelle: "Sur quoi reposent vos attentes de prix ?",
          pointsMax: 6,
          options: [
            { valeur: "evaluation", libelle: "Une évaluation récente par un professionnel", points: 6 },
            { valeur: "estimation", libelle: "Ma propre estimation", points: 3 },
            { valeur: "aucune", libelle: "Je n'en ai pas encore", points: 1 },
          ],
          action:
            "Faire évaluer l'entreprise par un professionnel pour fonder vos attentes de prix sur des méthodes reconnues.",
        },
      ],
    },
  ] satisfies BlocReadiness[],
};
