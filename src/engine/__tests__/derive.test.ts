import { describe, it, expect } from 'vitest';
import { formatCurrency, compareCombatants, findTieGroup, computeBonuses, finalScores } from '../derive';
import { makeCharacter, makeCombatant } from '../../test/factories';

describe('formatCurrency', () => {
  it('formats a round GP amount', () => {
    expect(formatCurrency(1500)).toBe('15 GP');
  });

  it('formats a mix of GP, SP, and CP', () => {
    expect(formatCurrency(1234)).toBe('12 GP, 3 SP, 4 CP');
  });

  it('omits zero denominations except GP, which always shows on zero', () => {
    expect(formatCurrency(0)).toBe('0 GP');
    expect(formatCurrency(50)).toBe('5 SP'); // no GP, no CP
    expect(formatCurrency(7)).toBe('7 CP'); // no GP, no SP
  });

  it('never produces a negative-looking display for exact CP-only totals', () => {
    expect(formatCurrency(99)).toBe('9 SP, 9 CP');
  });
});

describe('compareCombatants', () => {
  it('sorts higher initiative first', () => {
    const a = makeCombatant({ init: 15 });
    const b = makeCombatant({ init: 20 });
    expect(compareCombatants(a, b)).toBeGreaterThan(0); // b should sort before a
  });

  it('falls back to dexterity when initiative is tied', () => {
    const a = makeCombatant({ init: 10, dex: 14 });
    const b = makeCombatant({ init: 10, dex: 18 });
    expect(compareCombatants(a, b)).toBeGreaterThan(0); // b (higher dex) sorts first
  });

  it('falls back to tie-roll history when init and dex are both tied', () => {
    const a = makeCombatant({ init: 10, dex: 14, tieHistory: [12] });
    const b = makeCombatant({ init: 10, dex: 14, tieHistory: [18] });
    expect(compareCombatants(a, b)).toBeGreaterThan(0); // b's higher tie roll sorts first
  });

  it('returns 0 when every tiebreaker is exhausted and still equal', () => {
    const a = makeCombatant({ init: 10, dex: 14, tieHistory: [12] });
    const b = makeCombatant({ init: 10, dex: 14, tieHistory: [12] });
    expect(compareCombatants(a, b)).toBe(0);
  });

  it('treats a missing tie-roll entry as 0, not as automatically losing', () => {
    // a has one prior tie roll of 5; b has none yet (shorter history).
    // a's roll (5) beats b's implicit 0, so a should sort first.
    const a = makeCombatant({ init: 10, dex: 14, tieHistory: [5] });
    const b = makeCombatant({ init: 10, dex: 14, tieHistory: [] });
    expect(compareCombatants(a, b)).toBeLessThan(0);
  });
});

describe('findTieGroup', () => {
  it('returns null when there are fewer than 2 combatants', () => {
    expect(findTieGroup([])).toBeNull();
    expect(findTieGroup([makeCombatant()])).toBeNull();
  });

  it('returns null when no combatants are tied', () => {
    const list = [makeCombatant({ init: 20 }), makeCombatant({ init: 15 }), makeCombatant({ init: 10 })];
    expect(findTieGroup(list)).toBeNull();
  });

  it('finds a tied pair among otherwise-distinct combatants', () => {
    const tiedA = makeCombatant({ name: 'A', init: 10, dex: 14 });
    const tiedB = makeCombatant({ name: 'B', init: 10, dex: 14 });
    const distinct = makeCombatant({ name: 'C', init: 20, dex: 10 });
    const group = findTieGroup([distinct, tiedA, tiedB]);
    expect(group).not.toBeNull();
    expect(group!.map((c) => c.name).sort()).toEqual(['A', 'B']);
  });

  it('finds a tied group of 3+', () => {
    const list = [
      makeCombatant({ name: 'A', init: 10, dex: 14 }),
      makeCombatant({ name: 'B', init: 10, dex: 14 }),
      makeCombatant({ name: 'C', init: 10, dex: 14 }),
    ];
    expect(findTieGroup(list)).toHaveLength(3);
  });

  it('does not flag a single combatant as tied with itself', () => {
    const list = [makeCombatant({ init: 10, dex: 14 }), makeCombatant({ init: 5, dex: 8 })];
    expect(findTieGroup(list)).toBeNull();
  });
});

describe('computeBonuses', () => {
  it('returns all-zero bonuses when no background is set', () => {
    const c = makeCharacter({ background: '' });
    const bonuses = computeBonuses(c);
    expect(Object.values(bonuses).every((v) => v === 0)).toBe(true);
  });

  it('applies +1 to all three background abilities in 1-1-1 mode', () => {
    const c = makeCharacter({ background: 'Sage', bonusType: '1-1-1' });
    const bonuses = computeBonuses(c);
    // Sage grants Constitution, Intelligence, Wisdom
    expect(bonuses.Constitution).toBe(1);
    expect(bonuses.Intelligence).toBe(1);
    expect(bonuses.Wisdom).toBe(1);
    expect(bonuses.Strength).toBe(0);
  });

  it('applies +2/+1 split in 2-1 mode according to bonus2/bonus1', () => {
    const c = makeCharacter({
      background: 'Sage',
      bonusType: '2-1',
      bonus2: 'Intelligence',
      bonus1: 'Wisdom',
    });
    const bonuses = computeBonuses(c);
    expect(bonuses.Intelligence).toBe(2);
    expect(bonuses.Wisdom).toBe(1);
    expect(bonuses.Constitution).toBe(0);
  });
});

describe('finalScores', () => {
  it('reports null base/final for every ability before scores are rolled', () => {
    const c = makeCharacter({ baseScores: null });
    const scores = finalScores(c);
    expect(scores.Strength.base).toBeNull();
    expect(scores.Strength.final).toBeNull();
  });

  it('combines rolled base score with background bonus once rolled', () => {
    const c = makeCharacter({
      background: 'Sage',
      bonusType: '2-1',
      bonus2: 'Intelligence',
      bonus1: 'Wisdom',
      baseScores: { Strength: 10, Intelligence: 14, Wisdom: 12, Constitution: 8, Dexterity: 10, Charisma: 10 },
    });
    const scores = finalScores(c);
    expect(scores.Intelligence).toEqual({ base: 14, bonus: 2, final: 16 });
    expect(scores.Wisdom).toEqual({ base: 12, bonus: 1, final: 13 });
    expect(scores.Strength).toEqual({ base: 10, bonus: 0, final: 10 });
  });
});
