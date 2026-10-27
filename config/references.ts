/**
 * Références d'opérations (« tombstones »).
 *
 * ⚠️ N'ajouter une opération qu'avec l'accord écrit du client.
 * Si le client ne souhaite pas être nommé, laisser `client` à null : la
 * description anonyme est alors affichée (ex. « Cession d'une société de
 * distribution — Côte d'Ivoire »).
 *
 * Exemple (à dupliquer dans le tableau) :
 * {
 *   id: "cession-distribution-2025",
 *   client: null,
 *   descriptionAnonyme: "Cession d'une société de distribution",
 *   pays: "Côte d'Ivoire",
 *   secteur: "Commerce et distribution",
 *   typeOperation: "cession",
 *   roleBIP: "Conseil du cédant",
 *   annee: 2025,
 *   logo: null, // ex. "/references/logo-client.png"
 * },
 */

export const TYPES_OPERATION = {
  cession: "Cession",
  transmission: "Transmission",
  acquisition: "Acquisition",
  levee: "Levée de fonds",
  evaluation: "Évaluation",
} as const;
export type TypeOperation = keyof typeof TYPES_OPERATION;

export interface Reference {
  id: string;
  client: string | null;
  descriptionAnonyme: string;
  pays: string;
  secteur: string;
  typeOperation: TypeOperation;
  roleBIP: string;
  annee: number;
  logo: string | null;
}

/** [À COMPLÉTER] — aucune référence n'est publiée tant que BIP ne les a pas fournies. */
export const references: Reference[] = [];
