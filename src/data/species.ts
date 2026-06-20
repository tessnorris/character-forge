import type { SpeciesDef } from '../types/content';

// Sourced from the user's own notes on the 2024 PHB species. Dwarf,
// Halfling, and Orc have no level-1 choice beyond their fixed traits, so
// they carry no speciesFeatures1. Aasimar's traits weren't covered in the
// provided list either, so it's included as choice-free for now; revisit
// if that turns out to be wrong.
export const SPECIES_DATA: SpeciesDef[] = [
  { name: 'Aasimar' },
  {
    name: 'Dragonborn',
    speciesFeatures1: {
      ancestry: {
        label: 'Draconic Ancestry',
        options: [
          { name: 'Black', description: 'Your Breath Weapon and resistance are Acid.' },
          { name: 'Blue', description: 'Your Breath Weapon and resistance are Lightning.' },
          { name: 'Brass', description: 'Your Breath Weapon and resistance are Fire.' },
          { name: 'Bronze', description: 'Your Breath Weapon and resistance are Lightning.' },
          { name: 'Copper', description: 'Your Breath Weapon and resistance are Acid.' },
          { name: 'Gold', description: 'Your Breath Weapon and resistance are Fire.' },
          { name: 'Green', description: 'Your Breath Weapon and resistance are Poison.' },
          { name: 'Red', description: 'Your Breath Weapon and resistance are Fire.' },
          { name: 'Silver', description: 'Your Breath Weapon and resistance are Cold.' },
          { name: 'White', description: 'Your Breath Weapon and resistance are Cold.' },
        ],
      },
    },
  },
  { name: 'Dwarf' },
  {
    name: 'Elf',
    speciesFeatures1: {
      lineage: {
        label: 'Elven Lineage',
        spellcastingAbilityOptions: ['int', 'wis', 'cha'],
        options: [
          {
            name: 'Drow',
            traitDescription: "Your Darkvision range increases to 120 feet.",
            grants: [
              { level: 1, name: 'Dancing Lights', description: 'Known cantrip.' },
              { level: 3, name: 'Faerie Fire', description: 'Castable once per Long Rest without a spell slot.' },
              { level: 5, name: 'Darkness', description: 'Castable once per Long Rest without a spell slot.' },
            ],
          },
          {
            name: 'High Elf',
            traitDescription: 'After each Long Rest, you can swap your known cantrip for a different one from the Wizard spell list.',
            grants: [
              { level: 1, name: 'Prestidigitation', description: 'Known cantrip (swappable after each Long Rest).' },
              { level: 3, name: 'Detect Magic', description: 'Castable once per Long Rest without a spell slot.' },
              { level: 5, name: 'Misty Step', description: 'Castable once per Long Rest without a spell slot.' },
            ],
          },
          {
            name: 'Wood Elf',
            traitDescription: 'Your Speed increases to 35 feet.',
            grants: [
              { level: 1, name: 'Druidcraft', description: 'Known cantrip.' },
              { level: 3, name: 'Longstrider', description: 'Castable once per Long Rest without a spell slot.' },
              { level: 5, name: 'Pass without Trace', description: 'Castable once per Long Rest without a spell slot.' },
            ],
          },
        ],
      },
      bonusSkillOptions: ['Insight', 'Perception', 'Survival'],
    },
  },
  {
    name: 'Gnome',
    speciesFeatures1: {
      // Unlike Elf/Tiefling, the user's notes only listed a level-1 trait +
      // cantrip per Gnomish lineage — no level-3/5 spell. Each option's
      // `grants` array therefore holds just the one level-1 entry.
      lineage: {
        label: 'Gnomish Lineage',
        spellcastingAbilityOptions: ['int', 'wis', 'cha'],
        options: [
          {
            name: 'Forest Gnome',
            traitDescription: 'You can cast Speak with Animals a number of times equal to your Proficiency Bonus, regaining all uses on a Long Rest.',
            grants: [{ level: 1, name: 'Minor Illusion', description: 'Known cantrip.' }],
          },
          {
            name: 'Rock Gnome',
            traitDescription: "You can use Tinker's Tools to create a tiny clockwork device (see the species's Tinker trait for details).",
            grants: [{ level: 1, name: 'Mending', description: 'Known cantrip.' }],
          },
        ],
      },
    },
  },
  {
    name: 'Goliath',
    speciesFeatures1: {
      ancestry: {
        label: 'Giant Ancestry',
        options: [
          { name: 'Cloud Giant', description: "Cloud's Jaunt — teleport a short distance as a Bonus Action a number of times equal to your Proficiency Bonus, regaining uses on a Long Rest." },
          { name: 'Fire Giant', description: "Fire's Burn — deal extra Fire damage once per turn when you hit with an attack, usable a number of times equal to your Proficiency Bonus." },
          { name: 'Frost Giant', description: "Frost's Chill — deal extra Cold damage and reduce a target's Speed once per turn when you hit with an attack." },
          { name: 'Hill Giant', description: "Hill's Tumble — force a Large or smaller creature you hit to make a Strength save or fall Prone." },
          { name: 'Stone Giant', description: "Stone's Endurance — reduce incoming damage once per turn by expending the trait's uses plus a roll." },
          { name: 'Storm Giant', description: "Storm's Thunder — deal extra Thunder damage once per turn when you hit with an attack." },
        ],
      },
    },
  },
  { name: 'Halfling' },
  {
    name: 'Human',
    speciesFeatures1: {
      bonusSkillOptions: 'any',
      bonusFeat: true,
    },
  },
  { name: 'Orc' },
  {
    name: 'Tiefling',
    speciesFeatures1: {
      lineage: {
        label: 'Fiendish Legacy',
        spellcastingAbilityOptions: ['int', 'wis', 'cha'],
        options: [
          {
            name: 'Abyssal',
            traitDescription: 'You have Resistance to Poison damage.',
            grants: [
              { level: 1, name: 'Poison Spray', description: 'Known cantrip.' },
              { level: 3, name: 'Ray of Sickness', description: 'Castable once per Long Rest without a spell slot.' },
              { level: 5, name: 'Hold Person', description: 'Castable once per Long Rest without a spell slot.' },
            ],
          },
          {
            name: 'Chthonic',
            traitDescription: 'You have Resistance to Necrotic damage.',
            grants: [
              { level: 1, name: 'Chill Touch', description: 'Known cantrip.' },
              { level: 3, name: 'False Life', description: 'Castable once per Long Rest without a spell slot.' },
              { level: 5, name: 'Ray of Enfeeblement', description: 'Castable once per Long Rest without a spell slot.' },
            ],
          },
          {
            name: 'Infernal',
            traitDescription: 'You have Resistance to Fire damage.',
            grants: [
              { level: 1, name: 'Fire Bolt', description: 'Known cantrip.' },
              { level: 3, name: 'Hellish Rebuke', description: 'Castable once per Long Rest without a spell slot.' },
              { level: 5, name: 'Darkness', description: 'Castable once per Long Rest without a spell slot.' },
            ],
          },
        ],
      },
    },
  },
];

export const SPECIES: string[] = SPECIES_DATA.map((s) => s.name);
export const SPECIES_BY_NAME: Record<string, SpeciesDef> = Object.fromEntries(
  SPECIES_DATA.map((s) => [s.name, s]),
);
