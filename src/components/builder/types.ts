import type { Character } from '../../types/character';

export interface StepProps {
  character: Character;
  updateCharacter: (patch: Partial<Character>) => void;
}

export const STEPS = [
  { n: 1, label: 'Identity' },
  { n: 2, label: 'Background' },
  { n: 3, label: 'Class' },
  { n: 4, label: 'Abilities' },
  { n: 5, label: 'Equipment' },
  { n: 6, label: 'Summary' },
] as const;
