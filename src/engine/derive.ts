import { ABILITY_NAMES } from '../data/abilities';
import { BACKGROUNDS } from '../data/backgrounds';
import type { Character } from '../types/character';
import type { Combatant } from '../types/character';

/** Format a copper-piece total as "X GP, Y SP, Z CP". */
export function formatCurrency(cpTotal: number): string {
  const gp = Math.floor(cpTotal / 100);
  const sp = Math.floor((cpTotal % 100) / 10);
  const cp = cpTotal % 10;
  const parts: string[] = [];
  if (gp > 0 || (gp === 0 && sp === 0 && cp === 0)) parts.push(`${gp} GP`);
  if (sp > 0) parts.push(`${sp} SP`);
  if (cp > 0) parts.push(`${cp} CP`);
  return parts.join(', ');
}

/** Initiative order comparator: init desc -> dex desc -> tie-roll history desc. */
export const compareCombatants = (a: Combatant, b: Combatant): number => {
  if (a.init !== b.init) return b.init - a.init;
  if (a.dex !== b.dex) return b.dex - a.dex;
  const maxLen = Math.max(a.tieHistory.length, b.tieHistory.length);
  for (let i = 0; i < maxLen; i++) {
    const ra = a.tieHistory[i] !== undefined ? a.tieHistory[i] : 0;
    const rb = b.tieHistory[i] !== undefined ? b.tieHistory[i] : 0;
    if (ra !== rb) return rb - ra;
  }
  return 0;
};

/** Find the first group of 2+ combatants that are fully tied (same init, dex,
 * and tie-roll history) once sorted. Returns null if no unresolved tie exists. */
export const findTieGroup = (combatants: Combatant[]): Combatant[] | null => {
  if (combatants.length < 2) return null;
  const sorted = [...combatants].sort(compareCombatants);
  let group = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (compareCombatants(sorted[i - 1], sorted[i]) === 0) {
      group.push(sorted[i]);
    } else {
      if (group.length > 1) return group;
      group = [sorted[i]];
    }
  }
  return group.length > 1 ? group : null;
};

/** Ability-score bonuses granted by the character's chosen background. */
export const computeBonuses = (character: Character): Record<string, number> => {
  const b: Record<string, number> = {};
  ABILITY_NAMES.forEach((n) => {
    b[n] = 0;
  });
  const bgAbilities = character.background ? BACKGROUNDS[character.background] : null;
  if (bgAbilities) {
    if (character.bonusType === '1-1-1') {
      bgAbilities.forEach((a) => {
        b[a] += 1;
      });
    } else {
      // "2-1"
      if (character.bonus2) b[character.bonus2] += 2;
      if (character.bonus1) b[character.bonus1] += 1;
    }
  }
  return b;
};

export interface FinalScore {
  base: number | null;
  bonus: number;
  final: number | null;
}

/** Base/bonus/final ability scores for a character. `base`/`final` are null until rolled. */
export const finalScores = (character: Character): Record<string, FinalScore> => {
  const bonuses = computeBonuses(character);
  const out: Record<string, FinalScore> = {};
  ABILITY_NAMES.forEach((n) => {
    const base = character.baseScores ? (character.baseScores[n] ?? 0) : null;
    out[n] = { base, bonus: bonuses[n], final: base == null ? null : base + bonuses[n] };
  });
  return out;
};
