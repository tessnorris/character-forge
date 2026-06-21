import { describe, it, expect } from 'vitest';
import { CLASSES_DATA } from '../classes';
import { WEAPONS } from '../weapons';
import { ARMOR, ARMOR_BY_NAME } from '../armor';

const DAMAGE_TYPES = ['bludgeoning', 'piercing', 'slashing'];
const VALID_PROFS = ['simple', 'martial', 'martialLight', 'martialFinesseOrLight'];
const DICE_OR_FLAT = /^(\d+d\d+|\d+)$/; // "1d8", "2d6", or a flat "1" (Blowgun)

describe('class combat data (Phase 3)', () => {
  it('every class has a valid Hit Die (6/8/10/12)', () => {
    CLASSES_DATA.forEach((c) => {
      expect([6, 8, 10, 12]).toContain(c.hitDie);
    });
  });

  it('every class lists at least one valid weapon-proficiency group', () => {
    CLASSES_DATA.forEach((c) => {
      expect(c.weaponProficiencies.length).toBeGreaterThan(0);
      c.weaponProficiencies.forEach((p) => expect(VALID_PROFS).toContain(p));
    });
  });

  it('martial classes get Simple + Martial; full casters get Simple only', () => {
    const byName = Object.fromEntries(CLASSES_DATA.map((c) => [c.name, c]));
    expect(byName.Fighter.weaponProficiencies).toEqual(['simple', 'martial']);
    expect(byName.Barbarian.weaponProficiencies).toEqual(['simple', 'martial']);
    expect(byName.Wizard.weaponProficiencies).toEqual(['simple']);
    expect(byName.Rogue.weaponProficiencies).toContain('martialFinesseOrLight');
    expect(byName.Monk.weaponProficiencies).toContain('martialLight');
  });
});

describe('weapon damage data (Phase 3)', () => {
  it('every weapon has valid damage dice and a valid damage type', () => {
    WEAPONS.forEach((w) => {
      expect(w.damage.dice).toMatch(DICE_OR_FLAT);
      expect(DAMAGE_TYPES).toContain(w.damage.type);
      if (w.damage.versatile) expect(w.damage.versatile).toMatch(DICE_OR_FLAT);
    });
  });

  it('every Versatile weapon carries a two-handed damage value', () => {
    WEAPONS.filter((w) => w.properties.includes('Versatile')).forEach((w) => {
      expect(w.damage.versatile).toBeTruthy();
    });
  });

  it('spot-checks a couple of well-known weapons', () => {
    const greatsword = WEAPONS.find((w) => w.name === 'Greatsword')!;
    expect(greatsword.damage).toMatchObject({ dice: '2d6', type: 'slashing' });
    const longsword = WEAPONS.find((w) => w.name === 'Longsword')!;
    expect(longsword.damage).toMatchObject({ dice: '1d8', type: 'slashing', versatile: '1d10' });
  });
});

describe('armor table (Phase 3)', () => {
  it('has the standard armor categories represented', () => {
    expect(ARMOR.filter((a) => a.type === 'light').length).toBeGreaterThan(0);
    expect(ARMOR.filter((a) => a.type === 'medium').length).toBeGreaterThan(0);
    expect(ARMOR.filter((a) => a.type === 'heavy').length).toBeGreaterThan(0);
    expect(ARMOR.filter((a) => a.type === 'shield')).toHaveLength(1);
  });

  it('includes the armors that appear in the shop, with correct base AC', () => {
    expect(ARMOR_BY_NAME['Leather Armor']).toMatchObject({ type: 'light', baseAC: 11 });
    expect(ARMOR_BY_NAME['Chain Shirt']).toMatchObject({ type: 'medium', baseAC: 13 });
    expect(ARMOR_BY_NAME['Chain Mail']).toMatchObject({ type: 'heavy', baseAC: 16 });
    expect(ARMOR_BY_NAME.Shield).toMatchObject({ type: 'shield', baseAC: 2 });
  });
});
