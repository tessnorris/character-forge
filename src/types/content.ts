/**
 * Types describing *rules content* — the D&D data that ships with the app
 * (classes, species, backgrounds, equipment) as well as anything a user
 * adds themselves (homebrew). Character state lives in `character.ts`.
 */

export type AbilityId = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityDef {
  id: AbilityId;
  name: string; // "Strength"
  short: string; // "STR"
  icon: string; // emoji, for now
  badge: string; // tailwind classes for the badge chip
}

/** One of the 18 standard D&D skills, tied to the ability used for its checks. */
export interface SkillDef {
  name: string; // "Athletics"
  ability: AbilityId; // governing ability for untrained/trained checks
}

/**
 * A class's skill-choice grant: pick `count` skills, either from a fixed
 * `options` list or — for classes like Bard whose 2024 rules say "choose
 * any" — from the full skill list (`options: 'any'`). Modeled as a union
 * rather than always shipping a list so "any" can't silently drift from
 * the real 18-skill catalog if it's ever extended.
 */
export type SkillChoice =
  | { count: number; options: string[] }
  | { count: number; options: 'any' };

/** One starting-equipment option for a class (the "(A) ..." / "(B) ..." choices). */
export interface EquipmentPackage {
  id: string; // "A", "B", "C"
  desc: string; // human-readable summary, as shown in the picker
  items: Record<string, number>; // item name -> quantity
  gp: number; // gold pieces granted if this package's leftover-funds shop is used
}

/**
 * A class as one coherent record, keyed by named fields rather than scattered
 * parallel lookups — `saves` and `skillChoices` sit alongside `packages` as
 * first-class data on the same object, the same way `packages` already does.
 */
export interface ClassDef {
  name: string;
  saves: [AbilityId, AbilityId]; // the two saving-throw proficiencies every class grants
  skillChoices: SkillChoice;
  packages: EquipmentPackage[];
  /** Level-1 class-granted choices beyond skills (Weapon Mastery, Fighting
   * Style, Divine/Primal Order, Expertise, Eldritch Invocations). Omitted
   * entirely for classes with no level-1 choice in this category. */
  classFeatures1?: ClassFeatures1;
}

/** Which weapons a class's level-1 Weapon Mastery can be chosen from. */
export type WeaponMasteryPool = 'simpleOrMartial' | 'simpleOrMartialMelee' | 'finesseOrLight';

export interface WeaponMasteryGrant {
  count: number;
  pool: WeaponMasteryPool;
}

/** One option within a class's "choose 1 of 2 named roles" level-1 feature
 * (Cleric's Divine Order, Druid's Primal Order). */
export interface ClassOrderOption {
  name: string;
  description: string;
}

/**
 * Level-1 class-granted choices beyond the universal saves/skillChoices.
 * Each field is present only for classes that actually grant that choice at
 * level 1 (per the 2024 SRD): Weapon Mastery (Barbarian, Fighter, Paladin,
 * Ranger, Rogue), Fighting Style (Fighter only at level 1 — Paladin/Ranger
 * gain it at level 2, out of this phase's scope), Divine Order (Cleric),
 * Primal Order (Druid), Expertise (Rogue), Eldritch Invocation (Warlock).
 */
export interface ClassFeatures1 {
  weaponMastery?: WeaponMasteryGrant;
  fightingStyle?: boolean;
  order?: { label: string; options: [ClassOrderOption, ClassOrderOption] }; // "Divine Order" / "Primal Order"
  expertise?: { count: number }; // choose N skills you're already proficient in
  invocation?: boolean; // choose 1 Eldritch Invocation from those available at level 1
}

/** A weapon's category (proficiency group) and mastery property, per the
 * 2024 SRD weapon table. Used to populate Weapon Mastery pickers. */
export type WeaponCategory = 'simpleMelee' | 'simpleRanged' | 'martialMelee' | 'martialRanged';
export type MasteryProperty = 'Cleave' | 'Graze' | 'Nick' | 'Push' | 'Sap' | 'Slow' | 'Topple' | 'Vex';

export interface WeaponDef {
  name: string;
  category: WeaponCategory;
  properties: string[]; // e.g. ["Finesse", "Light"] — free-text property names from the SRD
  mastery: MasteryProperty;
}

/** One of the 10 Fighting Style feats. Mechanics are populated for the 4
 * with public SRD text (Archery, Defense, Great Weapon Fighting, Two-Weapon
 * Fighting); the rest are PHB-exclusive and carry a placeholder description
 * the user can fill in directly in this data file. */
export interface FightingStyleDef {
  name: string;
  description: string;
}

/** One of the 28 Eldritch Invocations. `levelAvailable` is when a Warlock
 * can first select it; Phase 2 only lets players pick from the
 * level-1-eligible subset, but the full catalog (with mechanics for the
 * level-1 ones) is stored now for the future leveling system. */
export interface InvocationDef {
  name: string;
  levelAvailable: number;
  description: string;
  prerequisite?: string;
}

export interface SpeciesDef {
  name: string;
}

/**
 * A background as one coherent record: ability triple, the Origin feat it
 * grants, its two fixed skill proficiencies, its tool proficiency, and its
 * equipment-package choice — mirroring the field-per-concern shape of
 * ClassDef above rather than splitting these across separate lookup tables.
 */
export interface BackgroundDef {
  name: string;
  abilities: [string, string, string]; // ability *names*, e.g. "Strength"
  feat: string; // Origin feat name, e.g. "Alert"
  skills: [string, string]; // two fixed skill grants, e.g. ["Insight", "Religion"]
  tool: string; // tool proficiency description, e.g. "Thieves' Tools" or "One kind of Gaming Set"
  equipment: EquipmentPackage; // the "(A) ..." package; "(B) 50 GP" is implicit/universal
}

/** Simple name+description feat for Phase 2 — no prerequisite tracking yet
 * (deferred to the leveling phase). Scope is species-granted only (e.g. the
 * Human's bonus Origin feat), not general/background-granted feat picks. */
export interface FeatDef {
  name: string;
  description: string;
}

export interface ShopItem {
  name: string;
  costCP: number; // cost in copper pieces (1 gp = 100 cp)
}

/**
 * A piece of equipment a *user* added that isn't in the shop catalog —
 * e.g. a campaign-specific magic item. Kept distinct from ShopItem so the
 * registry can tell built-in and homebrew gear apart.
 *
 * `costCP` is optional: campaign loot ("the DM gave me this") often has no
 * sensible gold value. Items with a cost appear in the Step 4 shop like any
 * other ShopItem; items without one are still addable to inventory directly,
 * just not purchasable with starting funds.
 */
export interface CustomEquipmentItem {
  id: string;
  name: string;
  description?: string;
  costCP?: number;
}

/**
 * All user-authored ("homebrew") content, as persisted to storage. Each
 * category is a flat list today; as more content types are added (custom
 * backgrounds, feats, etc.) they get their own array here rather than a
 * generic untyped bag, so each stays independently typed and migratable.
 */
export interface UserContent {
  customEquipment: CustomEquipmentItem[];
}

export const emptyUserContent = (): UserContent => ({
  customEquipment: [],
});
