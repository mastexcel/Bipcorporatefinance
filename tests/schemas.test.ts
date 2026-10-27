import { describe, expect, it } from "vitest";
import { erreursParChamp } from "@/lib/schemas/commun";
import { contactSchema } from "@/lib/schemas/formulaires";
import { chiffresSchema, retraitementsSchema } from "@/lib/schemas/simulation";

const chiffres = {
  chiffreAffaires: 1_000_000_000,
  ebe: 150_000_000,
  dotationsAmortissements: 0,
  dettesFinancieres: 0,
  tresorerie: 0,
  capitauxPropres: 0,
  dettesFiscalesSocialesEchues: 0,
  chiffreAffairesN1: null,
  chiffreAffairesN2: null,
};

describe("Validation du simulateur", () => {
  it("accepte des chiffres cohérents, y compris un EBE négatif", () => {
    expect(chiffresSchema.safeParse(chiffres).success).toBe(true);
    expect(chiffresSchema.safeParse({ ...chiffres, ebe: -5_000_000 }).success).toBe(true);
  });

  it("refuse un EBE supérieur au CA", () => {
    const r = chiffresSchema.safeParse({ ...chiffres, ebe: 2_000_000_000 });
    expect(r.success).toBe(false);
    if (!r.success) expect(erreursParChamp(r.error).ebe).toMatch(/supérieur au chiffre d'affaires/);
  });

  it("refuse un CA manquant ou nul et des montants négatifs", () => {
    const r = chiffresSchema.safeParse({ ...chiffres, chiffreAffaires: null, dettesFinancieres: -1 });
    expect(r.success).toBe(false);
    if (!r.success) {
      const e = erreursParChamp(r.error);
      expect(e.chiffreAffaires).toBeDefined();
      expect(e.dettesFinancieres).toMatch(/positif/);
    }
    expect(chiffresSchema.safeParse({ ...chiffres, chiffreAffaires: 0 }).success).toBe(false);
  });

  it("exige les deux valeurs d'un retraitement de rémunération", () => {
    const r = retraitementsSchema.safeParse({
      remunerationDirigeantActuelle: 10,
      remunerationDirigeantMarche: null,
      chargesExceptionnelles: 0,
      produitsExceptionnels: 0,
      loyerActuel: null,
      loyerMarche: null,
    });
    expect(r.success).toBe(false);
  });
});

describe("Validation du formulaire de contact", () => {
  const base = {
    nom: "Awa Koné",
    fonction: "Directrice générale",
    entreprise: "Exemple SARL",
    indicatif: "+225",
    telephone: "07 00 00 00 00",
    email: "Awa@Exemple.ci",
    typeProjet: "ceder",
    horizon: "6a24mois",
    consentement: true,
  };

  it("normalise le téléphone et l'e-mail", () => {
    const r = contactSchema.parse(base);
    expect(r.telephone).toBe("0700000000");
    expect(r.email).toBe("awa@exemple.ci");
  });

  it("refuse l'absence de consentement (case non cochée)", () => {
    const r = contactSchema.safeParse({ ...base, consentement: false });
    expect(r.success).toBe(false);
    if (!r.success) expect(erreursParChamp(r.error).consentement).toMatch(/accord/);
  });
});
