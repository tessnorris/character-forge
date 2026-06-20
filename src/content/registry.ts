/**
 * The content registry is the single place components go to look up rules
 * content (equipment, eventually classes/species/backgrounds too). It merges
 * built-in data from `data/` with user-authored homebrew from `UserContent`,
 * so a component asking "what equipment exists?" never needs to know or care
 * whether a given item shipped with the app or was added by the player.
 *
 * Pure functions — no React, no storage access. `App.tsx` owns the
 * `UserContent` state and passes it in; this module just does the merging
 * and lookup.
 */

import { SHOP_ITEMS } from '../data/equipment';
import type { ShopItem, CustomEquipmentItem, UserContent } from '../types/content';

/** A single equipment catalog entry, normalized from either a built-in
 * ShopItem or a homebrew CustomEquipmentItem so the shop/picker UI can
 * treat them uniformly. */
export interface EquipmentEntry {
  /** Stable identity for the entry: a ShopItem's name (built-ins are
   * name-keyed today) or a CustomEquipmentItem's id. */
  key: string;
  name: string;
  costCP: number | null; // null = no listed price (not purchasable with starting funds)
  description?: string;
  isHomebrew: boolean;
}

function fromShopItem(item: ShopItem): EquipmentEntry {
  return { key: item.name, name: item.name, costCP: item.costCP, isHomebrew: false };
}

function fromCustomItem(item: CustomEquipmentItem): EquipmentEntry {
  return {
    key: item.id,
    name: item.name,
    costCP: item.costCP ?? null,
    description: item.description,
    isHomebrew: true,
  };
}

/** All equipment available to a character: built-in shop items plus the
 * user's homebrew, sorted alphabetically by name for stable display order. */
export function getAllEquipment(userContent: UserContent): EquipmentEntry[] {
  const entries = [...SHOP_ITEMS.map(fromShopItem), ...userContent.customEquipment.map(fromCustomItem)];
  return entries.sort((a, b) => a.name.localeCompare(b.name));
}

/** Equipment purchasable with starting funds in the Step 4 shop — built-in
 * items (always priced) plus any homebrew item that has a cost set. */
export function getPurchasableEquipment(userContent: UserContent): EquipmentEntry[] {
  return getAllEquipment(userContent).filter((e) => e.costCP !== null);
}

/** Look up a single equipment entry by its key (name for built-ins, id for
 * homebrew). Returns undefined if not found in either source. */
export function findEquipment(key: string, userContent: UserContent): EquipmentEntry | undefined {
  return getAllEquipment(userContent).find((e) => e.key === key);
}
