import type { SkillDef } from '../types/content';

/** The 18 standard D&D skills, each tied to the ability used for its checks.
 * Stable across the 2014 SRD and 2024 PHB — only which source (class vs.
 * background) grants them changed between editions, not the list itself. */
export const SKILLS: SkillDef[] = [
  { name: 'Acrobatics', ability: 'dex' },
  { name: 'Animal Handling', ability: 'wis' },
  { name: 'Arcana', ability: 'int' },
  { name: 'Athletics', ability: 'str' },
  { name: 'Deception', ability: 'cha' },
  { name: 'History', ability: 'int' },
  { name: 'Insight', ability: 'wis' },
  { name: 'Intimidation', ability: 'cha' },
  { name: 'Investigation', ability: 'int' },
  { name: 'Medicine', ability: 'wis' },
  { name: 'Nature', ability: 'int' },
  { name: 'Perception', ability: 'wis' },
  { name: 'Performance', ability: 'cha' },
  { name: 'Persuasion', ability: 'cha' },
  { name: 'Religion', ability: 'int' },
  { name: 'Sleight of Hand', ability: 'dex' },
  { name: 'Stealth', ability: 'dex' },
  { name: 'Survival', ability: 'wis' },
];

export const SKILL_NAMES: string[] = SKILLS.map((s) => s.name);
export const SKILL_BY_NAME: Record<string, SkillDef> = Object.fromEntries(
  SKILLS.map((s) => [s.name, s]),
);
