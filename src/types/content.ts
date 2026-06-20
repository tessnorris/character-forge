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

export interface SpeciesDef {
  name: string;
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
