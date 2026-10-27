import { describe, expect, it } from "vitest";
import {
  arrondir,
  calculerCroissanceAnnuelle,
  calculerEBERetraite,
  evaluer,
  parametresEnVigueur,
  parametresManquants,
  ParametreManquantError,
  type DonneesSimulation,
  type ParametresValorisation,
} from "@/lib/valuation";
import { formaterFCFA, formaterMillions, lireMontant } from "@/lib/valuation/format";

const M = 1_000_000;
const ANNEE = 2026;

/**
 * Cas de référence : société de services, Côte d'Ivoire, 10-49 salariés,
 * profil neutre (aucun ajustement qualitatif).
 */
function cas(modif: {
  entreprise?: Partial<DonneesSimulation["entreprise"]>;
  chiffres?: Partial<DonneesSimulation["chiffres"]>;
  retraitements?: Partial<DonneesSimulation["retraitements"]>;
  profil?: Partial<DonneesSimulation["profil"]>;
} = {}): DonneesSimulation {
  return {
    entreprise: { secteur: "services", pays: "CI", anneeCreation: 2010, effectif: "10-49", formeJuridique: "SARL", ...modif.entreprise },
    chiffres: {
      chiffreAffaires: 1000 * M,
      ebe: 150 * M,
      dotationsAmortissements: 30 * M,
      dettesFinancieres: 100 * M,
      tresorerie: 50 * M,
      capitauxPropres: 200 * M,
      dettesFiscalesSocialesEchues: 0,
      chiffreAffairesN1: null,
      chiffreAffairesN2: null,
      ...modif.chiffres,
    },
    retraitements: {
      remunerationDirigeantActuelle: null,
      remunerationDirigeantMarche: null,
      chargesExceptionnelles: 0,
      produitsExceptionnels: 0,
      loyerActuel: null,
      loyerMarche: null,
      ...modif.retraitements,
    },
    profil: {
      dependanceDirigeant: "oui",
      premierClientPlus30: false,
      top5ClientsPlus60: false,
      expertComptable: true,
      comptesCertifies: false,
      fiscalSocialAJour: "oui",
      contratsEcrits: "oui",
      recurrentPlus50: false,
      equipeDirection: false,
      litigeImportant: false,
      ...modif.profil,
    },
  };
}

const evaluerCas = (d: DonneesSimulation, parametres?: ParametresValorisation) =>
  evaluer(d, { anneeReference: ANNEE, parametres });

describe("Cas de référence (EBE positif, profil neutre)", () => {
  const r = evaluerCas(cas());

  it("calcule l'approche par le marché : EBE × multiple × (1 − décote de taille 5 %)", () => {
    expect(r.marche.methode).toBe("ebe");
    expect(r.marche.valeurEntreprise.bas).toBeCloseTo(150 * M * 4 * 0.95, 0);
    expect(r.marche.valeurEntreprise.central).toBeCloseTo(712.5 * M, 0);
    expect(r.marche.valeurEntreprise.haut).toBeCloseTo(150 * M * 7 * 0.95, 0);
  });

  it("calcule l'approche par le revenu (build-up, capitalisation, ± 1 point)", () => {
    expect(r.revenu.disponible).toBe(true);
    if (!r.revenu.disponible) return;
    // k = 3,61 % + 4,20 % + 3,90 % + 4 % (prime de taille 10-49) + 0 = 15,71 %
    expect(r.revenu.taux.total).toBeCloseTo(0.1571, 10);
    // Flux = (150 − 30) × 75 % = 90 M
    expect(r.revenu.fluxNormatif).toBeCloseTo(90 * M, 0);
    expect(r.revenu.valeurEntreprise.central).toBeCloseTo((90 * M * 1.03) / (0.1571 - 0.03), 0);
    expect(r.revenu.valeurEntreprise.bas).toBeCloseTo((90 * M * 1.03) / (0.1671 - 0.03), 0);
    expect(r.revenu.valeurEntreprise.haut).toBeCloseTo((90 * M * 1.03) / (0.1471 - 0.03), 0);
  });

  it("pondère 60 % marché / 40 % revenu et applique le pont de valeur", () => {
    if (!r.revenu.disponible) throw new Error("revenu attendu");
    const ve = 0.6 * 712.5 * M + 0.4 * r.revenu.valeurEntreprise.central;
    expect(r.valeurEntreprise.central).toBeCloseTo(ve, 0);
    // Titres = VE − 100 M de dettes + 50 M de trésorerie
    expect(r.pont.valeurTitres.central).toBeCloseTo(ve - 50 * M, 0);
    expect(r.valeurTitres.central).toBe(669 * M);
  });

  it("produit une fourchette ordonnée et arrondie au million", () => {
    expect(r.valeurTitres.bas).toBeLessThan(r.valeurTitres.central);
    expect(r.valeurTitres.central).toBeLessThan(r.valeurTitres.haut);
    for (const v of Object.values(r.valeurTitres)) expect(v % M).toBe(0);
  });

  it("n'affiche le multiple de CA que comme repère et n'active aucun message", () => {
    expect(r.repereCA).not.toBeNull();
    expect(r.footballField.find((b) => b.id === "repereCA")?.repere).toBe(true);
    expect(r.deficitaire).toBe(false);
    expect(r.messages).toHaveLength(0);
  });
});

describe("A. EBE retraité", () => {
  it("réintègre un sur-salaire du dirigeant, les charges exceptionnelles et un loyer excessif", () => {
    const res = calculerEBERetraite(
      { ebe: 100 * M },
      {
        remunerationDirigeantActuelle: 60 * M,
        remunerationDirigeantMarche: 36 * M,
        chargesExceptionnelles: 10 * M,
        produitsExceptionnels: 4 * M,
        loyerActuel: 24 * M,
        loyerMarche: 18 * M,
      },
    );
    // 100 + 24 + 10 − 4 + 6 = 136
    expect(res.ebeRetraite).toBe(136 * M);
    expect(res.lignes).toHaveLength(4);
  });

  it("déduit une rémunération du dirigeant inférieure au marché et un loyer sous-évalué", () => {
    const res = calculerEBERetraite(
      { ebe: 100 * M },
      {
        remunerationDirigeantActuelle: 12 * M,
        remunerationDirigeantMarche: 36 * M,
        chargesExceptionnelles: 0,
        produitsExceptionnels: 0,
        loyerActuel: 0,
        loyerMarche: 12 * M,
      },
    );
    expect(res.ebeRetraite).toBe(64 * M);
  });

  it("ignore un retraitement dont une seule des deux valeurs est saisie", () => {
    const res = calculerEBERetraite(
      { ebe: 100 * M },
      { remunerationDirigeantActuelle: 50 * M, remunerationDirigeantMarche: null, chargesExceptionnelles: 0, produitsExceptionnels: 0, loyerActuel: null, loyerMarche: 5 * M },
    );
    expect(res.ebeRetraite).toBe(100 * M);
  });

  it("utilise l'EBE retraité (et non l'EBE déclaré) dans la valorisation", () => {
    const r = evaluerCas(cas({ retraitements: { chargesExceptionnelles: 20 * M } }));
    expect(r.ebe.ebeRetraite).toBe(170 * M);
    expect(r.marche.valeurEntreprise.central).toBeCloseTo(170 * M * 5 * 0.95, 0);
  });
});

describe("EBE négatif ou nul", () => {
  const r = evaluerCas(cas({ chiffres: { ebe: -20 * M } }));

  it("utilise le multiple de CA seul, décote de taille puis −20 % en dernier", () => {
    expect(r.deficitaire).toBe(true);
    expect(r.marche.methode).toBe("ca");
    // 1 000 M × 0,8 × (1 − 5 %) × (1 − 20 %)
    expect(r.marche.valeurEntreprise.central).toBeCloseTo(1000 * M * 0.8 * 0.95 * 0.8, 0);
    expect(r.repereCA).toBeNull();
  });

  it("n'affiche pas l'approche par le revenu (100 % marché)", () => {
    expect(r.revenu.disponible).toBe(false);
    expect(r.ponderation).toEqual({ marche: 1, revenu: 0 });
  });

  it("affiche l'actif net comme repère et le message « déficitaire »", () => {
    expect(r.footballField.some((b) => b.id === "actifNet")).toBe(true);
    expect(r.messages[0]).toMatch(/déficitaire/);
  });

  it("applique la décote de −20 % hors plafond des ajustements qualitatifs", () => {
    const d = evaluerCas(
      cas({
        chiffres: { ebe: -5 * M },
        profil: { dependanceDirigeant: "non", premierClientPlus30: true, litigeImportant: true, expertComptable: false },
      }),
    );
    // Ajustements plafonnés à −35 %, puis taille (−5 %), puis −20 % : facteur total 0,65 × 0,95 × 0,8
    expect(d.ajustements.cumulMultiple).toBeCloseTo(-0.35, 10);
    expect(d.marche.multiplesEffectifs.central).toBeCloseTo(0.8 * 0.65 * 0.95 * 0.8, 10);
  });
});

describe("Approche par le revenu", () => {
  it("n'est pas affichée si le flux normatif est négatif (EBE positif mais < dotations)", () => {
    const r = evaluerCas(cas({ chiffres: { ebe: 20 * M, dotationsAmortissements: 40 * M } }));
    expect(r.deficitaire).toBe(false);
    expect(r.revenu.disponible).toBe(false);
    expect(r.ponderation.marche).toBe(1);
    expect(r.valeurEntreprise).toEqual(r.marche.valeurEntreprise);
    expect(r.messages.some((m) => m.includes("flux"))).toBe(true);
  });

  it("applique la prime de taille (revenu) et non la décote de taille, et inversement", () => {
    const petite = evaluerCas(cas({ entreprise: { effectif: "1-9" } }));
    const grande = evaluerCas(cas({ entreprise: { effectif: "250+" } }));
    // Prime de taille : 5 pts contre 3 pts
    expect(petite.revenu.taux.primeTaille).toBe(0.05);
    expect(grande.revenu.taux.primeTaille).toBe(0.03);
    // Décote de taille : −15 % contre 0 %, uniquement côté marché
    expect(petite.marche.decoteTaille).toBe(0.15);
    expect(grande.marche.decoteTaille).toBe(0);
    expect(petite.marche.valeurEntreprise.central).toBeCloseTo(150 * M * 5 * 0.85, 0);
    expect(grande.marche.valeurEntreprise.central).toBeCloseTo(150 * M * 5, 0);
  });

  it("applique la prime pays de la Côte d'Ivoire par défaut pour un autre pays non renseigné", () => {
    const r = evaluerCas(cas({ entreprise: { pays: "SN" } }));
    expect(r.primePaysParDefaut).toBe(true);
    expect(r.revenu.taux.primeRisquePays).toBe(0.039);
    expect(r.messages.some((m) => m.includes("Sénégal"))).toBe(true);
  });
});

describe("Ajustements qualitatifs", () => {
  it("plafonne le cumul défavorable à −35 % et la prime spécifique à 6 points", () => {
    const r = evaluerCas(
      cas({
        entreprise: { anneeCreation: 2025 },
        profil: {
          dependanceDirigeant: "non",
          premierClientPlus30: true,
          top5ClientsPlus60: true,
          expertComptable: false,
          fiscalSocialAJour: "non",
          contratsEcrits: "non",
          litigeImportant: true,
        },
      }),
    );
    expect(r.ajustements.cumulMultipleBrut).toBeCloseTo(-0.75, 10);
    expect(r.ajustements.cumulMultiple).toBe(-0.35);
    expect(r.ajustements.plafondAtteint).toBe("min");
    expect(r.ajustements.primeSpecifiqueBrute).toBeCloseTo(0.085, 10);
    expect(r.ajustements.primeSpecifique).toBe(0.06);
    expect(r.messages.some((m) => m.includes("−35 %"))).toBe(true);
  });

  it("plafonne le cumul favorable à +15 % et la prime spécifique à 0", () => {
    const r = evaluerCas(
      cas({
        chiffres: { chiffreAffairesN2: 700 * M },
        profil: { comptesCertifies: true, recurrentPlus50: true, equipeDirection: true },
      }),
    );
    // +5 % × 4 (certifiés, récurrent, équipe, croissance) = +20 % → plafonné à +15 %
    expect(r.ajustements.cumulMultipleBrut).toBeCloseTo(0.2, 10);
    expect(r.ajustements.cumulMultiple).toBe(0.15);
    expect(r.ajustements.plafondAtteint).toBe("max");
    // Points : −0,5 × 3 = −1,5 pt → borné à 0
    expect(r.ajustements.primeSpecifique).toBe(0);
  });

  it("pénalise une entreprise de moins de 3 ans (−10 % / +1 pt)", () => {
    const r = evaluerCas(cas({ entreprise: { anneeCreation: 2024 } }));
    expect(r.ajustements.ageEntreprise).toBe(2);
    expect(r.ajustements.cumulMultiple).toBeCloseTo(-0.1, 10);
    expect(r.ajustements.primeSpecifique).toBeCloseTo(0.01, 10);
    expect(r.pointsVigilance.some((p) => p.id === "entrepriseRecente")).toBe(true);
    // Exactement 3 ans : pas de pénalité
    expect(evaluerCas(cas({ entreprise: { anneeCreation: 2023 } })).ajustements.lignes).toHaveLength(0);
  });

  it("calcule la croissance sur 2 ans (taux composé) et pénalise une baisse > 10 %/an", () => {
    expect(calculerCroissanceAnnuelle({ chiffreAffaires: 121, chiffreAffairesN1: null, chiffreAffairesN2: 100 })).toBeCloseTo(0.1, 10);
    expect(calculerCroissanceAnnuelle({ chiffreAffaires: 110, chiffreAffairesN1: 100, chiffreAffairesN2: null })).toBeCloseTo(0.1, 10);
    expect(calculerCroissanceAnnuelle({ chiffreAffaires: 100, chiffreAffairesN1: null, chiffreAffairesN2: null })).toBeNull();
    const r = evaluerCas(cas({ chiffres: { chiffreAffairesN2: 1500 * M } }));
    expect(r.ajustements.lignes.find((l) => l.id === "croissance")?.multiple).toBe(-0.1);
  });

  it("chiffre l'effet des points forts et de vigilance (3 maximum chacun)", () => {
    const r = evaluerCas(
      cas({ profil: { dependanceDirigeant: "non", premierClientPlus30: true, recurrentPlus50: true, equipeDirection: true, litigeImportant: true } }),
    );
    expect(r.pointsForts.length).toBeLessThanOrEqual(3);
    expect(r.pointsVigilance).toHaveLength(3);
    // Le point le plus pénalisant d'abord : dépendance au dirigeant (−15 %)
    expect(r.pointsVigilance[0]?.id).toBe("dependanceDirigeant");
    expect(r.pointsVigilance[0]?.effetValeur).toBeCloseTo(-0.15 * 150 * M * 5 * 0.95, 0);
    expect(r.pointsForts[0]?.effetMultiple).toBe(0.05);
  });
});

describe("Pont de valeur, forte dette et forte trésorerie", () => {
  it("ajoute une forte trésorerie à la valeur des titres", () => {
    const base = evaluerCas(cas());
    const riche = evaluerCas(cas({ chiffres: { tresorerie: 450 * M } }));
    expect(riche.pont.valeurTitres.central - base.pont.valeurTitres.central).toBeCloseTo(400 * M, 0);
  });

  it("déduit les dettes fiscales et sociales échues", () => {
    const r = evaluerCas(cas({ chiffres: { dettesFiscalesSocialesEchues: 30 * M } }));
    expect(r.pont.autresDettes).toBe(30 * M);
    expect(r.pont.valeurTitres.central).toBeCloseTo(r.valeurEntreprise.central - 50 * M - 30 * M, 0);
  });

  it("ramène à 0 une valeur basse négative (forte dette) avec un message", () => {
    const r = evaluerCas(cas({ chiffres: { dettesFinancieres: 700 * M } }));
    expect(r.pont.valeurTitres.bas).toBeLessThan(0);
    expect(r.valeurBasseNegative).toBe(true);
    expect(r.valeurTitres.bas).toBe(0);
    expect(r.valeurTitres.haut).toBeGreaterThan(0);
    expect(r.messages.some((m) => m.includes("ramenée à 0"))).toBe(true);
  });

  it("ramène toute la fourchette à 0 si les dettes dépassent la valeur de l'activité", () => {
    const r = evaluerCas(cas({ chiffres: { dettesFinancieres: 3000 * M } }));
    expect(r.valeurTitres).toEqual({ bas: 0, central: 0, haut: 0 });
    expect(r.messages.some((m) => m.includes("dépassent la valeur de son activité"))).toBe(true);
  });
});

describe("D. Approche patrimoniale", () => {
  it("signale le plancher patrimonial quand la valeur est inférieure à l'actif net", () => {
    const r = evaluerCas(cas({ chiffres: { capitauxPropres: 900 * M } }));
    expect(r.plancherPatrimonial).toBe(true);
    expect(r.messages.some((m) => m.includes("actif net comptable"))).toBe(true);
  });

  it("ne signale rien si les capitaux propres sont négatifs", () => {
    const r = evaluerCas(cas({ chiffres: { capitauxPropres: -50 * M } }));
    expect(r.plancherPatrimonial).toBe(false);
  });
});

describe("Arrondis et formatage", () => {
  it("arrondit au million le plus proche sans produire −0", () => {
    expect(arrondir(669_499_999, M)).toBe(669 * M);
    expect(arrondir(669_500_000, M)).toBe(670 * M);
    expect(Object.is(arrondir(-400_000, M), -0)).toBe(false);
  });

  it("formate les montants en FCFA avec espaces", () => {
    expect(formaterFCFA(150_000_000)).toBe("150 000 000 FCFA");
    expect(formaterMillions(150_000_000)).toBe("150 M FCFA");
    expect(formaterMillions(1_250_000_000)).toBe("1,3 Md FCFA");
    expect(lireMontant("150 000 000")).toBe(150_000_000);
    expect(lireMontant("-2 500")).toBe(-2500);
    expect(lireMontant("12a")).toBeNull();
    expect(lireMontant("")).toBeNull();
  });
});

describe("Paramètres", () => {
  it("les paramètres en vigueur sont complets", () => {
    expect(parametresManquants(parametresEnVigueur)).toEqual([]);
  });

  it("refuse de calculer si un paramètre obligatoire est vide ([À COMPLÉTER])", () => {
    const incomplets: ParametresValorisation = {
      ...parametresEnVigueur,
      tauxSansRisque: null,
      primeRisquePays: { ...parametresEnVigueur.primeRisquePays, CI: null },
    };
    expect(parametresManquants(incomplets)).toEqual(["tauxSansRisque", "primeRisquePays.CI"]);
    expect(() => evaluerCas(cas(), incomplets)).toThrow(ParametreManquantError);
  });

  it("refuse un chiffre d'affaires nul et un secteur inconnu", () => {
    expect(() => evaluerCas(cas({ chiffres: { chiffreAffaires: 0 } }))).toThrow(RangeError);
    expect(() => evaluerCas(cas({ entreprise: { secteur: "inconnu" } }))).toThrow(RangeError);
  });
});
