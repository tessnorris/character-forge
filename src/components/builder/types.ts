import type { Character } from '../../types/character';

export interface StepProps {
  character: Character;
  updateCharacter: (patch: Partial<Character>) => void;
}

export const STEPS = [
  { n: 1, label: 'Identity' },
  { n: 2, label: 'Class' },
  { n: 3, label: 'Species' },
  { n: 4, label: 'Background' },
  { n: 5, label: 'Abilities' },
  { n: 6, label: 'Equipment' },
  { n: 7, label: 'Summary' },
] as const;
