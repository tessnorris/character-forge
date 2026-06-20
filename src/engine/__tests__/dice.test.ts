import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getMod,
  fmtMod,
  rollD20,
  rollDie,
  generateAbilityScore,
  uid,
  parseDiceNotation,
  rollNotation,
  rollDieOfSize,
  rollD20WithAdvantage,
} from '../dice';

describe('getMod', () => {
  // The 5e ability modifier table: floor((score - 10) / 2).
  it.each([
    [1, -5],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [12, 1],
    [15, 2],
    [20, 5],
    [30, 10],
  ])('maps score %i to modifier %i', (score, expected) => {
    expect(getMod(score)).toBe(expected);
  });
});

describe('fmtMod', () => {
  it('prefixes non-negative modifiers with +', () => {
    expect(fmtMod(0)).toBe('+0');
    expect(fmtMod(3)).toBe('+3');
  });

  it('leaves negative modifiers with their existing minus sign', () => {
    expect(fmtMod(-1)).toBe('-1');
    expect(fmtMod(-5)).toBe('-5');
  });
});

describe('uid', () => {
  it('produces unique, non-empty ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uid()));
    expect(ids.size).toBe(100);
    ids.forEach((id) => expect(id.length).toBeGreaterThan(0));
  });
});

describe('randomness-based functions', () => {
  // Math.random is mocked per-test so dice outcomes are deterministic.
  // Each mockReturnValueOnce call supplies the next Math.random() result.
  let randomSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  describe('rollD20', () => {
    it('maps random()=0 to a roll of 1', () => {
      randomSpy.mockReturnValue(0);
      expect(rollD20()).toBe(1);
    });

    it('maps random() just under 1 to a roll of 20', () => {
      randomSpy.mockReturnValue(0.9999);
      expect(rollD20()).toBe(20);
    });
  });

  describe('rollDie', () => {
    it('returns a value 1-6 with no reroll threshold', () => {
      randomSpy.mockReturnValue(0); // would be a "1"
      expect(rollDie(0)).toBe(1);
    });

    it('rerolls values at or below the threshold', () => {
      // First call rolls a 2 (random=0.166..), which is <= threshold of 2,
      // so it rerolls; second call rolls a 5 (random=0.666..), which is kept.
      randomSpy.mockReturnValueOnce(1 / 6).mockReturnValueOnce(4 / 6);
      expect(rollDie(2)).toBe(5);
    });

    it('gives up after 50 attempts to avoid an infinite loop', () => {
      // Always rolls a 1, which is always <= a threshold of 5 — every
      // attempt rerolls, so this must terminate via the attempt cap
      // rather than looping forever.
      randomSpy.mockReturnValue(0);
      expect(rollDie(5)).toBe(1);
      expect(randomSpy).toHaveBeenCalledTimes(50);
    });
  });

  describe('generateAbilityScore', () => {
    it('keeps the highest 3 of 4 rolled dice and sums them', () => {
      // Dice in order: 2, 6, 1, 4 -> sorted desc: 6, 4, 2, 1 -> keep top 3: 6,4,2 = 12
      randomSpy
        .mockReturnValueOnce(1 / 6) // -> 2
        .mockReturnValueOnce(5 / 6) // -> 6
        .mockReturnValueOnce(0) // -> 1
        .mockReturnValueOnce(3 / 6); // -> 4
      const result = generateAbilityScore(4, 0);
      expect(result.rolls).toEqual([2, 6, 1, 4]);
      expect(result.kept).toEqual([6, 4, 2]);
      expect(result.sum).toBe(12);
    });

    it('keeps the raw roll order in `rolls` even though `kept` is sorted', () => {
      randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(5 / 6).mockReturnValueOnce(3 / 6);
      const result = generateAbilityScore(3, 0);
      expect(result.rolls).toEqual([1, 6, 4]);
      expect(result.kept).toEqual([6, 4, 1]);
    });
  });

  describe('rollDieOfSize', () => {
    it('maps random()=0 to a roll of 1 regardless of die size', () => {
      randomSpy.mockReturnValue(0);
      expect(rollDieOfSize(20)).toBe(1);
      expect(rollDieOfSize(4)).toBe(1);
    });

    it('maps random() just under 1 to the maximum face', () => {
      randomSpy.mockReturnValue(0.9999);
      expect(rollDieOfSize(8)).toBe(8);
    });
  });

  describe('rollNotation', () => {
    it('rolls the specified count and sides, summing plus the modifier', () => {
      // 2d6+3 with rolls of 3 and 5 -> 3 + 5 + 3 = 11
      randomSpy.mockReturnValueOnce(2 / 6).mockReturnValueOnce(4 / 6); // -> 3, 5
      const result = rollNotation({ count: 2, sides: 6, modifier: 3 });
      expect(result.rolls).toEqual([3, 5]);
      expect(result.total).toBe(11);
    });

    it('handles a single die with no modifier', () => {
      randomSpy.mockReturnValue(0.9999); // -> 20 on a d20
      const result = rollNotation({ count: 1, sides: 20, modifier: 0 });
      expect(result.rolls).toEqual([20]);
      expect(result.total).toBe(20);
    });

    it('applies a negative modifier correctly', () => {
      randomSpy.mockReturnValue(0); // -> 1
      const result = rollNotation({ count: 1, sides: 8, modifier: -2 });
      expect(result.total).toBe(-1); // 1 - 2
    });
  });

  describe('rollD20WithAdvantage', () => {
    it('keeps the higher of two rolls in advantage mode', () => {
      randomSpy.mockReturnValueOnce(0.25).mockReturnValueOnce(0.9); // -> 6, 19
      const result = rollD20WithAdvantage('advantage');
      expect(result.rolls).toEqual([6, 19]);
      expect(result.kept).toBe(19);
      expect(result.mode).toBe('advantage');
    });

    it('keeps the lower of two rolls in disadvantage mode', () => {
      randomSpy.mockReturnValueOnce(0.25).mockReturnValueOnce(0.9); // -> 6, 19
      const result = rollD20WithAdvantage('disadvantage');
      expect(result.kept).toBe(6);
      expect(result.mode).toBe('disadvantage');
    });
  });
});

describe('parseDiceNotation', () => {
  it.each([
    ['d20', { count: 1, sides: 20, modifier: 0 }],
    ['1d20', { count: 1, sides: 20, modifier: 0 }],
    ['2d6', { count: 2, sides: 6, modifier: 0 }],
    ['4d6+2', { count: 4, sides: 6, modifier: 2 }],
    ['1d8-1', { count: 1, sides: 8, modifier: -1 }],
    ['D8', { count: 1, sides: 8, modifier: 0 }], // case-insensitive
    [' 2d10 + 5 ', { count: 2, sides: 10, modifier: 5 }], // tolerates whitespace
  ])('parses %s', (input, expected) => {
    expect(parseDiceNotation(input)).toEqual(expected);
  });

  it.each([
    [''],
    ['not dice'],
    ['d'],
    ['2d'],
    ['d0'], // zero-sided die is nonsensical
    ['d1'], // technically matches the digit pattern but a 1-sided die is rejected
    ['0d6'], // zero dice
    ['2d6++3'], // malformed modifier
    ['2x6'], // wrong separator
  ])('rejects %s as null rather than guessing', (input) => {
    expect(parseDiceNotation(input)).toBeNull();
  });
});
