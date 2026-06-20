import type { BackgroundDef } from '../types/content';

export const BACKGROUNDS: Record<string, BackgroundDef['abilities']> = {
  Acolyte: ['Intelligence', 'Wisdom', 'Charisma'],
  Artisan: ['Strength', 'Dexterity', 'Intelligence'],
  Charlatan: ['Dexterity', 'Constitution', 'Charisma'],
  Criminal: ['Dexterity', 'Constitution', 'Intelligence'],
  Entertainer: ['Strength', 'Dexterity', 'Charisma'],
  Farmer: ['Strength', 'Constitution', 'Wisdom'],
  Guard: ['Strength', 'Intelligence', 'Wisdom'],
  Hermit: ['Constitution', 'Wisdom', 'Charisma'],
  Merchant: ['Constitution', 'Intelligence', 'Wisdom'],
  Noble: ['Strength', 'Intelligence', 'Charisma'],
  Sage: ['Constitution', 'Intelligence', 'Wisdom'],
  Sailor: ['Strength', 'Dexterity', 'Wisdom'],
  Scribe: ['Dexterity', 'Intelligence', 'Wisdom'],
  Soldier: ['Strength', 'Dexterity', 'Constitution'],
  Wayfarer: ['Dexterity', 'Wisdom', 'Charisma'],
};
