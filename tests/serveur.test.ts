import { describe, expect, it } from "vitest";
import { AVERTISSEMENT_SIMULATEUR } from "@/config/valuation";
import { emailContact, emailSimulationVisiteur } from "@/lib/email/modeles";
import { limiteAtteinte, reinitialiserLimites } from "@/lib/security/rateLimit";
import { contactSchema, leadSimulationSchema } from "@/lib/schemas/formulaires";
import { evaluer } from "@/lib/valuation";

const contact = contactSchema.parse({
  nom: "<script>alert(1)</script>",
  fonction: "DG",
  entreprise: "Test & Fils",
  indicatif: "+225",
  telephone: "0700000000",
  email: "a@b.ci",
  typeProjet: "ceder",
  horizon: "plus2ans",
  message: "Bonjour <b>BIP</b>",
  consentement: true,
});

describe("Modèles d'e-mail", () => {
  it("échappe le HTML saisi par l'utilisateur", () => {
    const e = emailContact(contact, ["bip@exemple.ci"]);
    expect(e.html).not.toContain("<script>");
    expect(e.html).toContain("&lt;script&gt;");
    expect(e.html).toContain("Test &amp; Fils");
    expect(e.repondreA).toBe("a@b.ci");
  });

  it("inclut la fourchette et l'avertissement dans la synthèse envoyée au visiteur", () => {
    const lead = leadSimulationSchema.parse({
      ...contact,
      nom: "Awa",
      donnees: {
        entreprise: { secteur: "services", pays: "CI", anneeCreation: 2012, effectif: "10-49", formeJuridique: "SARL" },
        chiffres: { chiffreAffaires: 1e9, ebe: 1.5e8, dotationsAmortissements: 3e7, dettesFinancieres: 1e8, tresorerie: 5e7, capitauxPropres: 2e8, dettesFiscalesSocialesEchues: 0, chiffreAffairesN1: null, chiffreAffairesN2: null },
        retraitements: { remunerationDirigeantActuelle: null, remunerationDirigeantMarche: null, chargesExceptionnelles: 0, produitsExceptionnels: 0, loyerActuel: null, loyerMarche: null },
        profil: { dependanceDirigeant: "oui", premierClientPlus30: false, top5ClientsPlus60: false, expertComptable: true, comptesCertifies: false, fiscalSocialAJour: "oui", contratsEcrits: "oui", recurrentPlus50: false, equipeDirection: false, litigeImportant: false },
      },
    });
    const r = evaluer(lead.donnees, { anneeReference: 2026 });
    const e = emailSimulationVisiteur(lead, r);
    expect(e.a).toBe("a@b.ci");
    expect(e.texte).toContain("669 000 000 FCFA");
    expect(e.texte).toContain(AVERTISSEMENT_SIMULATEUR);
  });
});

describe("Limitation des envois par IP", () => {
  it("bloque au-delà du maximum dans la fenêtre, puis libère", () => {
    reinitialiserLimites();
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) expect(limiteAtteinte("ip", 5, 60_000, t0 + i)).toBe(false);
    expect(limiteAtteinte("ip", 5, 60_000, t0 + 10)).toBe(true);
    expect(limiteAtteinte("autre-ip", 5, 60_000, t0 + 10)).toBe(false);
    expect(limiteAtteinte("ip", 5, 60_000, t0 + 61_000)).toBe(false);
  });
});
