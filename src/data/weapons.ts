import type { WeaponDef } from '../types/content';

// Sourced from the 2024 SRD 5.2 weapon tables (5e24srd.com), itself drawn
// from Wizards of the Coast's CC-BY-4.0-licensed SRD 5.2. Covers every
// Simple and Martial weapon's category and Mastery Property, which is what
// the Weapon Mastery pickers (Barbarian, Fighter, Paladin, Ranger, Rogue)
// need. Full weapon stats (damage, weight, cost) aren't modeled here since
// nothing in the app needs them yet.
export const WEAPONS: WeaponDef[] = [
  // Simple Melee
  { name: 'Club', category: 'simpleMelee', properties: ['Light'], mastery: 'Slow' },
  { name: 'Dagger', category: 'simpleMelee', properties: ['Finesse', 'Light', 'Thrown'], mastery: 'Nick' },
  { name: 'Greatclub', category: 'simpleMelee', properties: ['Two-Handed'], mastery: 'Push' },
  { name: 'Handaxe', category: 'simpleMelee', properties: ['Light', 'Thrown'], mastery: 'Vex' },
  { name: 'Javelin', category: 'simpleMelee', properties: ['Thrown'], mastery: 'Slow' },
  { name: 'Light Hammer', category: 'simpleMelee', properties: ['Light', 'Thrown'], mastery: 'Nick' },
  { name: 'Mace', category: 'simpleMelee', properties: [], mastery: 'Sap' },
  { name: 'Quarterstaff', category: 'simpleMelee', properties: ['Versatile'], mastery: 'Topple' },
  { name: 'Sickle', category: 'simpleMelee', properties: ['Light'], mastery: 'Nick' },
  { name: 'Spear', category: 'simpleMelee', properties: ['Thrown', 'Versatile'], mastery: 'Sap' },

  // Simple Ranged
  { name: 'Dart', category: 'simpleRanged', properties: ['Finesse', 'Thrown'], mastery: 'Vex' },
  { name: 'Light Crossbow', category: 'simpleRanged', properties: ['Ammunition', 'Loading', 'Two-Handed'], mastery: 'Slow' },
  { name: 'Shortbow', category: 'simpleRanged', properties: ['Ammunition', 'Two-Handed'], mastery: 'Vex' },
  { name: 'Sling', category: 'simpleRanged', properties: ['Ammunition'], mastery: 'Slow' },

  // Martial Melee
  { name: 'Battleaxe', category: 'martialMelee', properties: ['Versatile'], mastery: 'Topple' },
  { name: 'Flail', category: 'martialMelee', properties: [], mastery: 'Sap' },
  { name: 'Glaive', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Graze' },
  { name: 'Greataxe', category: 'martialMelee', properties: ['Heavy', 'Two-Handed'], mastery: 'Cleave' },
  { name: 'Greatsword', category: 'martialMelee', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze' },
  { name: 'Halberd', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Cleave' },
  { name: 'Lance', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed (unless mounted)'], mastery: 'Topple' },
  { name: 'Longsword', category: 'martialMelee', properties: ['Versatile'], mastery: 'Sap' },
  { name: 'Maul', category: 'martialMelee', properties: ['Heavy', 'Two-Handed'], mastery: 'Topple' },
  { name: 'Morningstar', category: 'martialMelee', properties: [], mastery: 'Sap' },
  { name: 'Pike', category: 'martialMelee', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Push' },
  { name: 'Rapier', category: 'martialMelee', properties: ['Finesse'], mastery: 'Vex' },
  { name: 'Scimitar', category: 'martialMelee', properties: ['Finesse', 'Light'], mastery: 'Nick' },
  { name: 'Shortsword', category: 'martialMelee', properties: ['Finesse', 'Light'], mastery: 'Vex' },
  { name: 'Trident', category: 'martialMelee', properties: ['Thrown', 'Versatile'], mastery: 'Topple' },
  { name: 'Warhammer', category: 'martialMelee', properties: ['Versatile'], mastery: 'Push' },
  { name: 'War Pick', category: 'martialMelee', properties: ['Versatile'], mastery: 'Sap' },
  { name: 'Whip', category: 'martialMelee', properties: ['Finesse', 'Reach'], mastery: 'Slow' },

  // Martial Ranged
  { name: 'Blowgun', category: 'martialRanged', properties: ['Ammunition', 'Loading'], mastery: 'Vex' },
  { name: 'Hand Crossbow', category: 'martialRanged', properties: ['Ammunition', 'Light', 'Loading'], mastery: 'Vex' },
  { name: 'Heavy Crossbow', category: 'martialRanged', properties: ['Ammunition', 'Heavy', 'Loading', 'Two-Handed'], mastery: 'Push' },
  { name: 'Longbow', category: 'martialRanged', properties: ['Ammunition', 'Heavy', 'Two-Handed'], mastery: 'Slow' },
  { name: 'Musket', category: 'martialRanged', properties: ['Ammunition', 'Loading', 'Two-Handed'], mastery: 'Slow' },
  { name: 'Pistol', category: 'martialRanged', properties: ['Ammunition', 'Loading'], mastery: 'Vex' },
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
