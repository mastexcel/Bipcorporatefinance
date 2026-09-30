/**
 * Formatage des montants en FCFA (espace comme séparateur de milliers).
 * On utilise une espace simple (et non l'espace fine insécable d'Intl) pour un
 * rendu identique partout, y compris dans les e-mails.
 */

/** Sépare les milliers par une espace : 150000000 → « 150 000 000 ». */
export function separerMilliers(n: number): string {
  const signe = n < 0 ? "−" : "";
  const entier = Math.round(Math.abs(n)).toString();
  return signe + entier.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** « 150 000 000 FCFA » */
export function formaterFCFA(n: number): string {
  return `${separerMilliers(n)} FCFA`;
}

/** Format court pour les graphiques : « 150 M FCFA », « 1,2 Md FCFA ». */
export function formaterMillions(n: number): string {
  const signe = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1e9) {
    const md = abs / 1e9;
    const texte = md >= 10 ? Math.round(md).toString() : md.toFixed(1).replace(".", ",").replace(",0", "");
    return `${signe}${texte} Md FCFA`;
  }
  return `${signe}${separerMilliers(Math.round(abs / 1e6))} M FCFA`;
}

/** Pourcentage français : 0.0361 → « 3,61 % ». */
export function formaterPourcentage(x: number, decimales = 1): string {
  const signe = x < 0 ? "−" : "";
  const texte = (Math.abs(x) * 100).toFixed(decimales).replace(".", ",");
  return `${signe}${texte} %`;
}

/** Ajustement signé : 0.05 → « +5 % », -0.15 → « −15 % ». */
export function formaterAjustement(x: number): string {
  if (x === 0) return "0 %";
  const signe = x > 0 ? "+" : "−";
  const valeur = Math.abs(x * 100);
  const texte = Number.isInteger(Math.round(valeur * 10) / 10)
    ? Math.round(valeur).toString()
    : valeur.toFixed(1).replace(".", ",");
  return `${signe}${texte} %`;
}

/** Points de prime : 0.015 → « +1,5 pt ». */
export function formaterPoints(x: number): string {
  if (x === 0) return "0 pt";
  const signe = x > 0 ? "+" : "−";
  const valeur = Math.abs(x * 100);
  const texte = Number.isInteger(valeur) ? valeur.toString() : valeur.toFixed(1).replace(".", ",");
  return `${signe}${texte} pt${valeur > 1 ? "s" : ""}`;
}

/**
 * Lit une saisie utilisateur (« 150 000 000 », « -2 500 000 ») et renvoie un
 * nombre, ou null si le champ est vide ou invalide.
 */
export function lireMontant(saisie: string): number | null {
  const nettoye = saisie.replace(/[\s  ]/g, "").replace(/[−–]/g, "-");
  if (nettoye === "" || nettoye === "-") return null;
  if (!/^-?\d+$/.test(nettoye)) return null;
  return Number(nettoye);
}
