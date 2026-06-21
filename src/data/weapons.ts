import type { WeaponDef } from '../types/content';

// Sourced from the 2024 SRD 5.2 weapon tables (5e24srd.com), itself drawn
// from Wizards of the Coast's CC-BY-4.0-licensed SRD 5.2. Covers every
// Simple and Martial weapon's category, Mastery Property, and base damage
// (dice + type, plus the two-handed `versatile` dice where applicable) —
// what the Weapon Mastery pickers and the derived sheet's attack/damage
// lines need. Weight and cost aren't modeled here since nothing uses them.
export const WEAPONS: WeaponDef[] = [
  // Simple Melee
  { name: 'Club', category: 'simpleMelee', properties: ['Light'], mastery: 'Slow', damage: { dice: '1d4', type: 'bludgeoning' } },
  { name: 'Dagger', category: 'simpleMelee', properties: ['Finesse', 'Light', 'Thrown'], mastery: 'Nick', damage: { dice: '1d4', type: 'piercing' } },
  { name: 'Greatclub', category: 'simpleMelee', properties: ['Two-Handed'], mastery: 'Push', damage: { dice: '1d8', type: 'bludgeoning' } },
  { name: 'Handaxe', category: 'simpleMelee', properties: ['Light', 'Thrown'], mastery: 'Vex', damage: { dice: '1d6', type: 'slashing' } },
  { name: 'Javelin', category: 'simpleMelee', properties: ['Thrown'], mastery: 'Slow', damage: { dice: '1d6', type: 'piercing' } },
  { name: 'Light Hammer', category: 'simpleMelee', properties: ['Light', 'Thrown'], mastery: 'Nick', damage: { dice: '1d4', type: 'bludgeoning' } },
  { name: 'Mace', category: 'simpleMelee', properties: [], mastery: 'Sap', damage: { dice: '1d6', type: 'bludgeoning' } },
  { name: 'Quarterstaff', category: 'simpleMelee', properties: ['Versatile'], mastery: 'Topple', damage: { dice: '1d6', type: 'bludgeoning', versatile: '1d8' } },
  { name: 'Sickle', category: 'simpleMelee', properties: ['Light'], mastery: 'Nick', damage: { dice: '1d4', type: 'slashing' } },
  { name: 'Spear', category: 'simpleMelee', properties: ['Thrown', 'Versatile'], mastery: 'Sap', damage: { dice: '1d6', type: 'piercing', versatile: '1d8' } },

  // Simple Ranged
  { name: 'Dart', category: 'simpleRanged', properties: ['Finesse', 'Thrown'], mastery: 'Vex', damage: { dice: '1d4', type: 'piercing' } },
  { name: 'Light Crossbow', category: 'simpleRanged', properties: ['Ammunition', 'Loading', 'Two-Handed'], mastery: 'Slow', damage: { dice: '1d8', type: 'piercing' } },
  { name: 'Shortbow', category: 'simpleRanged', properties: ['Ammunition', 'Two-Handed'], mastery: 'Vex', damage: { dice: '1d6', type: 'piercing' } },
  { name: 'Sling', category: 'simpleRanged', properties: ['Ammunition'], mastery: 'Slow', damage: { dice: '1d4', type: 'bludgeoning' } },

  // Martial Melee
  { name: 'Battleaxe', category: 'martialMelee', properties: ['Versatile'], mastery: 'Topple', damage: { dice: '1d8', type: 'slashing', versatile: '1d10' } },
  { name: 'Flail', category: 'martialMelee', properties: [], mastery: 'Sap', damage: { dice: '1d8', type: 'bludgeoning' } },
  { name: 'Glaive', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Graze', damage: { dice: '1d10', type: 'slashing' } },
  { name: 'Greataxe', category: 'martialMelee', properties: ['Heavy', 'Two-Handed'], mastery: 'Cleave', damage: { dice: '1d12', type: 'slashing' } },
  { name: 'Greatsword', category: 'martialMelee', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze', damage: { dice: '2d6', type: 'slashing' } },
  { name: 'Halberd', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Cleave', damage: { dice: '1d10', type: 'slashing' } },
  { name: 'Lance', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed (unless mounted)'], mastery: 'Topple', damage: { dice: '1d10', type: 'piercing' } },
  { name: 'Longsword', category: 'martialMelee', properties: ['Versatile'], mastery: 'Sap', damage: { dice: '1d8', type: 'slashing', versatile: '1d10' } },
  { name: 'Maul', category: 'martialMelee', properties: ['Heavy', 'Two-Handed'], mastery: 'Topple', damage: { dice: '2d6', type: 'bludgeoning' } },
  { name: 'Morningstar', category: 'martialMelee', properties: [], mastery: 'Sap', damage: { dice: '1d8', type: 'piercing' } },
  { name: 'Pike', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Push', damage: { dice: '1d10', type: 'piercing' } },
  { name: 'Rapier', category: 'martialMelee', properties: ['Finesse'], mastery: 'Vex', damage: { dice: '1d8', type: 'piercing' } },
  { name: 'Scimitar', category: 'martialMelee', properties: ['Finesse', 'Light'], mastery: 'Nick', damage: { dice: '1d6', type: 'slashing' } },
  { name: 'Shortsword', category: 'martialMelee', properties: ['Finesse', 'Light'], mastery: 'Vex', damage: { dice: '1d6', type: 'piercing' } },
  { name: 'Trident', category: 'martialMelee', properties: ['Thrown', 'Versatile'], mastery: 'Topple', damage: { dice: '1d8', type: 'piercing', versatile: '1d10' } },
  { name: 'Warhammer', category: 'martialMelee', properties: ['Versatile'], mastery: 'Push', damage: { dice: '1d8', type: 'bludgeoning', versatile: '1d10' } },
  { name: 'War Pick', category: 'martialMelee', properties: ['Versatile'], mastery: 'Sap', damage: { dice: '1d8', type: 'piercing', versatile: '1d10' } },
  { name: 'Whip', category: 'martialMelee', properties: ['Finesse', 'Reach'], mastery: 'Slow', damage: { dice: '1d4', type: 'slashing' } },

  // Martial Ranged
  { name: 'Blowgun', category: 'martialRanged', properties: ['Ammunition', 'Loading'], mastery: 'Vex', damage: { dice: '1', type: 'piercing' } },
  { name: 'Hand Crossbow', category: 'martialRanged', properties: ['Ammunition', 'Light', 'Loading'], mastery: 'Vex', damage: { dice: '1d6', type: 'piercing' } },
  { name: 'Heavy Crossbow', category: 'martialRanged', properties: ['Ammunition', 'Heavy', 'Loading', 'Two-Handed'], mastery: 'Push', damage: { dice: '1d10', type: 'piercing' } },
  { name: 'Longbow', category: 'martialRanged', properties: ['Ammunition', 'Heavy', 'Two-Handed'], mastery: 'Slow', damage: { dice: '1d8', type: 'piercing' } },
  { name: 'Musket', category: 'martialRanged', properties: ['Ammunition', 'Loading', 'Two-Handed'], mastery: 'Slow', damage: { dice: '1d12', type: 'piercing' } },
  { name: 'Pistol', category: 'martialRanged', properties: ['Ammunition', 'Loading'], mastery: 'Vex', damage: { dice: '1d10', type: 'piercing' } },
];

export const WEAPON_NAMES: string[] = WEAPONS.map((w) => w.name);
export const WEAPON_BY_NAME: Record<string, WeaponDef> = Object.fromEntries(
  WEAPONS.map((w) => [w.name, w]),
);

/** True if a weapon belongs to the Simple category (melee or ranged). */
export const isSimple = (w: WeaponDef): boolean => w.category.startsWith('simple');
/** True if a weapon belongs to the Martial category (melee or ranged). */
export const isMartial = (w: WeaponDef): boolean => w.category.startsWith('martial');
/** True if a weapon is Melee (simple or martial). */
export const isMelee = (w: WeaponDef): boolean => w.category.endsWith('Melee');
/** True if a weapon has the Finesse or Light property — the pool Rogue's
 * Weapon Mastery is restricted to. */
export const isFinesseOrLight = (w: WeaponDef): boolean =>
  w.properties.some((p) => p === 'Finesse' || p === 'Light');
