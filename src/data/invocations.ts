import type { InvocationDef } from '../types/content';

// All 28 Eldritch Invocations from the 2024 SRD 5.2 (5e24srd.com), with the
// Warlock level each first becomes selectable and a prerequisite where one
// applies. Phase 2 character creation only lets a level-1 Warlock pick from
// the level-1-eligible subset (no prerequisite, or only a level-1 one):
// Armor of Shadows, Eldritch Mind, Pact of the Blade, Pact of the Chain,
// Pact of the Tome. The rest of the catalog is stored now so the future
// leveling system doesn't need this data re-researched.
export const INVOCATIONS: InvocationDef[] = [
  {
    name: 'Agonizing Blast',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock, a Warlock cantrip that deals damage',
    description: 'Add your Charisma modifier to the damage rolls of one damage-dealing Warlock cantrip of your choice. Repeatable for a different eligible cantrip.',
  },
  {
    name: 'Armor of Shadows',
    levelAvailable: 1,
    description: 'You can cast Mage Armor on yourself without expending a spell slot.',
  },
  {
    name: 'Ascendant Step',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock',
    description: 'You can cast Levitate on yourself without expending a spell slot.',
  },
  {
    name: 'Devil’s Sight',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock',
    description: 'You can see normally in Dim Light and Darkness, both magical and nonmagical, within 120 feet of yourself.',
  },
  {
    name: 'Devouring Blade',
    levelAvailable: 12,
    prerequisite: 'Level 12+ Warlock, Thirsting Blade invocation',
    description: 'The Extra Attack granted by your Thirsting Blade invocation confers two extra attacks rather than one.',
  },
  {
    name: 'Eldritch Mind',
    levelAvailable: 1,
    description: 'You have Advantage on Constitution saving throws that you make to maintain Concentration.',
  },
  {
    name: 'Eldritch Smite',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock, Pact of the Blade invocation',
    description:
      'Once per turn when you hit a creature with your pact weapon, you can expend a Pact Magic spell slot to deal an extra 1d8 Force damage (plus 1d8 per slot level), and can knock the target Prone if it is Huge or smaller.',
  },
  {
    name: 'Eldritch Spear',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock, a Warlock cantrip that deals damage and has a range of 10+ feet',
    description: 'The range of one eligible damage-dealing cantrip increases by 30 feet times your Warlock level. Repeatable for a different eligible cantrip.',
  },
  {
    name: 'Fiendish Vigor',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock',
    description: 'You can cast False Life on yourself without expending a spell slot, always getting the maximum Temporary Hit Points.',
  },
  {
    name: 'Gaze of Two Minds',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock',
    description: 'As a Bonus Action, touch a willing creature to perceive through its senses until the end of your next turn, renewable each turn while connected.',
  },
  {
    name: 'Gift of the Depths',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock',
    description: 'You can breathe underwater and gain a Swim Speed equal to your Speed. You can also cast Water Breathing once per Long Rest without a spell slot.',
  },
  {
    name: 'Gift of the Protectors',
    levelAvailable: 9,
    prerequisite: 'Level 9+ Warlock, Pact of the Tome invocation',
    description: 'Creatures who write their name in your Book of Shadows drop to 1 Hit Point instead of 0 once, until you finish a Long Rest.',
  },
  {
    name: 'Investment of the Chain Master',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock, Pact of the Chain invocation',
    description: 'Your familiar (from Find Familiar) gains a Fly or Swim Speed of 40 feet, a Bonus Action attack, can deal Necrotic or Radiant damage, uses your spell save DC, and can gain Resistance from your Reaction.',
  },
  {
    name: 'Lessons of the First Ones',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock',
    description: 'You gain one Origin feat of your choice. Repeatable for a different Origin feat.',
  },
  {
    name: 'Lifedrinker',
    levelAvailable: 9,
    prerequisite: 'Level 9+ Warlock, Pact of the Blade invocation',
    description: 'Once per turn when you hit with your pact weapon, deal an extra 1d6 Necrotic, Psychic, or Radiant damage, and you can expend a Hit Die to heal yourself.',
  },
  {
    name: 'Mask of Many Faces',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock',
    description: 'You can cast Disguise Self without expending a spell slot.',
  },
  {
    name: 'Master of Myriad Forms',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock',
    description: 'You can cast Alter Self without expending a spell slot.',
  },
  {
    name: 'Misty Visions',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock',
    description: 'You can cast Silent Image without expending a spell slot.',
  },
  {
    name: 'One with Shadows',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock',
    description: 'While in Dim Light or Darkness, you can cast Invisibility on yourself without expending a spell slot.',
  },
  {
    name: 'Otherworldly Leap',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock',
    description: 'You can cast Jump on yourself without expending a spell slot.',
  },
  {
    name: 'Pact of the Blade',
    levelAvailable: 1,
    description:
      'As a Bonus Action, conjure a pact weapon (a Simple or Martial Melee weapon of your choice) or bond with a magic weapon you touch. You gain proficiency with it and can use Charisma for its attack and damage rolls, dealing Necrotic, Psychic, Radiant, or its normal damage type.',
  },
  {
    name: 'Pact of the Chain',
    levelAvailable: 1,
    description:
      "You learn Find Familiar and can cast it as a Magic action without a spell slot, with access to special familiar forms (Imp, Pseudodragon, Quasit, Skeleton, Sphinx of Wonder, Sprite, Venomous Snake). You can forgo an attack to let your familiar attack with its Reaction.",
  },
  {
    name: 'Pact of the Tome',
    levelAvailable: 1,
    description:
      'You conjure a Book of Shadows at the end of a rest, granting you three cantrips and two Ritual-tagged level 1 spells (from any class list) that you always have prepared as Warlock spells while the book is on your person.',
  },
  {
    name: 'Repelling Blast',
    levelAvailable: 2,
    prerequisite: 'Level 2+ Warlock, a Warlock cantrip that requires an attack roll',
    description: 'When you hit a Large or smaller creature with an eligible cantrip, you can push it up to 10 feet away. Repeatable for a different eligible cantrip.',
  },
  {
    name: 'Thirsting Blade',
    levelAvailable: 5,
    prerequisite: 'Level 5+ Warlock, Pact of the Blade invocation',
    description: 'You gain Extra Attack for your pact weapon only, attacking twice instead of once when you take the Attack action.',
  },
  {
    name: 'Visions of Distant Realms',
    levelAvailable: 9,
    prerequisite: 'Level 9+ Warlock',
    description: 'You can cast Arcane Eye without expending a spell slot.',
  },
  {
    name: 'Whispers of the Grave',
    levelAvailable: 7,
    prerequisite: 'Level 7+ Warlock',
    description: 'You can cast Speak with Dead without expending a spell slot.',
  },
  {
    name: 'Witch Sight',
    levelAvailable: 15,
    prerequisite: 'Level 15+ Warlock',
    description: 'You have Truesight with a range of 30 feet.',
  },
];

export const INVOCATION_NAMES: string[] = INVOCATIONS.map((i) => i.name);
export const INVOCATION_BY_NAME: Record<string, InvocationDef> = Object.fromEntries(
  INVOCATIONS.map((i) => [i.name, i]),
);

/** The subset selectable by a level-1 Warlock — no prerequisite at all, or
 * a prerequisite already satisfied at level 1. */
export const LEVEL_1_INVOCATIONS: InvocationDef[] = INVOCATIONS.filter((i) => i.levelAvailable === 1);
