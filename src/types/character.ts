/**
 * Types describing *character state* — what gets saved to localStorage,
 * exported/imported as JSON, and edited by the builder UI.
 */

export type BonusType = '2-1' | '1-1-1';

/** Working state of the ability-score roller (Step 3), persisted so
 * navigating back to the step restores it instead of losing progress. */
export interface RollerState {
  numDice: number;
  rerollThreshold: number;
  poolSize: number;
  mode: 'strict' | 'manual';
  phase: 'config' | 'rolling' | 'result';
  generatedScores: GeneratedScore[];
  assignments: Record<string, string>; // abilityId -> generatedScore.id
}

export interface GeneratedScore {
  id: string;
  sum: number;
  rolls: number[];
  kept: number[];
}

export interface Character {
  id: string;

  // Step 1 — Identity
  name: string;
  charClass: string;
  species: string;

  // Step 2 — Background
  background: string;
  bonusType: BonusType;
  bonus2: string; // ability name receiving +2 (bonusType === '2-1')
  bonus1: string; // ability name receiving +1

  // Step 3 — Abilities
  baseScores: Record<string, number> | null; // ability name -> rolled score
  rollerState?: RollerState;

  // Step 4 — Equipment
  equipmentPackageId: string | null;
  purchasedItems: Record<string, number>; // shop item name -> quantity

  savedAt?: number; // epoch ms, set when saved to the roster
}

/** A row in the Initiative Tracker — either a saved PC or an ad-hoc NPC/monster. */
export interface Combatant {
  id: string;
  name: string;
  init: number;
  dex: number;
  ac: number;
  hp: number;
  tieHistory: number[];
  isPC?: boolean;
}
