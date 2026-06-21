import type { ClassDef } from '../types/content';

// Save proficiencies and skill-choice grants below are sourced from the 5e
// SRD (5esrd.com), cross-checked per-class directly against the official
// class pages. These are stable between the 2014 SRD and the 2024 PHB —
// only which source (class vs. background) grants *skills* changed in 2024,
// not the per-class lists or choice counts themselves. Three classes
// deviate from the common "choose 2" pattern: Bard (3, from any skill),
// Ranger (3), and Rogue (4).
export const CLASSES_DATA: ClassDef[] = [
  {
    name: 'Barbarian',
    hitDie: 12,
    weaponProficiencies: ['simple', 'martial'],
    saves: ['str', 'con'],
    skillChoices: {
      count: 2,
      options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    },
    packages: [
      { id: 'A', desc: '(A) Greataxe, 4 Handaxes, Explorer’s Pack, and 15 GP', items: { Greataxe: 1, Handaxe: 4, 'Explorer’s Pack': 1 }, gp: 15 },
      { id: 'B', desc: '(B) 75 GP', items: {}, gp: 75 },
    ],
    classFeatures1: {
      weaponMastery: { count: 2, pool: 'simpleOrMartialMelee' },
    },
  },
  {
    name: 'Bard',
    hitDie: 8,
    weaponProficiencies: ['simple'],
    saves: ['dex', 'cha'],
    skillChoices: { count: 3, options: 'any' },
    packages: [
      { id: 'A', desc: '(A) Leather Armor, 2 Daggers, Lute, Entertainer’s Pack, and 19 GP', items: { 'Leather Armor': 1, Dagger: 2, Lute: 1, 'Entertainer’s Pack': 1 }, gp: 19 },
      { id: 'B', desc: '(B) 90 GP', items: {}, gp: 90 },
    ],
  },
  {
    name: 'Cleric',
    hitDie: 8,
    weaponProficiencies: ['simple'],
    saves: ['wis', 'cha'],
    skillChoices: {
      count: 2,
      options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    },
    packages: [
      { id: 'A', desc: '(A) Chain Shirt, Shield, Mace, Holy Symbol, Priest’s Pack, and 7 GP', items: { 'Chain Shirt': 1, Shield: 1, Mace: 1, 'Holy Symbol': 1, 'Priest’s Pack': 1 }, gp: 7 },
      { id: 'B', desc: '(B) 110 GP', items: {}, gp: 110 },
    ],
    classFeatures1: {
      order: {
        label: 'Divine Order',
        options: [
          {
            name: 'Protector',
            description: 'Trained for battle, you gain proficiency with Martial weapons and training with Heavy armor.',
          },
          {
            name: 'Thaumaturge',
            description:
              'You know one extra cantrip from the Cleric spell list, and your mystical connection to the divine gives you a bonus (equal to your Wisdom modifier, minimum +1) to Intelligence (Arcana or Religion) checks.',
          },
        ],
      },
    },
  },
  {
    name: 'Druid',
    hitDie: 8,
    weaponProficiencies: ['simple'],
    saves: ['int', 'wis'],
    skillChoices: {
      count: 2,
      options: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    },
    packages: [
      { id: 'A', desc: '(A) Leather Armor, Shield, Sickle, Druidic Focus, Explorer’s Pack, Herbalism Kit, and 9 GP', items: { 'Leather Armor': 1, Shield: 1, Sickle: 1, 'Druidic Focus': 1, 'Explorer’s Pack': 1, 'Herbalism Kit': 1 }, gp: 9 },
      { id: 'B', desc: '(B) 50 GP', items: {}, gp: 50 },
    ],
    classFeatures1: {
      order: {
        label: 'Primal Order',
        options: [
          {
            name: 'Magician',
            description:
              'You know one extra cantrip from the Druid spell list, and your mystical connection to nature gives you a bonus (equal to your Wisdom modifier, minimum +1) to Intelligence (Arcana or Nature) checks.',
          },
          {
            name: 'Warden',
            description: 'Trained for battle, you gain proficiency with Martial weapons and training with Medium armor.',
          },
        ],
      },
    },
  },
  {
    name: 'Fighter',
    hitDie: 10,
    weaponProficiencies: ['simple', 'martial'],
    saves: ['str', 'con'],
    skillChoices: {
      count: 2,
      options: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    },
    packages: [
      { id: 'A', desc: '(A) Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer’s Pack, and 4 GP', items: { 'Chain Mail': 1, Greatsword: 1, Flail: 1, Javelin: 8, 'Dungeoneer’s Pack': 1 }, gp: 4 },
      { id: 'B', desc: '(B) Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer’s Pack, and 11 GP', items: { 'Studded Leather Armor': 1, Scimitar: 1, Shortsword: 1, Longbow: 1, Arrow: 20, Quiver: 1, 'Dungeoneer’s Pack': 1 }, gp: 11 },
      { id: 'C', desc: '(C) 155 GP', items: {}, gp: 155 },
    ],
    classFeatures1: {
      fightingStyle: true,
      weaponMastery: { count: 3, pool: 'simpleOrMartial' },
    },
  },
  {
    name: 'Monk',
    hitDie: 8,
    weaponProficiencies: ['simple', 'martialLight'],
    saves: ['str', 'dex'],
    skillChoices: {
      count: 2,
      options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    },
    packages: [
      { id: 'A', desc: '(A) Spear, 5 Daggers, Smith’s Tools, Explorer’s Pack, and 11 GP', items: { Spear: 1, Dagger: 5, "Smith's Tools": 1, 'Explorer’s Pack': 1 }, gp: 11 },
      { id: 'B', desc: '(B) 50 GP', items: {}, gp: 50 },
    ],
  },
  {
    name: 'Paladin',
    hitDie: 10,
    weaponProficiencies: ['simple', 'martial'],
    saves: ['wis', 'cha'],
    skillChoices: {
      count: 2,
      options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    },
    packages: [
      { id: 'A', desc: '(A) Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest’s Pack, and 9 GP', items: { 'Chain Mail': 1, Shield: 1, Longsword: 1, Javelin: 6, 'Holy Symbol': 1, 'Priest’s Pack': 1 }, gp: 9 },
      { id: 'B', desc: '(B) 150 GP', items: {}, gp: 150 },
    ],
    classFeatures1: {
      weaponMastery: { count: 2, pool: 'simpleOrMartial' },
    },
  },
  {
    name: 'Ranger',
    hitDie: 10,
    weaponProficiencies: ['simple', 'martial'],
    saves: ['str', 'dex'],
    skillChoices: {
      count: 3,
      options: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    },
    packages: [
      { id: 'A', desc: '(A) Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus, Explorer’s Pack, and 7 GP', items: { 'Studded Leather Armor': 1, Scimitar: 1, Shortsword: 1, Longbow: 1, Arrow: 20, Quiver: 1, 'Druidic Focus': 1, 'Explorer’s Pack': 1 }, gp: 7 },
      { id: 'B', desc: '(B) 150 GP', items: {}, gp: 150 },
    ],
    classFeatures1: {
      weaponMastery: { count: 2, pool: 'simpleOrMartial' },
    },
  },
  {
    name: 'Rogue',
    hitDie: 8,
    weaponProficiencies: ['simple', 'martialFinesseOrLight'],
    saves: ['dex', 'int'],
    skillChoices: {
      count: 4,
      options: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    },
    packages: [
      { id: 'A', desc: '(A) Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves’ Tools, Burglar’s Pack, and 8 GP', items: { 'Leather Armor': 1, Dagger: 2, Shortsword: 1, Shortbow: 1, Arrow: 20, Quiver: 1, 'Thieves’ Tools': 1, 'Burglar’s Pack': 1 }, gp: 8 },
      { id: 'B', desc: '(B) 100 GP', items: {}, gp: 100 },
    ],
    classFeatures1: {
      weaponMastery: { count: 2, pool: 'finesseOrLight' },
      expertise: { count: 2 },
    },
  },
  {
    name: 'Sorcerer',
    hitDie: 6,
    weaponProficiencies: ['simple'],
    saves: ['con', 'cha'],
    skillChoices: {
      count: 2,
      options: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    },
    packages: [
      { id: 'A', desc: '(A) Spear, 2 Daggers, Arcane Focus, Dungeoneer’s Pack, and 28 GP', items: { Spear: 1, Dagger: 2, 'Arcane Focus': 1, 'Dungeoneer’s Pack': 1 }, gp: 28 },
      { id: 'B', desc: '(B) 50 GP', items: {}, gp: 50 },
    ],
  },
  {
    name: 'Warlock',
    hitDie: 8,
    weaponProficiencies: ['simple'],
    saves: ['wis', 'cha'],
    skillChoices: {
      count: 2,
      options: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    },
    packages: [
      { id: 'A', desc: '(A) Leather Armor, Sickle, 2 Daggers, Arcane Focus, Book, Scholar’s Pack, and 15 GP', items: { 'Leather Armor': 1, Sickle: 1, Dagger: 2, 'Arcane Focus': 1, Book: 1, 'Scholar’s Pack': 1 }, gp: 15 },
      { id: 'B', desc: '(B) 100 GP', items: {}, gp: 100 },
    ],
    classFeatures1: {
      invocation: true,
    },
  },
  {
    name: 'Wizard',
    hitDie: 6,
    weaponProficiencies: ['simple'],
    saves: ['int', 'wis'],
    skillChoices: {
      count: 2,
      options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    },
    packages: [
      { id: 'A', desc: '(A) 2 Daggers, Arcane Focus, Robe, Spellbook, Scholar’s Pack, and 5 GP', items: { Dagger: 2, 'Arcane Focus': 1, Robe: 1, Spellbook: 1, 'Scholar’s Pack': 1 }, gp: 5 },
      { id: 'B', desc: '(B) 55 GP', items: {}, gp: 55 },
    ],
  },
];

export const CLASSES: string[] = CLASSES_DATA.map((c) => c.name);
