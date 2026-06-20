/** Dice and randomness primitives. Pure functions — no React, no DOM. */

export const uid = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Math.random().toString(36).slice(2, 11);

export const getMod = (score: number): number => Math.floor((score - 10) / 2);

export const fmtMod = (mod: number): string => (mod >= 0 ? `+${mod}` : `${mod}`);

export const rollD20 = (): number => Math.floor(Math.random() * 20) + 1;

/** Roll a single d6, rerolling any result at or below `rerollThreshold`. */
export const rollDie = (rerollThreshold: number): number => {
  let val: number;
  let attempts = 0;
  do {
    val = Math.floor(Math.random() * 6) + 1;
    attempts++;
  } while (val <= rerollThreshold && attempts < 50);
  return val;
};

export interface GeneratedScoreRoll {
  sum: number;
  rolls: number[];
  kept: number[];
}

/** Roll `numDice` d6 (with optional reroll threshold) and keep the highest 3. */
export const generateAbilityScore = (numDice: number, rerollThreshold: number): GeneratedScoreRoll => {
  const rolls: number[] = [];
  for (let i = 0; i < numDice; i++) rolls.push(rollDie(rerollThreshold));
  const kept = [...rolls].sort((a, b) => b - a).slice(0, 3);
  return { sum: kept.reduce((a, b) => a + b, 0), rolls, kept };
};
