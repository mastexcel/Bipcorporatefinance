/**
 * Calcul du score de préparation à la cession (fonctions pures).
 * Barème et règles : config/readiness.ts.
 */
import {
  NIVEAUX,
  REPONSES_BLOQUANTES,
  readiness,
  type BlocReadiness,
  type NiveauId,
} from "@/config/readiness";

export type ReponsesReadiness = Record<string, string>;

export interface ScoreBloc {
  id: string;
  libelle: string;
  points: number;
  pointsMax: number;
}

export interface ActionPrioritaire {
  questionId: string;
  bloc: string;
  action: string;
  pointsPerdus: number;
}

export interface ResultatReadiness {
  score: number;
  blocs: ScoreBloc[];
  niveau: NiveauId;
  libelleNiveau: string;
  /** Niveau qu'aurait donné le score seul (avant règle bloquante). */
  niveauSansBlocage: NiveauId;
  blocages: string[];
  actions: ActionPrioritaire[];
}

export class ReponseInvalideError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReponseInvalideError";
  }
}

export function niveauPourScore(score: number): NiveauId {
  let niveau: NiveauId = "a_preparer";
  for (const n of NIVEAUX) if (score >= n.seuil) niveau = n.id;
  return niveau;
}

export function calculerScore(
  reponses: ReponsesReadiness,
  blocsConfig: BlocReadiness[] = readiness.blocs,
): ResultatReadiness {
  const blocs: ScoreBloc[] = [];
  const pertes: (ActionPrioritaire & { ordre: number })[] = [];
  let ordre = 0;

  for (const bloc of blocsConfig) {
    let points = 0;
    let pointsMax = 0;
    for (const q of bloc.questions) {
      const valeur = reponses[q.id];
      const option = q.options.find((o) => o.valeur === valeur);
      if (!option) throw new ReponseInvalideError(`Réponse manquante ou invalide : ${q.id}`);
      points += option.points;
      pointsMax += q.pointsMax;
      if (option.points < q.pointsMax) {
        pertes.push({
          questionId: q.id,
          bloc: bloc.libelle,
          action: q.action,
          pointsPerdus: q.pointsMax - option.points,
          ordre: ordre,
        });
      }
      ordre++;
    }
    blocs.push({ id: bloc.id, libelle: bloc.libelle, points, pointsMax });
  }

  const score = blocs.reduce((s, b) => s + b.points, 0);
  const niveauSansBlocage = niveauPourScore(score);

  // Règle bloquante : niveau limité à « En progrès ».
  const blocages = REPONSES_BLOQUANTES.filter((r) => reponses[r.question] === r.valeur).map((r) => r.explication);
  const niveau: NiveauId = blocages.length > 0 && niveauSansBlocage === "pret" ? "en_progres" : niveauSansBlocage;

  // 3 actions prioritaires : les réponses qui font perdre le plus de points
  // (à égalité, l'ordre du questionnaire).
  const actions = pertes
    .sort((a, b) => b.pointsPerdus - a.pointsPerdus || a.ordre - b.ordre)
    .slice(0, 3)
    .map(({ ordre: _ordre, ...a }) => a);

  const libelleNiveau = NIVEAUX.find((n) => n.id === niveau)?.libelle ?? niveau;
  return { score, blocs, niveau, libelleNiveau, niveauSansBlocage, blocages, actions };
}
