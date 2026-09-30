import { describe, expect, it } from "vitest";
import { readiness } from "@/config/readiness";
import { calculerScore, niveauPourScore, ReponseInvalideError, type ReponsesReadiness } from "@/lib/readiness/score";

/** Réponses donnant le maximum de points partout. */
function reponsesMax(): ReponsesReadiness {
  const r: ReponsesReadiness = {};
  for (const b of readiness.blocs) {
    for (const q of b.questions) {
      const meilleure = [...q.options].sort((a, c) => c.points - a.points)[0];
      if (meilleure) r[q.id] = meilleure.valeur;
    }
  }
  return r;
}

describe("Barème du score de préparation", () => {
  it("comporte 5 blocs de 3 questions, chacun sur 20 points (total 100)", () => {
    expect(readiness.blocs).toHaveLength(5);
    for (const b of readiness.blocs) {
      expect(b.questions).toHaveLength(3);
      expect(b.questions.reduce((s, q) => s + q.pointsMax, 0)).toBe(20);
      for (const q of b.questions) {
        expect(Math.max(...q.options.map((o) => o.points))).toBe(q.pointsMax);
      }
    }
  });
});

describe("Calcul du score", () => {
  it("donne 100 / « Prêt » sans action prioritaire quand tout est au maximum", () => {
    const r = calculerScore(reponsesMax());
    expect(r.score).toBe(100);
    expect(r.niveau).toBe("pret");
    expect(r.actions).toHaveLength(0);
    expect(r.blocs.every((b) => b.points === 20)).toBe(true);
  });

  it("applique les seuils 50 et 75", () => {
    expect(niveauPourScore(49)).toBe("a_preparer");
    expect(niveauPourScore(50)).toBe("en_progres");
    expect(niveauPourScore(74)).toBe("en_progres");
    expect(niveauPourScore(75)).toBe("pret");
  });

  it("limite à « En progrès » si la situation fiscale et sociale n'est pas à jour", () => {
    const r = calculerScore({ ...reponsesMax(), fiscalSocial: "non" });
    expect(r.score).toBe(93);
    expect(r.niveauSansBlocage).toBe("pret");
    expect(r.niveau).toBe("en_progres");
    expect(r.blocages).toHaveLength(1);
  });

  it("limite à « En progrès » en cas de litige important", () => {
    const r = calculerScore({ ...reponsesMax(), litiges: "important" });
    expect(r.niveau).toBe("en_progres");
    expect(r.blocages[0]).toMatch(/litige/);
  });

  it("ne relève pas un niveau « À préparer » à cause de la règle bloquante", () => {
    const faible: ReponsesReadiness = {};
    for (const b of readiness.blocs) for (const q of b.questions) {
      const pire = [...q.options].sort((a, c) => a.points - c.points)[0];
      if (pire) faible[q.id] = pire.valeur;
    }
    const r = calculerScore(faible);
    expect(r.niveau).toBe("a_preparer");
    expect(r.blocages.length).toBe(2);
  });

  it("retient les 3 réponses qui font perdre le plus de points", () => {
    const r = calculerScore({
      ...reponsesMax(),
      fiabiliteComptes: "interne", // −7
      procedures: "en_partie", // −3
      concentration: "moyenne", // −3
      dependance: "non", // −7
      attentesPrix: "aucune", // −5
    });
    expect(r.actions.map((a) => a.questionId)).toEqual(["fiabiliteComptes", "dependance", "attentesPrix"]);
    expect(r.score).toBe(100 - 7 - 3 - 3 - 7 - 5);
  });

  it("refuse une réponse manquante", () => {
    const r = reponsesMax();
    delete r.horizon;
    expect(() => calculerScore(r)).toThrow(ReponseInvalideError);
  });
});
