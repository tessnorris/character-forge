import type { Character } from '../../types/character';

export interface StepProps {
  character: Character;
  updateCharacter: (patch: Partial<Character>) => void;
}

export const STEPS = [
  { n: 1, label: 'Identity' },
  { n: 2, label: 'Background' },
  { n: 3, label: 'Abilities' },
  { n: 4, label: 'Equipment' },
  { n: 5, label: 'Summary' },
] as const;
