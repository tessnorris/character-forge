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

/** Free-text "flavor" fields — not used in any rules calculation, just
 * notes the player records about who their character is. Grouped together
 * (rather than flattened onto Character) so this can grow independently as
 * more categories are added, and so older saves only need one optional
 * field defaulted rather than several. */
export interface CharacterDetails {
  backgroundDescription: string; // backstory / how they got here
  physicalDescription: string; // appearance
  personality: string; // traits, ideals, bonds, flaws — free-form for now
  notes: string; // anything else (DM notes, reminders, etc.)
}

export const emptyCharacterDetails = (): CharacterDetails => ({
  backgroundDescription: '',
  physicalDescription: '',
  personality: '',
  notes: '',
});

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

  // Step 5 — Free-text flavor fields. Optional so older persisted/imported
  // characters (saved before this field existed) still parse; components
  // reading this should fall back to emptyCharacterDetails().
  details?: CharacterDetails;

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
