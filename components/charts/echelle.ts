/** Graduations « rondes » pour un axe allant de 0 à `max`. */
export function graduations(max: number, cible = 4): number[] {
  if (!(max > 0)) return [0];
  const brut = max / cible;
  const puissance = 10 ** Math.floor(Math.log10(brut));
  const pas = [1, 2, 2.5, 5, 10].map((m) => m * puissance).find((p) => p >= brut) ?? brut;
  const ticks: number[] = [];
  for (let v = 0; v <= max + pas * 0.001; v += pas) ticks.push(v);
  if ((ticks.at(-1) ?? 0) < max) ticks.push((ticks.at(-1) ?? 0) + pas);
  return ticks;
}
