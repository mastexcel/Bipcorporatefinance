/**
 * C. Approche par le revenu — capitalisation du flux de trésorerie normatif.
 *
 *   Résultat d'exploitation = EBE retraité − dotations aux amortissements
 *   Flux normatif = résultat d'exploitation × (1 − IS) + dotations
 *                   − investissements de maintien (= dotations par défaut)
 *                 ≈ résultat d'exploitation après impôt
 *
 *   Taux (coût des fonds propres, empilement « build-up ») =
 *       taux sans risque (Bund 10 ans, cohérent avec l'arrimage FCFA/euro)
 *     + prime de risque du marché mature
 *     + prime de risque pays
 *     + prime de taille PME        ← la taille est prise en compte ICI
 *     + prime de risque spécifique (profil qualitatif, 0 à 6 points)
 *
 *   Valeur d'entreprise = flux × (1 + g) / (taux − g)
 *   Fourchette : taux ± 1 point (taux + 1 pt → valeur basse).
 *
 * Pas de décote de taille ni de décote d'illiquidité sur cette approche : la
 * prime de taille et la prime spécifique en tiennent déjà compte (pas de
 * double comptage).
 */
import type { CodePays, TrancheEffectif } from "@/config/valuation";
import type { DetailTaux, ParametresValorisation, ResultatRevenu } from "./types";

export function calculerApprocheRevenu(args: {
  ebeRetraite: number;
  dotations: number;
  /** Investissements de maintien ; par défaut égaux aux dotations. */
  investissementsMaintien?: number;
  pays: CodePays;
  effectif: TrancheEffectif;
  primeSpecifique: number;
  p: ParametresValorisation;
}): ResultatRevenu & { primePaysParDefaut: boolean } {
  const { ebeRetraite, dotations, pays, effectif, primeSpecifique, p } = args;
  const investissementsMaintien = args.investissementsMaintien ?? dotations;

  // Paramètres obligatoires : vérifiés en amont (verifierParametres).
  const tauxSansRisque = p.tauxSansRisque ?? 0;
  const primeMarcheMature = p.primeMarcheMature ?? 0;
  const impotTaux = p.tauxImpotSocietes ?? 0;
  const g = p.croissanceLongTerme ?? 0;

  // Prime pays : à défaut de valeur pour le pays choisi, on retient celle de
  // la Côte d'Ivoire (avertissement affiché à l'utilisateur).
  const primePaysPropre = p.primeRisquePays[pays];
  const primePaysParDefaut = primePaysPropre === null;
  const primeRisquePays = primePaysPropre ?? p.primeRisquePays.CI ?? 0;

  const primeTaille = p.primeTaille[effectif];
  const taux: DetailTaux = {
    tauxSansRisque,
    primeMarcheMature,
    primeRisquePays,
    primeTaille,
    primeSpecifique,
    total: tauxSansRisque + primeMarcheMature + primeRisquePays + primeTaille + primeSpecifique,
  };

  const resultatExploitation = ebeRetraite - dotations;
  // Pas d'économie d'impôt modélisée sur un résultat négatif (prudence).
  const impot = Math.max(0, resultatExploitation) * impotTaux;
  const fluxNormatif = resultatExploitation - impot + dotations - investissementsMaintien;

  if (fluxNormatif <= 0) {
    return {
      disponible: false,
      raison: "Le flux de trésorerie normatif est nul ou négatif : l'approche par le revenu n'est pas applicable.",
      fluxNormatif,
      taux,
      primePaysParDefaut,
    };
  }

  const ecart = p.ecartTauxFourchette;
  const tauxFourchette = { bas: taux.total + ecart, central: taux.total, haut: taux.total - ecart };
  if (tauxFourchette.haut - g < p.ecartMinimalTauxCroissance) {
    return {
      disponible: false,
      raison: "Le taux d'actualisation est trop proche du taux de croissance : paramètres incohérents.",
      fluxNormatif,
      taux,
      primePaysParDefaut,
    };
  }

  const capitaliser = (k: number) => (fluxNormatif * (1 + g)) / (k - g);
  return {
    disponible: true,
    fluxNormatif,
    resultatExploitation,
    impot,
    investissementsMaintien,
    croissance: g,
    taux,
    tauxFourchette,
    valeurEntreprise: {
      bas: capitaliser(tauxFourchette.bas),
      central: capitaliser(tauxFourchette.central),
      haut: capitaliser(tauxFourchette.haut),
    },
    primePaysParDefaut,
  };
}
