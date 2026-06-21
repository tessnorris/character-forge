import type { ArmorDef } from '../types/content';

// The standard armor table from the 2024 SRD 5.2 (CC-BY-4.0). Only a few of
// these appear in the Step 6 shop today (Leather, Studded Leather, Chain
// Shirt, Chain Mail, Shield), but the full table is stored so AC derivation
// works for any armor a player records by name — including homebrew that
// reuses a standard armor's name. `baseAC` for a shield is the flat bonus it
// grants (+2); for body armor it's the armor's listed base AC.
export const ARMOR: ArmorDef[] = [
  // Light armor — base AC + full DEX modifier
  { name: 'Padded Armor', type: 'light', baseAC: 11, stealthDisadvantage: true },
  { name: 'Leather Armor', type: 'light', baseAC: 11 },
  { name: 'Studded Leather Armor', type: 'light', baseAC: 12 },

  // Medium armor — base AC + DEX modifier (capped at +2)
  { name: 'Hide Armor', type: 'medium', baseAC: 12 },
  { name: 'Chain Shirt', type: 'medium', baseAC: 13 },
  { name: 'Scale Mail', type: 'medium', baseAC: 14, stealthDisadvantage: true },
  { name: 'Breastplate', type: 'medium', baseAC: 14 },
  { name: 'Half Plate Armor', type: 'medium', baseAC: 15, stealthDisadvantage: true },

  // Heavy armor — base AC only (DEX ignored)
  { name: 'Ring Mail', type: 'heavy', baseAC: 14, stealthDisadvantage: true },
  { name: 'Chain Mail', type: 'heavy', baseAC: 16, stealthDisadvantage: true, strengthReq: 13 },
  { name: 'Splint Armor', type: 'heavy', baseAC: 17, stealthDisadvantage: true, strengthReq: 15 },
  { name: 'Plate Armor', type: 'heavy', baseAC: 18, stealthDisadvantage: true, strengthReq: 15 },

  // Shield — a flat +2 on top of worn armor
  { name: 'Shield', type: 'shield', baseAC: 2 },
];

export const ARMOR_NAMES: string[] = ARMOR.map((a) => a.name);
export const ARMOR_BY_NAME: Record<string, ArmorDef> = Object.fromEntries(
  ARMOR.map((a) => [a.name, a]),
);

/** True if a named item is body armor or a shield (i.e. equipping it affects AC). */
export const isArmorName = (name: string): boolean => name in ARMOR_BY_NAME;
