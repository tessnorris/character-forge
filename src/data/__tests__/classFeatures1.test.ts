import { describe, it, expect } from 'vitest';
import { CLASSES_DATA } from '../classes';
import { WEAPONS, WEAPON_NAMES, isSimple, isMartial, isMelee, isFinesseOrLight } from '../weapons';
import { FIGHTING_STYLES, FIGHTING_STYLE_NAMES } from '../fightingStyles';
import { INVOCATIONS, INVOCATION_NAMES, LEVEL_1_INVOCATIONS } from '../invocations';

const WEAPON_MASTERY_CLASSES = ['Barbarian', 'Fighter', 'Paladin', 'Ranger', 'Rogue'];

describe('WEAPONS catalog', () => {
  it('has the full 38-weapon SRD table (10 simple melee, 4 simple ranged, 18 martial melee, 6 martial ranged), no duplicates', () => {
    expect(WEAPONS).toHaveLength(38);
    expect(WEAPONS.filter((w) => w.category === 'simpleMelee')).toHaveLength(10);
    expect(WEAPONS.filter((w) => w.category === 'simpleRanged')).toHaveLength(4);
    expect(WEAPONS.filter((w) => w.category === 'martialMelee')).toHaveLength(18);
    expect(WEAPONS.filter((w) => w.category === 'martialRanged')).toHaveLength(6);
  });

  it('every weapon has a non-empty name and a valid category/mastery', () => {
    const categories = ['simpleMelee', 'simpleRanged', 'martialMelee', 'martialRanged'];
    const masteries = ['Cleave', 'Graze', 'Nick', 'Push', 'Sap', 'Slow', 'Topple', 'Vex'];
    WEAPONS.forEach((w) => {
      expect(w.name.length).toBeGreaterThan(0);
      expect(categories).toContain(w.category);
      expect(masteries).toContain(w.mastery);
    });
    expect(new Set(WEAPON_NAMES).size).toBe(WEAPONS.length);
  });

  it('isSimple/isMartial/isMelee classify weapons correctly', () => {
    const dagger = WEAPONS.find((w) => w.name === 'Dagger')!;
    expect(isSimple(dagger)).toBe(true);
    expect(isMartial(dagger)).toBe(false);
    expect(isMelee(dagger)).toBe(true);

    const longbow = WEAPONS.find((w) => w.name === 'Longbow')!;
    expect(isMartial(longbow)).toBe(true);
    expect(isMelee(longbow)).toBe(false);
  });

  it('isFinesseOrLight matches the Rogue Weapon Mastery pool correctly', () => {
    const rapier = WEAPONS.find((w) => w.name === 'Rapier')!; // Finesse
    const greataxe = WEAPONS.find((w) => w.name === 'Greataxe')!; // Heavy, Two-Handed
    expect(isFinesseOrLight(rapier)).toBe(true);
    expect(isFinesseOrLight(greataxe)).toBe(false);
  });
});

describe('FIGHTING_STYLES catalog', () => {
  it('has exactly the 10 named Fighting Styles, no duplicates', () => {
    expect(FIGHTING_STYLES).toHaveLength(10);
    expect(new Set(FIGHTING_STYLE_NAMES).size).toBe(10);
  });

  it('every Fighting Style has a non-empty description (real or placeholder)', () => {
    FIGHTING_STYLES.forEach((f) => expect(f.description.length).toBeGreaterThan(0));
  });

  it('the 4 SRD-verified styles do not carry the placeholder marker', () => {
    const verified = ['Archery', 'Defense', 'Great Weapon Fighting', 'Two-Weapon Fighting'];
    verified.forEach((name) => {
      const style = FIGHTING_STYLES.find((f) => f.name === name)!;
      expect(style.description).not.toMatch(/Placeholder/);
    });
  });
});

describe('INVOCATIONS catalog', () => {
  it('has all 28 Eldritch Invocations from the SRD, no duplicates', () => {
    expect(INVOCATIONS).toHaveLength(28);
    expect(new Set(INVOCATION_NAMES).size).toBe(28);
  });

  it('every invocation has a non-empty description and a valid levelAvailable', () => {
    INVOCATIONS.forEach((i) => {
      expect(i.description.length).toBeGreaterThan(0);
      expect(i.levelAvailable).toBeGreaterThanOrEqual(1);
    });
  });

  it('exactly 5 invocations are available at level 1', () => {
    expect(LEVEL_1_INVOCATIONS).toHaveLength(5);
    expect(LEVEL_1_INVOCATIONS.map((i) => i.name).sort()).toEqual(
      ['Armor of Shadows', 'Eldritch Mind', 'Pact of the Blade', 'Pact of the Chain', 'Pact of the Tome'].sort(),
    );
  });

  it('level-1 invocations have no prerequisite', () => {
    LEVEL_1_INVOCATIONS.forEach((i) => expect(i.prerequisite).toBeUndefined());
  });
});

describe('CLASSES_DATA.classFeatures1', () => {
  it('grants Weapon Mastery to exactly Barbarian, Fighter, Paladin, Ranger, and Rogue', () => {
    CLASSES_DATA.forEach((c) => {
      const hasMastery = !!c.classFeatures1?.weaponMastery;
      expect(hasMastery).toBe(WEAPON_MASTERY_CLASSES.includes(c.name));
    });
  });

  it('Barbarian Weapon Mastery is 2 simple-or-martial melee weapons', () => {
    const barbarian = CLASSES_DATA.find((c) => c.name === 'Barbarian')!;
    expect(barbarian.classFeatures1?.weaponMastery).toEqual({ count: 2, pool: 'simpleOrMartialMelee' });
  });

  it('Fighter gets Fighting Style and 3-weapon Mastery from any simple-or-martial weapon', () => {
    const fighter = CLASSES_DATA.find((c) => c.name === 'Fighter')!;
    expect(fighter.classFeatures1?.fightingStyle).toBe(true);
    expect(fighter.classFeatures1?.weaponMastery).toEqual({ count: 3, pool: 'simpleOrMartial' });
  });

  it('Paladin and Ranger get Weapon Mastery but NOT Fighting Style at level 1 (that comes at level 2 per SRD)', () => {
    ['Paladin', 'Ranger'].forEach((name) => {
      const cls = CLASSES_DATA.find((c) => c.name === name)!;
      expect(cls.classFeatures1?.weaponMastery).toEqual({ count: 2, pool: 'simpleOrMartial' });
      expect(cls.classFeatures1?.fightingStyle).toBeUndefined();
    });
  });

  it('Rogue gets Expertise (2) and Weapon Mastery restricted to Finesse/Light weapons', () => {
    const rogue = CLASSES_DATA.find((c) => c.name === 'Rogue')!;
    expect(rogue.classFeatures1?.expertise).toEqual({ count: 2 });
    expect(rogue.classFeatures1?.weaponMastery).toEqual({ count: 2, pool: 'finesseOrLight' });
  });

  it('Cleric and Druid each grant a 2-option Order choice with matching labels', () => {
    const cleric = CLASSES_DATA.find((c) => c.name === 'Cleric')!;
    expect(cleric.classFeatures1?.order?.label).toBe('Divine Order');
    expect(cleric.classFeatures1?.order?.options.map((o) => o.name)).toEqual(['Protector', 'Thaumaturge']);

    const druid = CLASSES_DATA.find((c) => c.name === 'Druid')!;
    expect(druid.classFeatures1?.order?.label).toBe('Primal Order');
    expect(druid.classFeatures1?.order?.options.map((o) => o.name)).toEqual(['Magician', 'Warden']);
  });

  it('every order option has a non-empty description', () => {
    CLASSES_DATA.forEach((c) => {
      c.classFeatures1?.order?.options.forEach((o) => {
        expect(o.description.length).toBeGreaterThan(0);
      });
    });
  });

  it('only Warlock grants an Eldritch Invocation choice at level 1', () => {
    CLASSES_DATA.forEach((c) => {
      expect(!!c.classFeatures1?.invocation).toBe(c.name === 'Warlock');
    });
  });

  it('classes with no level-1 class features beyond skills/saves have no classFeatures1', () => {
    ['Bard', 'Monk', 'Sorcerer', 'Wizard'].forEach((name) => {
      const cls = CLASSES_DATA.find((c) => c.name === name)!;
      expect(cls.classFeatures1).toBeUndefined();
    });
  });
});
