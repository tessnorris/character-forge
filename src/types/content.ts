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

/** A background grants ability-score increases tied to three named abilities. */
export interface BackgroundDef {
  name: string;
  abilities: [string, string, string]; // ability *names*, e.g. "Strength"
}

export interface SpeciesDef {
  name: string;
}

/** One starting-equipment option for a class (the "(A) ..." / "(B) ..." choices). */
export interface EquipmentPackage {
  id: string; // "A", "B", "C"
  desc: string; // human-readable summary, as shown in the picker
  items: Record<string, number>; // item name -> quantity
  gp: number; // gold pieces granted if this package's leftover-funds shop is used
}

export interface ClassDef {
  name: string;
  packages: EquipmentPackage[];
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
