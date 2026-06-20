import type { FeatDef } from '../types/content';

// The 10 Origin feats granted by the 16 backgrounds in data/backgrounds.ts
// (every background grants exactly one of these). Simple name+description
// for Phase 2 — no prerequisite tracking yet, deferred to the leveling
// phase. Also usable for Human's "Versatile" trait, which grants a bonus
// Origin feat of the player's choice.
export const FEATS: FeatDef[] = [
  {
    name: 'Alert',
    description:
      "Add your Proficiency Bonus to your initiative rolls. You can also swap your initiative with a willing ally's at the start of combat.",
  },
  {
    name: 'Crafter',
    description:
      "Gain proficiency with three kinds of Artisan's Tools of your choice. You also get a discount when buying nonmagical items and can craft certain items faster during downtime.",
  },
  {
    name: 'Healer',
    description:
      "Whenever you use a Healer's Kit to stabilize a dying creature, that creature also regains hit points. You can also expend a use of the kit to let a creature spend Hit Dice to heal during a short rest.",
  },
  {
    name: 'Lucky',
    description:
      'You have a pool of Luck Points equal to your Proficiency Bonus. Spend one to give yourself or another creature you can see Advantage on a D20 Test, or to impose Disadvantage on an attack roll against you.',
  },
  {
    name: 'Magic Initiate',
    description:
      'Choose a class (Cleric, Druid, or Wizard, depending on the background). Learn two cantrips and one 1st-level spell from that class, castable once per long rest without a spell slot.',
  },
  {
    name: 'Musician',
    description:
      "Gain proficiency with three kinds of musical instruments of your choice. After a short or long rest, you can play a piece to give yourself and allies who hear it Heroic Inspiration.",
  },
  {
    name: 'Savage Attacker',
    description:
      'Once per turn when you roll damage for a melee weapon attack, you can roll the weapon\'s damage dice twice and use either total.',
  },
  {
    name: 'Skilled',
    description: 'Gain proficiency in any combination of three skills or tools of your choice.',
  },
  {
    name: 'Tavern Brawler',
    description:
      'Your unarmed strikes use a d4 for damage and you add your Strength modifier twice. You also gain proficiency with Improvised Weapons and can push a creature you hit away or grapple it as a bonus action.',
  },
  {
    name: 'Tough',
    description: 'Your hit point maximum increases by 2, and it increases by 2 again whenever you gain a level.',
  },
];

export const FEAT_NAMES: string[] = FEATS.map((f) => f.name);
export const FEAT_BY_NAME: Record<string, FeatDef> = Object.fromEntries(
  FEATS.map((f) => [f.name, f]),
);
