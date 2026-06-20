import type { AbilityDef } from '../types/content';

export const ABILITIES: AbilityDef[] = [
  { id: 'str', name: 'Strength', short: 'STR', icon: '💪', badge: 'bg-red-900/60 text-red-200 border-red-700' },
  { id: 'dex', name: 'Dexterity', short: 'DEX', icon: '🤸', badge: 'bg-green-900/60 text-green-200 border-green-700' },
  { id: 'con', name: 'Constitution', short: 'CON', icon: '🛡️', badge: 'bg-orange-900/60 text-orange-200 border-orange-700' },
  { id: 'int', name: 'Intelligence', short: 'INT', icon: '🧠', badge: 'bg-blue-900/60 text-blue-200 border-blue-700' },
  { id: 'wis', name: 'Wisdom', short: 'WIS', icon: '🦉', badge: 'bg-indigo-900/60 text-indigo-200 border-indigo-700' },
  { id: 'cha', name: 'Charisma', short: 'CHA', icon: '🎭', badge: 'bg-purple-900/60 text-purple-200 border-purple-700' },
];

export const ABILITY_NAMES: string[] = ABILITIES.map((a) => a.name);
export const ABILITY_BY_NAME: Record<string, AbilityDef> = Object.fromEntries(
  ABILITIES.map((a) => [a.name, a]),
);
export const ABILITY_BY_ID: Record<string, AbilityDef> = Object.fromEntries(
  ABILITIES.map((a) => [a.id, a]),
);
