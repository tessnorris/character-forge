import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step1Identity } from '../Step1Identity';
import { makeCharacter } from '../../../test/factories';
import { NAMES } from '../../../data/names';
import type { Character } from '../../../types/character';

function renderStep(initial: Partial<Character> = {}) {
  function Harness() {
    const [character, setCharacter] = useState<Character>(makeCharacter(initial));
    const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
    return <Step1Identity character={character} updateCharacter={updateCharacter} />;
  }
  return render(<Harness />);
}

describe('Step1Identity — gender selector', () => {
  it('renders the three gender options', () => {
    renderStep();
    expect(screen.getByRole('button', { name: /^Male$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Non-binary/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Female$/ })).toBeInTheDocument();
  });

  it('selecting a gender marks it pressed; clicking again clears it', async () => {
    const user = userEvent.setup();
    renderStep();

    const female = screen.getByRole('button', { name: /^Female$/ });
    expect(female).toHaveAttribute('aria-pressed', 'false');

    await user.click(female);
    expect(female).toHaveAttribute('aria-pressed', 'true');

    await user.click(female);
    expect(female).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('Step1Identity — name suggester', () => {
  it('is disabled until a species with name data is chosen', () => {
    renderStep();
    expect(screen.getByRole('button', { name: 'Suggest a name' })).toBeDisabled();
  });

  it('fills the name field with a species-appropriate name when clicked', async () => {
    const user = userEvent.setup();
    renderStep({ species: 'Elf', gender: 'male', name: '' });

    const input = screen.getByLabelText('Character Name') as HTMLInputElement;
    expect(input.value).toBe('');

    await user.click(screen.getByRole('button', { name: 'Suggest a name' }));

    const [first, ...rest] = input.value.split(' ');
    expect(NAMES.Elf.first.male).toContain(first);
    expect(NAMES.Elf.last).toContain(rest.join(' '));
  });

  it('respects the selected gender when suggesting', async () => {
    const user = userEvent.setup();
    renderStep({ species: 'Tiefling', gender: 'female' });

    await user.click(screen.getByRole('button', { name: 'Suggest a name' }));

    const input = screen.getByLabelText('Character Name') as HTMLInputElement;
    const first = input.value.split(' ')[0];
    expect(NAMES.Tiefling.first.female).toContain(first);
  });
});
