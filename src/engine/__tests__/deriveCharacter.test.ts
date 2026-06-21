import { describe, it, expect } from 'vitest';
import { deriveCharacter, combinedEquipment, proficiencyBonusForLevel } from '../derive';
import { makeCharacter } from '../../test/factories';

// A clean set of scores with no background bonus, so final === base and the
// modifiers are easy to read: STR 16 (+3), DEX 14 (+2), CON 12 (+1),
// INT 10 (0), WIS 13 (+1), CHA 8 (-1).
const CLEAN_SCORES = { Strength: 16, Dexterity: 14, Constitution: 12, Intelligence: 10, Wisdom: 13, Charisma: 8 };

const skill = (d: ReturnType<typeof deriveCharacter>, name: string) => d.skills.find((s) => s.name === name)!;
const save = (d: ReturnType<typeof deriveCharacter>, id: string) => d.saves.find((s) => s.id === id)!;
const attack = (d: ReturnType<typeof deriveCharacter>, name: string) => d.weaponAttacks.find((w) => w.name === name)!;

describe('proficiencyBonusForLevel', () => {
  it('is +2 at level 1 and scales every 4 levels', () => {
    expect(proficiencyBonusForLevel(1)).toBe(2);
    expect(proficiencyBonusForLevel(4)).toBe(2);
    expect(proficiencyBonusForLevel(5)).toBe(3);
    expect(proficiencyBonusForLevel(9)).toBe(4);
  });
});

describe('combinedEquipment', () => {
  it('merges the chosen package items with purchased items by name', () => {
    const c = makeCharacter({ charClass: 'Fighter', equipmentPackageId: 'A', purchasedItems: { Dagger: 2, Flail: 1 } });
    const inv = combinedEquipment(c);
    // Fighter package A includes a Flail; purchased adds one more -> 2.
    expect(inv.Flail).toBe(2);
    expect(inv.Dagger).toBe(2);
    expect(inv['Chain Mail']).toBe(1);
  });

  it('is empty when no package is chosen and nothing purchased', () => {
    const c = makeCharacter({ charClass: 'Fighter' });
    expect(Object.keys(combinedEquipment(c))).toHaveLength(0);
  });
});

describe('deriveCharacter — abilities and modifiers', () => {
  it('reports null modifiers before scores are rolled', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: null }));
    expect(d.abilities.every((a) => a.mod === null)).toBe(true);
    expect(d.initiative).toBeNull();
    expect(d.armorClass.value).toBeNull();
    expect(d.hitPoints.max).toBeNull();
    expect(d.passivePerception).toBeNull();
  });

  it('computes ability modifiers from final scores', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES }));
    const str = d.abilities.find((a) => a.id === 'str')!;
    expect(str.final).toBe(16);
    expect(str.mod).toBe(3);
    expect(d.abilities.find((a) => a.id === 'cha')!.mod).toBe(-1);
  });
});

describe('deriveCharacter — saving throws', () => {
  it('adds the proficiency bonus to the two class save proficiencies only', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES }));
    // Fighter is proficient in STR and CON saves.
    expect(save(d, 'str')).toMatchObject({ proficient: true, mod: 5 }); // 3 + 2
    expect(save(d, 'con')).toMatchObject({ proficient: true, mod: 3 }); // 1 + 2
    expect(save(d, 'dex')).toMatchObject({ proficient: false, mod: 2 }); // unproficient
  });
});

describe('deriveCharacter — skills', () => {
  it('marks background + class skills proficient and adds PB', () => {
    const d = deriveCharacter(
      makeCharacter({
        charClass: 'Fighter',
        background: 'Soldier', // grants Athletics, Intimidation
        baseScores: CLEAN_SCORES,
        bonusType: '2-1',
        bonus2: '',
        bonus1: '',
        classSkills: ['Perception', 'Survival'],
      }),
    );
    expect(skill(d, 'Athletics')).toMatchObject({ proficient: true, mod: 5 }); // STR +3 +2
    expect(skill(d, 'Perception')).toMatchObject({ proficient: true, mod: 3 }); // WIS +1 +2
    expect(skill(d, 'Arcana')).toMatchObject({ proficient: false, mod: 0 }); // INT 0
  });

  it('counts a species bonus skill as proficient', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Wizard', species: 'Human', baseScores: CLEAN_SCORES, speciesBonusSkill: 'Stealth' }));
    expect(skill(d, 'Stealth').proficient).toBe(true);
  });

  it('doubles the proficiency bonus for expertise skills', () => {
    const d = deriveCharacter(
      makeCharacter({
        charClass: 'Rogue',
        baseScores: CLEAN_SCORES,
        classSkills: ['Stealth', 'Perception', 'Acrobatics', 'Investigation'],
        expertise: ['Stealth'],
      }),
    );
    // Stealth (DEX +2) proficient + expertise => +2 +2 +2 = +6
    expect(skill(d, 'Stealth')).toMatchObject({ proficient: true, expertise: true, mod: 6 });
    // Perception (WIS +1) proficient only => +1 +2 = +3
    expect(skill(d, 'Perception')).toMatchObject({ expertise: false, mod: 3 });
  });
});

describe('deriveCharacter — derived combat stats', () => {
  it('passive perception is 10 + the perception skill modifier', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES, classSkills: ['Perception', 'Athletics'] }));
    expect(d.passivePerception).toBe(13); // 10 + (WIS +1 + PB 2)
  });

  it('hit points are the hit die max plus CON modifier', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES }));
    expect(d.hitPoints.hitDie).toBe(10);
    expect(d.hitPoints.max).toBe(11); // d10 -> 10 + CON +1
  });

  it('unarmored AC is 10 + DEX', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES }));
    expect(d.armorClass.value).toBe(12); // 10 + DEX +2
  });

  it('light armor adds full DEX; a shield adds +2', () => {
    const d = deriveCharacter(
      makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES, purchasedItems: { 'Studded Leather Armor': 1, Shield: 1 }, equipped: ['Studded Leather Armor', 'Shield'] }),
    );
    expect(d.armorClass.value).toBe(16); // 12 base + DEX +2 + 2 shield
  });

  it('medium armor caps the DEX bonus at +2', () => {
    const d = deriveCharacter(
      makeCharacter({ charClass: 'Fighter', baseScores: { ...CLEAN_SCORES, Dexterity: 18 }, purchasedItems: { 'Chain Shirt': 1 }, equipped: ['Chain Shirt'] }),
    );
    expect(d.armorClass.value).toBe(15); // 13 base + min(DEX +4, 2)
  });

  it('heavy armor ignores DEX entirely', () => {
    const d = deriveCharacter(
      makeCharacter({ charClass: 'Fighter', baseScores: { ...CLEAN_SCORES, Dexterity: 18 }, purchasedItems: { 'Chain Mail': 1 }, equipped: ['Chain Mail'] }),
    );
    expect(d.armorClass.value).toBe(16); // flat 16, no DEX
  });
});

describe('deriveCharacter — weapon attacks', () => {
  it('adds PB to a proficient weapon and includes the ability mod in damage', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES, purchasedItems: { Longsword: 1 }, equipped: ['Longsword'] }));
    const ls = attack(d, 'Longsword');
    expect(ls.proficient).toBe(true);
    expect(ls.attackBonus).toBe(5); // STR +3 + PB 2
    expect(ls.damage).toBe('1d8 + 3');
    expect(ls.damageType).toBe('slashing');
    expect(ls.versatile).toBe('1d10');
    expect(ls.equipped).toBe(true);
  });

  it('omits PB for a weapon the class is not proficient with', () => {
    // Wizard has Simple proficiency only; a Longsword is Martial.
    const d = deriveCharacter(makeCharacter({ charClass: 'Wizard', baseScores: CLEAN_SCORES, purchasedItems: { Longsword: 1 } }));
    const ls = attack(d, 'Longsword');
    expect(ls.proficient).toBe(false);
    expect(ls.attackBonus).toBe(3); // STR +3, no PB
  });

  it('uses the better of STR/DEX for a finesse weapon', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Wizard', baseScores: { ...CLEAN_SCORES, Strength: 8, Dexterity: 16 }, purchasedItems: { Dagger: 1 } }));
    const dagger = attack(d, 'Dagger');
    expect(dagger.ability).toBe('dex'); // DEX +3 beats STR -1
    expect(dagger.attackBonus).toBe(5); // simple weapon, Wizard proficient: +3 + 2
  });

  it('uses DEX for ranged weapons', () => {
    const d = deriveCharacter(makeCharacter({ charClass: 'Fighter', baseScores: CLEAN_SCORES, purchasedItems: { Shortbow: 1 } }));
    expect(attack(d, 'Shortbow').ability).toBe('dex');
  });

  it("Cleric's Protector order grants Martial weapon proficiency", () => {
    const base = { charClass: 'Cleric' as const, baseScores: CLEAN_SCORES, purchasedItems: { Longsword: 1 } };
    const without = deriveCharacter(makeCharacter(base));
    const withOrder = deriveCharacter(makeCharacter({ ...base, classOrder: 'Protector' }));
    expect(attack(without, 'Longsword').proficient).toBe(false);
    expect(attack(withOrder, 'Longsword').proficient).toBe(true);
  });
});

describe('deriveCharacter — capabilities', () => {
  it('groups class, species, and background features by source', () => {
    const d = deriveCharacter(
      makeCharacter({
        charClass: 'Fighter',
        species: 'Human',
        background: 'Soldier',
        baseScores: CLEAN_SCORES,
        fightingStyle: 'Archery',
        weaponMastery: ['Longsword', 'Greatsword'],
        speciesBonusSkill: 'Stealth',
        speciesBonusFeat: 'Alert',
      }),
    );
    const sources = d.capabilities.map((g) => g.source);
    expect(sources).toEqual(['Fighter (Class)', 'Human (Species)', 'Soldier (Background)']);

    const classGroup = d.capabilities.find((g) => g.source === 'Fighter (Class)')!;
    const fs = classGroup.items.find((i) => i.name.startsWith('Fighting Style'))!;
    expect(fs.detail).toContain('Ranged'); // Archery description
    expect(classGroup.items.some((i) => i.name === 'Weapon Mastery')).toBe(true);
  });

  it('resolves a background Origin feat description, stripping the parenthetical', () => {
    // Acolyte grants "Magic Initiate (Cleric)"; the catalog key is "Magic Initiate".
    const d = deriveCharacter(makeCharacter({ charClass: 'Cleric', background: 'Acolyte', baseScores: CLEAN_SCORES }));
    const bgGroup = d.capabilities.find((g) => g.source === 'Acolyte (Background)')!;
    const feat = bgGroup.items.find((i) => i.name.startsWith('Origin Feat'))!;
    expect(feat.name).toContain('Magic Initiate (Cleric)');
    expect(feat.detail).toBeTruthy(); // description was resolved despite the parenthetical
  });
});
