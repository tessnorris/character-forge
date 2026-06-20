import type { Character, Combatant } from '../types/character';
import { uid } from '../engine/dice';

/** Build a minimal valid Character for tests, with any fields overridden.
 * Centralizing this means when `Character` gains new required-by-convention
 * fields later (skills, spells, etc.), only this factory needs updating —
 * not every test file. */
export function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: uid(),
    name: 'Test Hero',
    charClass: '',
    species: '',
    background: '',
    bonusType: '2-1',
    bonus2: '',
    bonus1: '',
    baseScores: null,
    equipmentPackageId: null,
    purchasedItems: {},
    ...overrides,
  };
}

export function makeCombatant(overrides: Partial<Combatant> = {}): Combatant {
  return {
    id: uid(),
    name: 'Test Combatant',
    init: 10,
    dex: 10,
    ac: 10,
    hp: 10,
    tieHistory: [],
    ...overrides,
  };
}
