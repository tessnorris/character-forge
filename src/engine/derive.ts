import { ABILITIES, ABILITY_NAMES, ABILITY_BY_ID } from '../data/abilities';
import { BACKGROUNDS, BACKGROUNDS_BY_NAME } from '../data/backgrounds';
import { CLASSES_DATA } from '../data/classes';
import { SPECIES_DATA } from '../data/species';
import { SKILLS } from '../data/skills';
import { FEAT_BY_NAME } from '../data/feats';
import { FIGHTING_STYLES } from '../data/fightingStyles';
import { INVOCATIONS } from '../data/invocations';
import { ARMOR_BY_NAME } from '../data/armor';
import { WEAPON_BY_NAME, isSimple, isMartial } from '../data/weapons';
import { getMod } from './dice';
import type { Character, Combatant } from '../types/character';
import type {
  AbilityId,
  DamageType,
  MasteryProperty,
  WeaponDef,
  WeaponProficiency,
} from '../types/content';

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

/** The full set of skills a character is proficient in: the background's
 * two fixed skills (always granted, not a choice) plus whatever the player
 * picked for the class's skillChoices. De-duplicated in case a class skill
 * pick happens to overlap a background skill — proficiency doesn't stack,
 * it's just one proficiency either way. */
export const proficientSkills = (character: Character): string[] => {
  const bg = character.background ? BACKGROUNDS_BY_NAME[character.background] : null;
  const bgSkills = bg ? bg.skills : [];
  const classSkills = character.classSkills ?? [];
  return Array.from(new Set([...bgSkills, ...classSkills]));
};

/* ============================================================
 * deriveCharacter — the full computed view of a character.
 *
 * Pure: takes character state in, returns a plain data structure the sheet
 * renders. All level-1 assumptions (proficiency bonus +2, HP = hit die max
 * + CON mod) are localized here. Feat *mechanics* (e.g. Tough's +2 HP,
 * Alert's initiative bonus) are deliberately NOT folded into these numbers —
 * the feat system is still name+description only (deferred to the leveling
 * phase), so applying some feats' math but not others would be inconsistent
 * and surprising. Instead every feat is surfaced in `capabilities` with its
 * text, for the player to apply by hand.
 * ============================================================ */

/** Character level is fixed at 1 for now; proficiency bonus is +2. Kept as a
 * function so the leveling phase can swap in the real level→PB table. */
export const proficiencyBonusForLevel = (level = 1): number => 2 + Math.floor((level - 1) / 4);

/** Combined inventory: the chosen equipment package's items plus anything
 * bought in the shop, summed by name. Built-in items are name-keyed; homebrew
 * bought items may be id-keyed and simply won't match the weapon/armor
 * catalogs, which is fine. */
export const combinedEquipment = (character: Character): Record<string, number> => {
  const out: Record<string, number> = {};
  const classObj = CLASSES_DATA.find((c) => c.name === character.charClass);
  const pkg = classObj?.packages.find((p) => p.id === character.equipmentPackageId);
  if (pkg) for (const [name, qty] of Object.entries(pkg.items)) out[name] = (out[name] || 0) + qty;
  for (const [name, qty] of Object.entries(character.purchasedItems || {})) out[name] = (out[name] || 0) + qty;
  return out;
};

export interface DerivedAbility {
  name: string;
  id: AbilityId;
  short: string;
  base: number | null;
  bonus: number;
  final: number | null;
  mod: number | null;
}

export interface DerivedSave {
  ability: string;
  id: AbilityId;
  short: string;
  proficient: boolean;
  mod: number | null;
}

export interface DerivedSkill {
  name: string;
  ability: AbilityId;
  abilityShort: string;
  proficient: boolean;
  expertise: boolean;
  mod: number | null;
}

export interface DerivedArmorClass {
  value: number | null;
  /** Human-readable breakdown, e.g. "Leather Armor (11) + DEX 2" or "Unarmored 10 + DEX 2". */
  label: string;
}

export interface DerivedHitPoints {
  max: number | null;
  hitDie: number | null;
}

export interface WeaponAttack {
  name: string;
  ability: AbilityId;
  attackBonus: number | null;
  damage: string; // dice + ability mod, e.g. "1d8 + 3" (mod omitted when 0/unknown)
  damageType: DamageType;
  versatile?: string;
  properties: string[];
  mastery: MasteryProperty;
  proficient: boolean;
  equipped: boolean;
}

export interface Capability {
  name: string;
  detail?: string;
}

export interface CapabilityGroup {
  source: string;
  items: Capability[];
}

export interface DerivedCharacter {
  proficiencyBonus: number;
  abilities: DerivedAbility[];
  saves: DerivedSave[];
  skills: DerivedSkill[];
  proficientSkillNames: string[];
  initiative: number | null;
  passivePerception: number | null;
  armorClass: DerivedArmorClass;
  hitPoints: DerivedHitPoints;
  speed: number;
  weaponAttacks: WeaponAttack[];
  capabilities: CapabilityGroup[];
}

/** Strip a trailing parenthetical from a feat name for catalog lookup, e.g.
 * "Magic Initiate (Cleric)" -> "Magic Initiate". */
const featBaseName = (name: string): string => name.replace(/\s*\([^)]*\)\s*$/, '').trim();

const featDetail = (name: string): string | undefined => FEAT_BY_NAME[featBaseName(name)]?.description;

/** True if a class with these proficiency groups can wield the given weapon. */
const isProficientWithWeapon = (weapon: WeaponDef, profs: WeaponProficiency[]): boolean =>
  profs.some((p) => {
    switch (p) {
      case 'simple':
        return isSimple(weapon);
      case 'martial':
        return isMartial(weapon);
      case 'martialLight':
        return isMartial(weapon) && weapon.properties.includes('Light');
      case 'martialFinesseOrLight':
        return isMartial(weapon) && weapon.properties.some((x) => x === 'Finesse' || x === 'Light');
      default:
        return false;
    }
  });

/** The ability a weapon's attack/damage uses: DEX for ranged, STR for melee,
 * and the better of the two for Finesse melee. */
const weaponAbility = (weapon: WeaponDef, modById: Record<AbilityId, number | null>): AbilityId => {
  if (weapon.category.endsWith('Ranged')) return 'dex';
  if (!weapon.properties.includes('Finesse')) return 'str';
  const s = modById.str;
  const d = modById.dex;
  if (s == null || d == null) return 'str';
  return d > s ? 'dex' : 'str';
};

const signed = (n: number): string => (n >= 0 ? `+${n}` : `${n}`);

/** Format a damage line: dice plus the ability modifier (omitted when 0 or
 * when scores aren't rolled). "1d8 + 3", "1d8 - 1", "1d8", "2d6". */
const damageLine = (dice: string, mod: number | null): string => {
  if (mod == null || mod === 0) return dice;
  return `${dice} ${mod >= 0 ? '+' : '-'} ${Math.abs(mod)}`;
};

export const deriveCharacter = (character: Character): DerivedCharacter => {
  const pb = proficiencyBonusForLevel(1);
  const scores = finalScores(character);

  // Ability modifiers, by name and by id (null until scores are rolled).
  const modByName: Record<string, number | null> = {};
  const modById: Record<AbilityId, number | null> = { str: null, dex: null, con: null, int: null, wis: null, cha: null };
  const abilities: DerivedAbility[] = ABILITIES.map((a) => {
    const s = scores[a.name];
    const mod = s.final == null ? null : getMod(s.final);
    modByName[a.name] = mod;
    modById[a.id] = mod;
    return { name: a.name, id: a.id, short: a.short, base: s.base, bonus: s.bonus, final: s.final, mod };
  });

  const classObj = CLASSES_DATA.find((c) => c.name === character.charClass);
  const speciesObj = SPECIES_DATA.find((s) => s.name === character.species);
  const bg = character.background ? BACKGROUNDS_BY_NAME[character.background] : null;

  // Saving throws — class grants two; +PB on those, ability mod otherwise.
  const saveSet = new Set<AbilityId>(classObj?.saves ?? []);
  const saves: DerivedSave[] = ABILITIES.map((a) => {
    const proficient = saveSet.has(a.id);
    const base = modById[a.id];
    return {
      ability: a.name,
      id: a.id,
      short: a.short,
      proficient,
      mod: base == null ? null : base + (proficient ? pb : 0),
    };
  });

  // Skill proficiencies: background's two + class picks + species bonus skill.
  const profSkillNames = new Set<string>([...proficientSkills(character)]);
  if (character.speciesBonusSkill) profSkillNames.add(character.speciesBonusSkill);
  const expertiseSet = new Set<string>(character.expertise ?? []);
  const skills: DerivedSkill[] = SKILLS.map((sk) => {
    const proficient = profSkillNames.has(sk.name);
    const expertise = proficient && expertiseSet.has(sk.name);
    const base = modById[sk.ability];
    const rank = (proficient ? pb : 0) + (expertise ? pb : 0);
    return {
      name: sk.name,
      ability: sk.ability,
      abilityShort: ABILITY_BY_ID[sk.ability].short,
      proficient,
      expertise,
      mod: base == null ? null : base + rank,
    };
  });

  const perception = skills.find((s) => s.name === 'Perception');
  const passivePerception = perception?.mod == null ? null : 10 + perception.mod;
  const initiative = modById.dex;

  // Armor Class from equipped armor/shield (first worn body armor wins).
  const equipped = character.equipped ?? [];
  const worn = equipped.map((n) => ARMOR_BY_NAME[n]).find((a) => a && a.type !== 'shield');
  const hasShield = equipped.some((n) => ARMOR_BY_NAME[n]?.type === 'shield');
  const shieldBonus = hasShield ? 2 : 0;
  const dexMod = modById.dex;
  let acValue: number | null;
  let acLabel: string;
  if (!worn) {
    acValue = dexMod == null ? null : 10 + dexMod + shieldBonus;
    acLabel = `Unarmored 10${dexMod == null ? '' : ` ${signed(dexMod)} DEX`}${shieldBonus ? ' +2 Shield' : ''}`;
  } else {
    const dexPart = worn.type === 'light' ? dexMod : worn.type === 'medium' ? (dexMod == null ? null : Math.min(dexMod, 2)) : 0;
    acValue = dexPart == null ? null : worn.baseAC + dexPart + shieldBonus;
    const dexText = worn.type === 'heavy' ? '' : dexPart == null ? '' : ` ${signed(dexPart)} DEX`;
    acLabel = `${worn.name} (${worn.baseAC})${dexText}${shieldBonus ? ' +2 Shield' : ''}`;
  }
  const armorClass: DerivedArmorClass = { value: acValue, label: acLabel };

  // Hit points: hit die max + CON mod at level 1.
  const hitDie = classObj?.hitDie ?? null;
  const conMod = modById.con;
  const hpMax = hitDie == null || conMod == null ? null : hitDie + conMod;
  const hitPoints: DerivedHitPoints = { max: hpMax, hitDie };

  // Weapon attack lines for owned weapons in the catalog.
  const effectiveProfs: WeaponProficiency[] = [...(classObj?.weaponProficiencies ?? [])];
  // Cleric's Protector and Druid's Warden orders grant Martial weapon proficiency.
  if (character.classOrder === 'Protector' || character.classOrder === 'Warden') effectiveProfs.push('martial');
  const inventory = combinedEquipment(character);
  const weaponAttacks: WeaponAttack[] = Object.entries(inventory)
    .filter(([name, qty]) => qty > 0 && WEAPON_BY_NAME[name])
    .map(([name]) => {
      const w = WEAPON_BY_NAME[name];
      const abId = weaponAbility(w, modById);
      const abMod = modById[abId];
      const proficient = isProficientWithWeapon(w, effectiveProfs);
      return {
        name: w.name,
        ability: abId,
        attackBonus: abMod == null ? null : abMod + (proficient ? pb : 0),
        damage: damageLine(w.damage.dice, abMod),
        damageType: w.damage.type,
        versatile: w.damage.versatile,
        properties: w.properties,
        mastery: w.mastery,
        proficient,
        equipped: equipped.includes(name),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Capabilities grouped by source.
  const capabilities: CapabilityGroup[] = [];

  const classItems: Capability[] = [];
  if (character.weaponMastery?.length) classItems.push({ name: 'Weapon Mastery', detail: character.weaponMastery.join(', ') });
  if (character.fightingStyle) {
    const fs = FIGHTING_STYLES.find((f) => f.name === character.fightingStyle);
    classItems.push({ name: `Fighting Style: ${character.fightingStyle}`, detail: fs?.description });
  }
  if (character.classOrder && classObj?.classFeatures1?.order) {
    const opt = classObj.classFeatures1.order.options.find((o) => o.name === character.classOrder);
    classItems.push({ name: `${classObj.classFeatures1.order.label}: ${character.classOrder}`, detail: opt?.description });
  }
  if (character.expertise?.length) classItems.push({ name: 'Expertise', detail: character.expertise.join(', ') });
  if (character.invocation) {
    const inv = INVOCATIONS.find((i) => i.name === character.invocation);
    classItems.push({ name: `Eldritch Invocation: ${character.invocation}`, detail: inv?.description });
  }
  if (classObj && classItems.length) capabilities.push({ source: `${classObj.name} (Class)`, items: classItems });

  const speciesItems: Capability[] = [];
  const sf = speciesObj?.speciesFeatures1;
  if (sf?.ancestry && character.speciesAncestry) {
    const opt = sf.ancestry.options.find((o) => o.name === character.speciesAncestry);
    speciesItems.push({ name: `${sf.ancestry.label}: ${character.speciesAncestry}`, detail: opt?.description });
  }
  if (sf?.lineage && character.speciesLineage) {
    const opt = sf.lineage.options.find((o) => o.name === character.speciesLineage);
    const spellAb = character.lineageSpellcastingAbility ? ABILITY_BY_ID[character.lineageSpellcastingAbility]?.name : undefined;
    const lvl1 = opt?.grants.find((g) => g.level === 1);
    const parts = [opt?.traitDescription, lvl1 ? `Cantrip: ${lvl1.name}` : null, spellAb ? `Spellcasting ability: ${spellAb}` : null].filter(Boolean);
    speciesItems.push({ name: `${sf.lineage.label}: ${character.speciesLineage}`, detail: parts.join(' · ') || undefined });
  }
  if (character.speciesBonusSkill) speciesItems.push({ name: 'Bonus Skill', detail: character.speciesBonusSkill });
  if (character.speciesBonusFeat) speciesItems.push({ name: `Bonus Origin Feat: ${character.speciesBonusFeat}`, detail: featDetail(character.speciesBonusFeat) });
  if (speciesObj && speciesItems.length) capabilities.push({ source: `${speciesObj.name} (Species)`, items: speciesItems });

  if (bg) {
    const bgItems: Capability[] = [];
    bgItems.push({ name: `Origin Feat: ${bg.feat}`, detail: featDetail(bg.feat) });
    if (bg.tool) bgItems.push({ name: 'Tool Proficiency', detail: bg.tool });
    capabilities.push({ source: `${bg.name} (Background)`, items: bgItems });
  }

  return {
    proficiencyBonus: pb,
    abilities,
    saves,
    skills,
    proficientSkillNames: Array.from(profSkillNames).sort(),
    initiative,
    passivePerception,
    armorClass,
    hitPoints,
    speed: 30,
    weaponAttacks,
    capabilities,
  };
};
