import { describe, it, expect } from 'vitest';
import { SPECIES_DATA, SPECIES, SPECIES_BY_NAME } from '../species';
import { FEAT_NAMES } from '../feats';
import { SKILL_NAMES } from '../skills';

const ABILITY_IDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

describe('SPECIES_DATA', () => {
  it('has all 10 species', () => {
    expect(SPECIES_DATA).toHaveLength(10);
    expect(new Set(SPECIES)).toEqual(
      new Set(['Aasimar', 'Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goliath', 'Halfling', 'Human', 'Orc', 'Tiefling']),
    );
  });

  it('Aasimar, Dwarf, Halfling, and Orc have no level-1 choices', () => {
    ['Aasimar', 'Dwarf', 'Halfling', 'Orc'].forEach((name) => {
      expect(SPECIES_BY_NAME[name].speciesFeatures1).toBeUndefined();
    });
  });

  describe('ancestry-choice species (Dragonborn, Goliath)', () => {
    it('Dragonborn has exactly 10 Draconic Ancestry options, each with a non-empty description', () => {
      const dragonborn = SPECIES_BY_NAME['Dragonborn'];
      const ancestry = dragonborn.speciesFeatures1?.ancestry;
      expect(ancestry?.label).toBe('Draconic Ancestry');
      expect(ancestry?.options).toHaveLength(10);
      expect(new Set(ancestry?.options.map((o) => o.name)).size).toBe(10);
      ancestry?.options.forEach((o) => expect(o.description.length).toBeGreaterThan(0));
    });

    it('Goliath has exactly 6 Giant Ancestry options, each with a non-empty description', () => {
      const goliath = SPECIES_BY_NAME['Goliath'];
      const ancestry = goliath.speciesFeatures1?.ancestry;
      expect(ancestry?.label).toBe('Giant Ancestry');
      expect(ancestry?.options).toHaveLength(6);
      expect(new Set(ancestry?.options.map((o) => o.name)).size).toBe(6);
      ancestry?.options.forEach((o) => expect(o.description.length).toBeGreaterThan(0));
    });

    it('Dragonborn and Goliath have no lineage, bonus skill, or bonus feat', () => {
      ['Dragonborn', 'Goliath'].forEach((name) => {
        const features = SPECIES_BY_NAME[name].speciesFeatures1;
        expect(features?.lineage).toBeUndefined();
        expect(features?.bonusSkillOptions).toBeUndefined();
        expect(features?.bonusFeat).toBeUndefined();
      });
    });
  });

  describe('lineage-choice species (Elf, Gnome, Tiefling)', () => {
    it('each lineage species offers int/wis/cha as spellcasting ability options', () => {
      ['Elf', 'Gnome', 'Tiefling'].forEach((name) => {
        const lineage = SPECIES_BY_NAME[name].speciesFeatures1?.lineage;
        expect(lineage?.spellcastingAbilityOptions).toEqual(['int', 'wis', 'cha']);
        lineage?.spellcastingAbilityOptions.forEach((a) => expect(ABILITY_IDS).toContain(a));
      });
    });

    it('every lineage option has a non-empty trait description and at least a level-1 grant', () => {
      ['Elf', 'Gnome', 'Tiefling'].forEach((name) => {
        const lineage = SPECIES_BY_NAME[name].speciesFeatures1!.lineage!;
        lineage.options.forEach((opt) => {
          expect(opt.traitDescription.length).toBeGreaterThan(0);
          expect(opt.grants.length).toBeGreaterThanOrEqual(1);
          expect(opt.grants[0].level).toBe(1);
          opt.grants.forEach((g) => {
            expect(g.name.length).toBeGreaterThan(0);
            expect([1, 3, 5]).toContain(g.level);
          });
        });
      });
    });

    it('Elf has exactly 3 lineage options (Drow, High Elf, Wood Elf), each with level 1/3/5 grants', () => {
      const lineage = SPECIES_BY_NAME['Elf'].speciesFeatures1!.lineage!;
      expect(lineage.options.map((o) => o.name)).toEqual(['Drow', 'High Elf', 'Wood Elf']);
      lineage.options.forEach((o) => {
        expect(o.grants.map((g) => g.level)).toEqual([1, 3, 5]);
      });
    });

    it('Tiefling has exactly 3 lineage options (Abyssal, Chthonic, Infernal), each with level 1/3/5 grants', () => {
      const lineage = SPECIES_BY_NAME['Tiefling'].speciesFeatures1!.lineage!;
      expect(lineage.options.map((o) => o.name)).toEqual(['Abyssal', 'Chthonic', 'Infernal']);
      lineage.options.forEach((o) => {
        expect(o.grants.map((g) => g.level)).toEqual([1, 3, 5]);
      });
    });

    it('Gnome has exactly 2 lineage options (Forest Gnome, Rock Gnome), each with only a level-1 grant', () => {
      const lineage = SPECIES_BY_NAME['Gnome'].speciesFeatures1!.lineage!;
      expect(lineage.options.map((o) => o.name)).toEqual(['Forest Gnome', 'Rock Gnome']);
      lineage.options.forEach((o) => {
        expect(o.grants.map((g) => g.level)).toEqual([1]);
      });
    });

    it('Elf additionally offers a 3-option bonus skill choice; Gnome and Tiefling do not', () => {
      const elf = SPECIES_BY_NAME['Elf'].speciesFeatures1!;
      expect(elf.bonusSkillOptions).toEqual(['Insight', 'Perception', 'Survival']);
      (elf.bonusSkillOptions as string[]).forEach((s) => expect(SKILL_NAMES).toContain(s));

      expect(SPECIES_BY_NAME['Gnome'].speciesFeatures1?.bonusSkillOptions).toBeUndefined();
      expect(SPECIES_BY_NAME['Tiefling'].speciesFeatures1?.bonusSkillOptions).toBeUndefined();
    });
  });

  describe('Human', () => {
    it('grants a bonus skill from any skill and a bonus Origin feat, with no ancestry or lineage', () => {
      const human = SPECIES_BY_NAME['Human'].speciesFeatures1!;
      expect(human.bonusSkillOptions).toBe('any');
      expect(human.bonusFeat).toBe(true);
      expect(human.ancestry).toBeUndefined();
      expect(human.lineage).toBeUndefined();
    });
  });

  it('every lineage cantrip/spell name referenced is non-empty and distinct within its option', () => {
    ['Elf', 'Gnome', 'Tiefling'].forEach((name) => {
      const lineage = SPECIES_BY_NAME[name].speciesFeatures1!.lineage!;
      lineage.options.forEach((opt) => {
        const names = opt.grants.map((g) => g.name);
        expect(new Set(names).size).toBe(names.length);
      });
    });
  });

  it('FEAT_NAMES still contains Skilled (sanity check that Human bonus-feat picker has somewhere to draw from)', () => {
    expect(FEAT_NAMES).toContain('Skilled');
  });
});
