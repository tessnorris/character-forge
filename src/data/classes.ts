import type { ClassDef } from '../types/content';

export const CLASSES_DATA: ClassDef[] = [
  {
    name: 'Barbarian',
    packages: [
      { id: 'A', desc: '(A) Greataxe, 4 Handaxes, Explorer’s Pack, and 15 GP', items: { Greataxe: 1, Handaxe: 4, 'Explorer’s Pack': 1 }, gp: 15 },
      { id: 'B', desc: '(B) 75 GP', items: {}, gp: 75 },
    ],
  },
  {
    name: 'Bard',
    packages: [
      { id: 'A', desc: '(A) Leather Armor, 2 Daggers, Lute, Entertainer’s Pack, and 19 GP', items: { 'Leather Armor': 1, Dagger: 2, Lute: 1, 'Entertainer’s Pack': 1 }, gp: 19 },
      { id: 'B', desc: '(B) 90 GP', items: {}, gp: 90 },
    ],
  },
  {
    name: 'Cleric',
    packages: [
      { id: 'A', desc: '(A) Chain Shirt, Shield, Mace, Holy Symbol, Priest’s Pack, and 7 GP', items: { 'Chain Shirt': 1, Shield: 1, Mace: 1, 'Holy Symbol': 1, 'Priest’s Pack': 1 }, gp: 7 },
      { id: 'B', desc: '(B) 110 GP', items: {}, gp: 110 },
    ],
  },
  {
    name: 'Druid',
    packages: [
      { id: 'A', desc: '(A) Leather Armor, Shield, Sickle, Druidic Focus, Explorer’s Pack, Herbalism Kit, and 9 GP', items: { 'Leather Armor': 1, Shield: 1, Sickle: 1, 'Druidic Focus': 1, 'Explorer’s Pack': 1, 'Herbalism Kit': 1 }, gp: 9 },
      { id: 'B', desc: '(B) 50 GP', items: {}, gp: 50 },
    ],
  },
  {
    name: 'Fighter',
    packages: [
      { id: 'A', desc: '(A) Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer’s Pack, and 4 GP', items: { 'Chain Mail': 1, Greatsword: 1, Flail: 1, Javelin: 8, 'Dungeoneer’s Pack': 1 }, gp: 4 },
      { id: 'B', desc: '(B) Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer’s Pack, and 11 GP', items: { 'Studded Leather Armor': 1, Scimitar: 1, Shortsword: 1, Longbow: 1, Arrow: 20, Quiver: 1, 'Dungeoneer’s Pack': 1 }, gp: 11 },
      { id: 'C', desc: '(C) 155 GP', items: {}, gp: 155 },
    ],
  },
  {
    name: 'Monk',
    packages: [
      { id: 'A', desc: '(A) Spear, 5 Daggers, Smith’s Tools, Explorer’s Pack, and 11 GP', items: { Spear: 1, Dagger: 5, "Smith's Tools": 1, 'Explorer’s Pack': 1 }, gp: 11 },
      { id: 'B', desc: '(B) 50 GP', items: {}, gp: 50 },
    ],
  },
  {
    name: 'Paladin',
    packages: [
      { id: 'A', desc: '(A) Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest’s Pack, and 9 GP', items: { 'Chain Mail': 1, Shield: 1, Longsword: 1, Javelin: 6, 'Holy Symbol': 1, 'Priest’s Pack': 1 }, gp: 9 },
      { id: 'B', desc: '(B) 150 GP', items: {}, gp: 150 },
    ],
  },
  {
    name: 'Ranger',
    packages: [
      { id: 'A', desc: '(A) Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus, Explorer’s Pack, and 7 GP', items: { 'Studded Leather Armor': 1, Scimitar: 1, Shortsword: 1, Longbow: 1, Arrow: 20, Quiver: 1, 'Druidic Focus': 1, 'Explorer’s Pack': 1 }, gp: 7 },
      { id: 'B', desc: '(B) 150 GP', items: {}, gp: 150 },
    ],
  },
  {
    name: 'Rogue',
    packages: [
      { id: 'A', desc: '(A) Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves’ Tools, Burglar’s Pack, and 8 GP', items: { 'Leather Armor': 1, Dagger: 2, Shortsword: 1, Shortbow: 1, Arrow: 20, Quiver: 1, 'Thieves’ Tools': 1, 'Burglar’s Pack': 1 }, gp: 8 },
      { id: 'B', desc: '(B) 100 GP', items: {}, gp: 100 },
    ],
  },
  {
    name: 'Sorcerer',
    packages: [
      { id: 'A', desc: '(A) Spear, 2 Daggers, Arcane Focus, Dungeoneer’s Pack, and 28 GP', items: { Spear: 1, Dagger: 2, 'Arcane Focus': 1, 'Dungeoneer’s Pack': 1 }, gp: 28 },
      { id: 'B', desc: '(B) 50 GP', items: {}, gp: 50 },
    ],
  },
  {
    name: 'Warlock',
    packages: [
      { id: 'A', desc: '(A) Leather Armor, Sickle, 2 Daggers, Arcane Focus, Book, Scholar’s Pack, and 15 GP', items: { 'Leather Armor': 1, Sickle: 1, Dagger: 2, 'Arcane Focus': 1, Book: 1, 'Scholar’s Pack': 1 }, gp: 15 },
      { id: 'B', desc: '(B) 100 GP', items: {}, gp: 100 },
    ],
  },
  {
    name: 'Wizard',
    packages: [
      { id: 'A', desc: '(A) 2 Daggers, Arcane Focus, Robe, Spellbook, Scholar’s Pack, and 5 GP', items: { Dagger: 2, 'Arcane Focus': 1, Robe: 1, Spellbook: 1, 'Scholar’s Pack': 1 }, gp: 5 },
      { id: 'B', desc: '(B) 55 GP', items: {}, gp: 55 },
    ],
  },
];

export const CLASSES: string[] = CLASSES_DATA.map((c) => c.name);
