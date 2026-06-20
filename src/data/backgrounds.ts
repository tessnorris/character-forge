import type { BackgroundDef } from '../types/content';

// Sourced directly from the 2024 Player's Handbook (transcribed from the
// physical book). Each background's "(B) 50 GP" alternative equipment
// option is universal and so isn't duplicated per-entry here — only the
// "(A) ..." package is stored, matching how ClassDef.packages already
// represents class equipment choices.
export const BACKGROUNDS_DATA: BackgroundDef[] = [
  {
    name: 'Acolyte',
    abilities: ['Intelligence', 'Wisdom', 'Charisma'],
    feat: 'Magic Initiate (Cleric)',
    skills: ['Insight', 'Religion'],
    tool: "Calligrapher's Supplies",
    equipment: {
      id: 'A',
      desc: "(A) Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 pages), Robe, 8 GP",
      items: { "Calligrapher's Supplies": 1, Book: 1, 'Holy Symbol': 1, Parchment: 10, Robe: 1 },
      gp: 8,
    },
  },
  {
    name: 'Artisan',
    abilities: ['Strength', 'Dexterity', 'Intelligence'],
    feat: 'Crafter',
    skills: ['Investigation', 'Persuasion'],
    tool: "One kind of Artisan's Tools",
    equipment: {
      id: 'A',
      desc: "(A) Artisan's Tools (same as above), 2 Pouches, Traveler's Clothes, 32 GP",
      items: { "Artisan's Tools": 1, Pouch: 2, "Traveler's Clothes": 1 },
      gp: 32,
    },
  },
  {
    name: 'Charlatan',
    abilities: ['Dexterity', 'Constitution', 'Charisma'],
    feat: 'Skilled',
    skills: ['Deception', 'Sleight of Hand'],
    tool: 'Forgery Kit',
    equipment: {
      id: 'A',
      desc: '(A) Forgery Kit, Costume, Fine Clothes, 15 GP',
      items: { 'Forgery Kit': 1, Costume: 1, 'Fine Clothes': 1 },
      gp: 15,
    },
  },
  {
    name: 'Criminal',
    abilities: ['Dexterity', 'Constitution', 'Intelligence'],
    feat: 'Alert',
    skills: ['Sleight of Hand', 'Stealth'],
    tool: "Thieves' Tools",
    equipment: {
      id: 'A',
      desc: "(A) 2 Daggers, Thieves' Tools, Crowbar, 2 Pouches, Traveler's Clothes, 16 GP",
      items: { Dagger: 2, "Thieves' Tools": 1, Crowbar: 1, Pouch: 2, "Traveler's Clothes": 1 },
      gp: 16,
    },
  },
  {
    name: 'Entertainer',
    abilities: ['Strength', 'Dexterity', 'Charisma'],
    feat: 'Musician',
    skills: ['Acrobatics', 'Performance'],
    tool: 'One kind of musical instrument',
    equipment: {
      id: 'A',
      desc: "(A) Musical Instrument (same kind as above), 2 Costumes, Mirror, Perfume, Traveler's Clothes, 11 GP",
      items: { 'Musical Instrument': 1, Costume: 2, Mirror: 1, Perfume: 1, "Traveler's Clothes": 1 },
      gp: 11,
    },
  },
  {
    name: 'Farmer',
    abilities: ['Strength', 'Constitution', 'Wisdom'],
    feat: 'Tough',
    skills: ['Animal Handling', 'Nature'],
    tool: "Carpenter's Tools",
    equipment: {
      id: 'A',
      desc: "(A) Sickle, Carpenter's Tools, Healer's Kit, Iron Pot, Shovel, Traveler's Clothes, 30 GP",
      items: { Sickle: 1, "Carpenter's Tools": 1, "Healer's Kit": 1, 'Iron Pot': 1, Shovel: 1, "Traveler's Clothes": 1 },
      gp: 30,
    },
  },
  {
    name: 'Guard',
    abilities: ['Strength', 'Intelligence', 'Wisdom'],
    feat: 'Alert',
    skills: ['Athletics', 'Perception'],
    tool: 'One kind of Gaming Set',
    equipment: {
      id: 'A',
      desc: "(A) Spear, Light Crossbow, 20 Bolts, Gaming Set (same as above), Hooded Lantern, Manacles, Quiver, Traveler's Clothes, 12 GP",
      items: { Spear: 1, 'Light Crossbow': 1, Bolt: 20, 'Gaming Set': 1, 'Hooded Lantern': 1, Manacles: 1, Quiver: 1, "Traveler's Clothes": 1 },
      gp: 12,
    },
  },
  {
    name: 'Guide',
    abilities: ['Dexterity', 'Constitution', 'Wisdom'],
    feat: 'Magic Initiate (Druid)',
    skills: ['Stealth', 'Survival'],
    tool: "Cartographer's Tools",
    equipment: {
      id: 'A',
      desc: "(A) Shortbow, 20 Arrows, Cartographer's Tools, Bedroll, Quiver, Tent, Traveler's Clothes, 3 GP",
      items: { Shortbow: 1, Arrow: 20, "Cartographer's Tools": 1, Bedroll: 1, Quiver: 1, Tent: 1, "Traveler's Clothes": 1 },
      gp: 3,
    },
  },
  {
    name: 'Hermit',
    abilities: ['Constitution', 'Wisdom', 'Charisma'],
    feat: 'Healer',
    skills: ['Medicine', 'Religion'],
    tool: 'Herbalism Kit',
    equipment: {
      id: 'A',
      desc: "(A) Quarterstaff, Herbalism Kit, Bedroll, Book (philosophy), Lamp, Oil (3 flasks), Traveler's Clothes, 16 GP",
      items: { Quarterstaff: 1, 'Herbalism Kit': 1, Bedroll: 1, Book: 1, Lamp: 1, Oil: 3, "Traveler's Clothes": 1 },
      gp: 16,
    },
  },
  {
    name: 'Merchant',
    abilities: ['Constitution', 'Intelligence', 'Wisdom'],
    feat: 'Lucky',
    skills: ['Animal Handling', 'Persuasion'],
    tool: "Navigator's Tools",
    equipment: {
      id: 'A',
      desc: "(A) Navigator's Tools, 2 Pouches, Traveler's Clothes, 22 GP",
      items: { "Navigator's Tools": 1, Pouch: 2, "Traveler's Clothes": 1 },
      gp: 22,
    },
  },
  {
    name: 'Noble',
    abilities: ['Strength', 'Intelligence', 'Charisma'],
    feat: 'Skilled',
    skills: ['History', 'Persuasion'],
    tool: 'One kind of Gaming Set',
    equipment: {
      id: 'A',
      desc: '(A) Gaming Set (same as above), Fine Clothes, Perfume, 29 GP',
      items: { 'Gaming Set': 1, 'Fine Clothes': 1, Perfume: 1 },
      gp: 29,
    },
  },
  {
    name: 'Sage',
    abilities: ['Constitution', 'Intelligence', 'Wisdom'],
    feat: 'Magic Initiate (Wizard)',
    skills: ['Arcana', 'History'],
    tool: "Calligrapher's Supplies",
    equipment: {
      id: 'A',
      desc: "(A) Quarterstaff, Calligrapher's Supplies, Book (history), Parchment (8 sheets), Robe, 8 GP",
      items: { Quarterstaff: 1, "Calligrapher's Supplies": 1, Book: 1, Parchment: 8, Robe: 1 },
      gp: 8,
    },
  },
  {
    name: 'Sailor',
    abilities: ['Strength', 'Dexterity', 'Wisdom'],
    feat: 'Tavern Brawler',
    skills: ['Acrobatics', 'Perception'],
    tool: "Navigator's Tools",
    equipment: {
      id: 'A',
      desc: "(A) Dagger, Navigator's Tools, Rope, Traveler's Clothes, 20 GP",
      items: { Dagger: 1, "Navigator's Tools": 1, Rope: 1, "Traveler's Clothes": 1 },
      gp: 20,
    },
  },
  {
    name: 'Scribe',
    abilities: ['Dexterity', 'Intelligence', 'Wisdom'],
    feat: 'Skilled',
    skills: ['Investigation', 'Perception'],
    tool: "Calligrapher's Supplies",
    equipment: {
      id: 'A',
      desc: "(A) Calligrapher's Supplies, Fine Clothes, Lamp, Oil, Parchment (12 sheets), 23 GP",
      items: { "Calligrapher's Supplies": 1, 'Fine Clothes': 1, Lamp: 1, Oil: 1, Parchment: 12 },
      gp: 23,
    },
  },
  {
    name: 'Soldier',
    abilities: ['Strength', 'Dexterity', 'Constitution'],
    feat: 'Savage Attacker',
    skills: ['Athletics', 'Intimidation'],
    tool: 'One kind of Gaming Set',
    equipment: {
      id: 'A',
      desc: "(A) Spear, Shortbow, 20 Arrows, Gaming Set (same as above), Healer's Kit, Quiver, Traveler's Clothes, 14 GP",
      items: { Spear: 1, Shortbow: 1, Arrow: 20, 'Gaming Set': 1, "Healer's Kit": 1, Quiver: 1, "Traveler's Clothes": 1 },
      gp: 14,
    },
  },
  {
    name: 'Wayfarer',
    abilities: ['Dexterity', 'Wisdom', 'Charisma'],
    feat: 'Lucky',
    skills: ['Insight', 'Stealth'],
    tool: "Thieves' Tools",
    equipment: {
      id: 'A',
      desc: "(A) 2 Daggers, Thieves' Tools, Gaming Set (any), Bedroll, 2 Pouches, Traveler's Clothes, 16 GP",
      items: { Dagger: 2, "Thieves' Tools": 1, 'Gaming Set': 1, Bedroll: 1, Pouch: 2, "Traveler's Clothes": 1 },
      gp: 16,
    },
  },
];

/** Background names in book order, for use in <select> options etc. */
export const BACKGROUND_NAMES: string[] = BACKGROUNDS_DATA.map((b) => b.name);

export const BACKGROUNDS_BY_NAME: Record<string, BackgroundDef> = Object.fromEntries(
  BACKGROUNDS_DATA.map((b) => [b.name, b]),
);

// Back-compat shape used by existing Step2Background / derive.ts code: just
// the ability triples, keyed by name. New code should prefer
// BACKGROUNDS_BY_NAME for full background data (feat/skills/tool/equipment).
export const BACKGROUNDS: Record<string, BackgroundDef['abilities']> = Object.fromEntries(
  BACKGROUNDS_DATA.map((b) => [b.name, b.abilities]),
);
