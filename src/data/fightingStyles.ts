import type { FightingStyleDef } from '../types/content';

// Fighting Style feats, selected at level 1 by Fighter (Paladin and Ranger
// also get a Fighting Style, but not until level 2 per the 2024 SRD — out
// of scope for this phase's level-1 character creation).
//
// Only 4 of these 10 have publicly available SRD text (5e24srd.com); the
// other 6 are PHB-exclusive. Their `description` fields are placeholders —
// edit them directly in this file with the real text whenever convenient;
// no other code needs to change, since the picker UI just reads this list.
export const FIGHTING_STYLES: FightingStyleDef[] = [
  {
    name: 'Archery',
    description: 'You gain a +2 bonus to attack rolls you make with Ranged weapons.',
  },
  {
    name: 'Blind Fighting',
    description: '[Placeholder — PHB-exclusive text not yet transcribed. Edit this entry directly.]',
  },
  {
    name: 'Defense',
    description: "While you're wearing Light, Medium, or Heavy armor, you gain a +1 bonus to Armor Class.",
  },
  {
    name: 'Dueling',
    description: '[Placeholder — PHB-exclusive text not yet transcribed. Edit this entry directly.]',
  },
  {
    name: 'Great Weapon Fighting',
    description:
      'When you roll damage for an attack you make with a Melee weapon you are holding with two hands, you can treat any 1 or 2 on a damage die as a 3. The weapon must have the Two-Handed or Versatile property to gain this benefit.',
  },
  {
    name: 'Interception',
    description: '[Placeholder — PHB-exclusive text not yet transcribed. Edit this entry directly.]',
  },
  {
    name: 'Protection',
    description: '[Placeholder — PHB-exclusive text not yet transcribed. Edit this entry directly.]',
  },
  {
    name: 'Thrown Weapon Fighting',
    description: '[Placeholder — PHB-exclusive text not yet transcribed. Edit this entry directly.]',
  },
  {
    name: 'Two-Weapon Fighting',
    description:
      "When you make an extra attack as a result of using a weapon that has the Light property, you can add your ability modifier to the damage of that attack if you aren't already adding it to the damage.",
  },
  {
    name: 'Unarmed Fighting',
    description: '[Placeholder — PHB-exclusive text not yet transcribed. Edit this entry directly.]',
  },
];

export const FIGHTING_STYLE_NAMES: string[] = FIGHTING_STYLES.map((f) => f.name);
export const FIGHTING_STYLE_BY_NAME: Record<string, FightingStyleDef> = Object.fromEntries(
  FIGHTING_STYLES.map((f) => [f.name, f]),
);
