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

/* ============================================================
 * General-purpose dice notation, for the standalone Dice Roller.
 * Distinct from the ability-score-specific helpers above, which are
 * fixed to d6 pools for the 4d6-keep-3 chargen mechanic.
 * ============================================================ */

/** A parsed "NdS+M" expression, e.g. "2d6+3" -> { count: 2, sides: 6, modifier: 3 }. */
export interface DiceNotation {
  count: number;
  sides: number;
  modifier: number;
}

const NOTATION_PATTERN = /^\s*(\d*)\s*d\s*(\d+)\s*([+-]\s*\d+)?\s*$/i;

/** Parse standard dice notation: "d20", "2d6", "4d6+2", "1d8-1". A bare
 * die-size with no count (e.g. "d20") is treated as a single die. Returns
 * null for anything that doesn't match — callers should treat that as an
 * invalid expression, not silently fall back to a default. */
export function parseDiceNotation(input: string): DiceNotation | null {
  const match = NOTATION_PATTERN.exec(input);
  if (!match) return null;
  const count = match[1] === '' ? 1 : parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3].replace(/\s/g, ''), 10) : 0;
  if (count < 1 || sides < 2) return null;
  return { count, sides, modifier };
}

export interface RollResult {
  notation: DiceNotation;
  rolls: number[];
  total: number;
}

/** Roll a single die of the given size (1..sides inclusive). */
export const rollDieOfSize = (sides: number): number => Math.floor(Math.random() * sides) + 1;

/** Execute a parsed dice notation: roll `count` dice of `sides`, sum them,
 * add the modifier. */
export function rollNotation(notation: DiceNotation): RollResult {
  const rolls: number[] = [];
  for (let i = 0; i < notation.count; i++) rolls.push(rollDieOfSize(notation.sides));
  const total = rolls.reduce((a, b) => a + b, 0) + notation.modifier;
  return { notation, rolls, total };
}

/** Roll a single d20 with advantage (keep higher) or disadvantage (keep
 * lower). Returns both raw rolls plus the kept result, so the UI can show
 * "rolled 14 and 7, kept 14" rather than just the final number. */
export interface D20AdvantageResult {
  rolls: [number, number];
  kept: number;
  mode: 'advantage' | 'disadvantage';
}

export function rollD20WithAdvantage(mode: 'advantage' | 'disadvantage'): D20AdvantageResult {
  const rolls: [number, number] = [rollD20(), rollD20()];
  const kept = mode === 'advantage' ? Math.max(...rolls) : Math.min(...rolls);
  return { rolls, kept, mode };
}
