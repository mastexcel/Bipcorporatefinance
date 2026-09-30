/**
 * Contenu de la page « Notre méthode » : 10 étapes et FAQ.
 * Durées indicatives communiquées par BIP le 30/09/2026.
 */

export interface EtapeProcessus {
  titre: string;
  quoi: string;
  aFournir: string;
  /** Durée indicative (variable selon les dossiers). */
  duree: string;
}

export const MENTION_DUREES = "Durées indicatives, variables selon les dossiers.";
export const DUREE_TOTALE = "6 à 12 mois";

export const etapesProcessus: EtapeProcessus[] = [
  {
    titre: "Premier échange confidentiel et accord de confidentialité",
    quoi: "Nous faisons connaissance, comprenons votre projet et vos objectifs. Un accord de confidentialité est signé dès ce premier échange.",
    aFournir: "Une présentation orale de l'entreprise et de votre projet.",
    duree: "1 à 2 semaines",
  },
  {
    titre: "Diagnostic et évaluation",
    quoi: "Analyse des comptes, retraitement de l'EBE, application de plusieurs méthodes d'évaluation. Nous vous remettons une fourchette de valeur et la liste des points à améliorer.",
    aFournir: "Les états financiers des 3 derniers exercices, la balance, l'état des dettes et les principaux contrats.",
    duree: "2 à 4 semaines",
  },
  {
    titre: "Lettre de mission",
    quoi: "Nous formalisons notre intervention : périmètre, calendrier et honoraires (honoraires fixes et honoraires de succès).",
    aFournir: "Votre validation des objectifs (prix, calendrier, profil d'acquéreur souhaité).",
    duree: "1 semaine",
  },
  {
    titre: "Préparation : teaser, mémorandum, data room",
    quoi: "Rédaction d'un teaser anonyme, d'un mémorandum d'information détaillé et constitution d'une data room sécurisée.",
    aFournir: "Documents juridiques, financiers, commerciaux et sociaux ; disponibilité pour des entretiens.",
    duree: "4 à 6 semaines",
  },
  {
    titre: "Identification et approche ciblée des acquéreurs",
    quoi: "Sélection d'une liste d'acquéreurs pertinents (groupes, investisseurs, fonds), validée avec vous, puis envoi du teaser anonyme.",
    aFournir: "Votre avis sur la liste : acquéreurs à privilégier ou à exclure (concurrents directs, par exemple).",
    duree: "4 à 8 semaines",
  },
  {
    titre: "Accords de confidentialité et envoi du mémorandum",
    quoi: "Les acquéreurs intéressés signent un accord de confidentialité avant de recevoir le mémorandum d'information.",
    aFournir: "Réponses aux premières questions des acquéreurs, par notre intermédiaire.",
    duree: "En parallèle de l'étape 5",
  },
  {
    titre: "Réception et comparaison des offres indicatives",
    quoi: "Nous analysons et comparons les offres : prix, structure, conditions, solidité de l'acquéreur. Nous vous recommandons les acquéreurs à retenir.",
    aFournir: "Votre décision sur les acquéreurs admis en due diligence.",
    duree: "3 à 4 semaines",
  },
  {
    titre: "Due diligence des acquéreurs retenus",
    quoi: "Les acquéreurs auditent l'entreprise (finances, juridique, fiscal, social). Nous coordonnons les échanges et préservons votre disponibilité.",
    aFournir: "Accès à la data room, réponses aux questions, rencontres avec l'équipe de direction si nécessaire.",
    duree: "4 à 8 semaines",
  },
  {
    titre: "Offre ferme, protocole de cession et garantie d'actif et de passif",
    quoi: "Négociation de l'offre ferme puis du protocole de cession et de la garantie d'actif et de passif, avec votre avocat.",
    aFournir: "Vos arbitrages sur les points de négociation ; la coordination avec votre avocat et votre expert-comptable.",
    duree: "3 à 6 semaines",
  },
  {
    titre: "Closing et accompagnement de la transition",
    quoi: "Signature des actes, paiement du prix et transfert des titres. Nous accompagnons ensuite la transition avec le repreneur.",
    aFournir: "Les documents de closing ; votre implication dans la transition convenue.",
    duree: "2 à 4 semaines, puis accompagnement selon l'accord",
  },
];

export interface QuestionFaqTexte {
  question: string;
  reponse: string;
}

export const faqMethode: QuestionFaqTexte[] = [
  {
    question: "Combien coûte votre accompagnement ?",
    reponse:
      "Notre rémunération combine des honoraires fixes modestes, qui couvrent le travail de préparation, et des honoraires de succès, versés uniquement si l'opération aboutit. Nos intérêts sont ainsi alignés sur les vôtres. Les conditions sont précisées dans la lettre de mission, après le diagnostic.",
  },
  {
    question: "Combien de temps dure une cession ?",
    reponse:
      "Comptez en général 6 à 12 mois entre le premier échange et le closing. La durée varie selon la préparation de l'entreprise, le nombre d'acquéreurs et la complexité de l'opération. Nous établissons un calendrier indicatif dès le diagnostic.",
  },
  {
    question: "Comment garantissez-vous la confidentialité ?",
    reponse:
      "Un accord de confidentialité est signé dès le premier échange. Les acquéreurs sont d'abord approchés avec un teaser anonyme, et ne reçoivent d'informations détaillées qu'après avoir signé à leur tour un accord de confidentialité. L'accès à la data room est contrôlé et nominatif.",
  },
  {
    question: "Quand informer mes salariés ?",
    reponse:
      "En général, le plus tard possible, et de façon préparée : souvent à la signature ou juste avant, avec le repreneur. Certains collaborateurs clés peuvent être informés plus tôt, sous confidentialité, s'ils doivent participer au processus. Les éventuelles obligations légales d'information doivent être vérifiées avec votre avocat.",
  },
  {
    question: "Quelles méthodes d'évaluation utilisez-vous ?",
    reponse:
      "Nous appliquons les trois approches reconnues par les normes internationales d'évaluation (IVS) : l'approche par le marché (multiples de transactions comparables), l'approche par le revenu (actualisation ou capitalisation des flux de trésorerie) et l'approche patrimoniale (actif net). Nous les croisons pour aboutir à une fourchette de valeur argumentée.",
  },
  {
    question: "Quelle différence entre valeur et prix ?",
    reponse:
      "La valeur est une estimation fondée sur des méthodes et des hypothèses. Le prix est le résultat d'une négociation entre un vendeur et un acquéreur : il dépend du nombre d'acquéreurs intéressés, de leurs synergies, du calendrier et de la qualité de la préparation.",
  },
  {
    question: "Travaillez-vous avec mon expert-comptable et mon avocat ?",
    reponse:
      "Oui, systématiquement. Votre expert-comptable est un interlocuteur clé pour les données financières, et votre avocat rédige ou revoit les actes juridiques. Nous coordonnons l'ensemble des conseils pour que le processus avance de manière fluide.",
  },
  {
    question: "Qu'est-ce qu'une garantie d'actif et de passif ?",
    reponse:
      "C'est un engagement du cédant envers l'acquéreur : si un passif né avant la cession apparaît après (redressement fiscal, litige, par exemple), le cédant indemnise l'acquéreur, dans les limites prévues (montant, durée, franchise). Son contenu se négocie et doit être rédigé par votre avocat.",
  },
  {
    question: "Accompagnez-vous les acquéreurs étrangers ?",
    reponse:
      "Oui. Nous accompagnons les groupes et investisseurs étrangers dans la recherche de cibles, l'approche des dirigeants, l'évaluation et la due diligence, en lien avec leurs conseils juridiques et fiscaux pour la structuration de l'opération dans le cadre OHADA.",
  },
  {
    question: "Que se passe-t-il après la signature ?",
    reponse:
      "Le closing organise le paiement du prix et le transfert des titres. Une période de transition, convenue avec le repreneur, permet ensuite de transmettre les relations clés et le savoir-faire. Nous restons à vos côtés pendant cette phase.",
  },
];
