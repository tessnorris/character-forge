import { describe, it, expect } from 'vitest';
import { CLASSES_DATA } from '../classes';
import { BACKGROUNDS_DATA, BACKGROUNDS_BY_NAME, BACKGROUNDS } from '../backgrounds';
import { SKILLS, SKILL_NAMES } from '../skills';
import { FEATS, FEAT_NAMES } from '../feats';
import { ABILITIES } from '../abilities';

const ABILITY_IDS = ABILITIES.map((a) => a.id);

describe('skills catalog', () => {
  it('has exactly the 18 standard D&D skills, no duplicates', () => {
    expect(SKILLS).toHaveLength(18);
    expect(new Set(SKILL_NAMES).size).toBe(18);
  });

  it('every skill is tied to one of the six valid abilities', () => {
    SKILLS.forEach((s) => {
      expect(ABILITY_IDS).toContain(s.ability);
    });
  });
});

describe('CLASSES_DATA', () => {
  it('has all 12 core classes', () => {
    expect(CLASSES_DATA).toHaveLength(12);
  });

  it('every class grants exactly two distinct save proficiencies', () => {
    CLASSES_DATA.forEach((c) => {
      expect(c.saves).toHaveLength(2);
      expect(c.saves[0]).not.toBe(c.saves[1]);
      c.saves.forEach((s) => expect(ABILITY_IDS).toContain(s));
    });
  });

  it('every fixed-list skillChoices option is a real skill name', () => {
    CLASSES_DATA.forEach((c) => {
      if (c.skillChoices.options === 'any') return;
      c.skillChoices.options.forEach((opt) => {
        expect(SKILL_NAMES).toContain(opt);
      });
    });
  });

  it('skillChoices.options has no duplicate entries within a class', () => {
    CLASSES_DATA.forEach((c) => {
      if (c.skillChoices.options === 'any') return;
      const opts = c.skillChoices.options;
      expect(new Set(opts).size).toBe(opts.length);
    });
  });

  it("a class's skill choice count never exceeds its own options list size", () => {
    CLASSES_DATA.forEach((c) => {
      if (c.skillChoices.options === 'any') return;
      expect(c.skillChoices.count).toBeLessThanOrEqual(c.skillChoices.options.length);
    });
  });

  // Spot-check the three classes whose 2024 rules deviate from "choose 2",
  // since that variance was the whole point of researching real per-class
  // data instead of assuming a flat count.
  it('Bard chooses 3 from any skill (no restricted list)', () => {
    const bard = CLASSES_DATA.find((c) => c.name === 'Bard')!;
    expect(bard.skillChoices).toEqual({ count: 3, options: 'any' });
  });

  it('Ranger chooses 3 skills', () => {
    const ranger = CLASSES_DATA.find((c) => c.name === 'Ranger')!;
    expect(ranger.skillChoices.count).toBe(3);
  });

  it('Rogue chooses 4 skills', () => {
    const rogue = CLASSES_DATA.find((c) => c.name === 'Rogue')!;
    expect(rogue.skillChoices.count).toBe(4);
  });

  it('every other class chooses exactly 2 skills', () => {
    const flatTwo = CLASSES_DATA.filter((c) => !['Bard', 'Ranger', 'Rogue'].includes(c.name));
    expect(flatTwo).toHaveLength(9);
    flatTwo.forEach((c) => expect(c.skillChoices.count).toBe(2));
  });
});

describe('BACKGROUNDS_DATA', () => {
  it('has all 16 2024 PHB backgrounds', () => {
    expect(BACKGROUNDS_DATA).toHaveLength(16);
  });

  it('every background grants exactly two distinct fixed skills, both real skill names', () => {
    BACKGROUNDS_DATA.forEach((b) => {
      expect(b.skills).toHaveLength(2);
      expect(b.skills[0]).not.toBe(b.skills[1]);
      b.skills.forEach((s) => expect(SKILL_NAMES).toContain(s));
    });
  });

  it('every background grants a feat that exists in the feats catalog', () => {
    BACKGROUNDS_DATA.forEach((b) => {
      // "Magic Initiate (Cleric)" etc. — strip the parenthetical to match
      // the catalog's base "Magic Initiate" entry.
      const baseName = b.feat.replace(/\s*\(.+\)$/, '');
      expect(FEAT_NAMES).toContain(baseName);
    });
  });

  it('every background lists three distinct ability names', () => {
    BACKGROUNDS_DATA.forEach((b) => {
      expect(new Set(b.abilities).size).toBe(3);
    });
  });

  it('every background has a non-empty tool proficiency and equipment package', () => {
    BACKGROUNDS_DATA.forEach((b) => {
      expect(b.tool.length).toBeGreaterThan(0);
      expect(b.equipment.desc.length).toBeGreaterThan(0);
      expect(b.equipment.id).toBe('A');
    });
  });

  it('includes Guide, previously missing from the data file', () => {
    expect(BACKGROUNDS_BY_NAME['Guide']).toBeDefined();
    expect(BACKGROUNDS_BY_NAME['Guide'].skills).toEqual(['Stealth', 'Survival']);
  });

  it('BACKGROUNDS (legacy ability-triple lookup) stays in sync with BACKGROUNDS_DATA', () => {
    // Back-compat export used by Step2Background/derive.ts — must mirror
    // the full record's ability triples exactly, not drift independently.
    BACKGROUNDS_DATA.forEach((b) => {
      expect(BACKGROUNDS[b.name]).toEqual(b.abilities);
    });
    expect(Object.keys(BACKGROUNDS)).toHaveLength(16);
  });
});

describe('FEATS', () => {
  it('has exactly the 10 Origin feats referenced by background data', () => {
    expect(FEATS).toHaveLength(10);
    expect(new Set(FEAT_NAMES).size).toBe(10);
  });

  it('every feat has a non-empty description', () => {
    FEATS.forEach((f) => expect(f.description.length).toBeGreaterThan(0));
  });
});
