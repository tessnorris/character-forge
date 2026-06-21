import { describe, it, expect } from 'vitest';
import { NAMES, suggestName, hasNames } from '../names';
import { SPECIES } from '../species';
import type { Gender } from '../../types/character';

const GENDERS: Gender[] = ['male', 'nonbinary', 'female'];

describe('names data', () => {
  it('has an entry for every built-in species', () => {
    for (const species of SPECIES) {
      expect(NAMES[species], `missing names for ${species}`).toBeDefined();
    }
  });

  it('provides at least 10 first names per gender for each species', () => {
    for (const [species, entry] of Object.entries(NAMES)) {
      for (const gender of GENDERS) {
        expect(entry.first[gender].length, `${species}/${gender}`).toBeGreaterThanOrEqual(10);
      }
    }
  });

  it('provides at least 20 surnames per species', () => {
    for (const [species, entry] of Object.entries(NAMES)) {
      expect(entry.last.length, species).toBeGreaterThanOrEqual(20);
    }
  });

  it('has no empty strings and no duplicates within any list', () => {
    for (const [species, entry] of Object.entries(NAMES)) {
      const lists: [string, string[]][] = [
        ...GENDERS.map((g) => [`${species}/${g}`, entry.first[g]] as [string, string[]]),
        [`${species}/last`, entry.last],
      ];
      for (const [label, list] of lists) {
        expect(list.every((n) => n.trim().length > 0), `empty name in ${label}`).toBe(true);
        expect(new Set(list).size, `duplicate in ${label}`).toBe(list.length);
      }
    }
  });
});

describe('suggestName', () => {
  it('returns a "First Last" name drawn from the requested species and gender', () => {
    const entry = NAMES.Elf;
    for (let i = 0; i < 50; i++) {
      const name = suggestName('Elf', 'female');
      expect(name).not.toBeNull();
      const [first, ...rest] = name!.split(' ');
      const last = rest.join(' ');
      expect(entry.first.female).toContain(first);
      expect(entry.last).toContain(last);
    }
  });

  it('draws from all gender pools when no gender is given', () => {
    const entry = NAMES.Dwarf;
    const allFirst = [...entry.first.male, ...entry.first.nonbinary, ...entry.first.female];
    for (let i = 0; i < 50; i++) {
      const name = suggestName('Dwarf');
      const first = name!.split(' ')[0];
      expect(allFirst).toContain(first);
    }
  });

  it('returns null for a species with no name data', () => {
    expect(suggestName('Warforged', 'male')).toBeNull();
    expect(hasNames('Warforged')).toBe(false);
  });
});
