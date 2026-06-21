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

/** One entry in a character's free-text spell list — just a name, with
 * optional level and prepared flags. Deliberately not tied to any spell
 * compendium/catalog: the user types the name in directly, the same way
 * CustomEquipmentItem lets a player record gear without it being in the
 * shop catalog. `id` is for React keys and row add/remove, not a lookup
 * key into any data file. */
export interface SpellEntry {
  id: string;
  name: string;
  level?: number; // 0 for cantrip, 1-9 for leveled spells; omitted if not tracked
  prepared?: boolean;
}

export interface Character {
  id: string;

  // Step 1 — Identity
  name: string;
  charClass: string;
  species: string;

  // Step 2 — Class features (skills + class-specific level-1 choices).
  // All optional/defaulted so older saved/imported characters (from before
  // this step existed) still parse without a migration.
  classSkills?: string[]; // class skill-choice picks (background's 2 fixed skills are derived, not stored here)
  weaponMastery?: string[]; // chosen weapon names for classes with Weapon Mastery
  fightingStyle?: string; // chosen Fighting Style name (Fighter only at level 1)
  classOrder?: string; // chosen Order option name (Cleric's Divine Order / Druid's Primal Order)
  expertise?: string[]; // chosen skills for Rogue's Expertise (must be a subset of the character's proficient skills)
  invocation?: string; // chosen level-1 Eldritch Invocation name (Warlock only)

  // Step 3 — Species features (ancestry/lineage choice, bonus skill/feat).
  // All optional/defaulted so older saved/imported characters still parse.
  speciesAncestry?: string; // chosen Draconic/Giant Ancestry name (Dragonborn/Goliath)
  speciesLineage?: string; // chosen Lineage/Legacy option name (Elf/Gnome/Tiefling)
  lineageSpellcastingAbility?: string; // chosen spellcasting ability for lineage spells ('int' | 'wis' | 'cha')
  speciesBonusSkill?: string; // chosen bonus skill (Elf's 3-option pick, or Human's any-skill pick)
  speciesBonusFeat?: string; // chosen bonus Origin feat (Human only)

  // Step 4 — Background
  background: string;
  bonusType: BonusType;
  bonus2: string; // ability name receiving +2 (bonusType === '2-1')
  bonus1: string; // ability name receiving +1

  // Step 5 — Abilities
  baseScores: Record<string, number> | null; // ability name -> rolled score
  rollerState?: RollerState;

  // Step 6 — Equipment
  equipmentPackageId: string | null;
  purchasedItems: Record<string, number>; // shop item name -> quantity
  /** Names of items the player has marked as equipped (worn armor/shield,
   * wielded weapons). Drives AC on the derived sheet and the "equipped" flag
   * on weapon attack lines. Optional/defaulted so older saves still parse. */
  equipped?: string[];

  // Step 7 — Spell list (simple name entry, no compendium) and free-text
  // flavor fields. Both optional so older persisted/imported characters
  // (saved before these fields existed) still parse; components reading
  // them should fall back to an empty array / emptyCharacterDetails().
  spells?: SpellEntry[];
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
