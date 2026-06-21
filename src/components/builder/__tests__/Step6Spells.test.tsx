import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step6Spells } from '../Step6Spells';
import { makeCharacter } from '../../../test/factories';
import type { Character } from '../../../types/character';

function renderStep6(initial: Partial<Character> = {}) {
  function Harness() {
    const [character, setCharacter] = useState<Character>(makeCharacter(initial));
    const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
    return <Step6Spells character={character} updateCharacter={updateCharacter} />;
  }
  return render(<Harness />);
}

describe('Step6Spells', () => {
  it('shows an empty-state message and no rows when there are no spells', () => {
    renderStep6();
    expect(screen.getByText(/No spells yet/)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Spell name')).not.toBeInTheDocument();
  });

  it('renders correctly for a character with no `spells` field at all (pre-existing/imported save)', () => {
    renderStep6({ spells: undefined });
    expect(screen.getByText(/No spells yet/)).toBeInTheDocument();
  });

  it('clicking "+ Add Spell" adds one empty, editable row', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));

    expect(screen.queryByText(/No spells yet/)).not.toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Spell name')).toHaveLength(1);
  });

  it('typing a spell name persists it back into character.spells', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));
    await user.type(screen.getByPlaceholderText('Spell name'), 'Fireball');

    expect(screen.getByPlaceholderText('Spell name')).toHaveValue('Fireball');
  });

  it('setting a level and toggling prepared both persist independently of the name', async () => {
    const user = userEvent.setup();
    renderStep6({ spells: [{ id: 'spell-1', name: 'Fireball' }] });

    await user.type(screen.getByPlaceholderText('Lvl'), '3');
    await user.click(screen.getByRole('checkbox', { name: 'Prepared' }));

    expect(screen.getByPlaceholderText('Lvl')).toHaveValue(3);
    expect(screen.getByRole('checkbox', { name: 'Prepared' })).toBeChecked();
    expect(screen.getByPlaceholderText('Spell name')).toHaveValue('Fireball');
  });

  it('level can be cleared back to empty (it is optional)', async () => {
    const user = userEvent.setup();
    renderStep6({ spells: [{ id: 'spell-1', name: 'Mage Hand', level: 0 }] });

    const levelInput = screen.getByPlaceholderText('Lvl');
    expect(levelInput).toHaveValue(0);

    await user.clear(levelInput);
    expect(levelInput).toHaveValue(null);
  });

  it('supports multiple independent spell rows', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));
    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));
    const nameInputs = screen.getAllByPlaceholderText('Spell name');
    expect(nameInputs).toHaveLength(2);

    await user.type(nameInputs[0], 'Fireball');
    await user.type(nameInputs[1], 'Shield');

    const updatedInputs = screen.getAllByPlaceholderText('Spell name');
    expect(updatedInputs[0]).toHaveValue('Fireball');
    expect(updatedInputs[1]).toHaveValue('Shield');
  });

  it('removing a spell row removes only that spell', async () => {
    const user = userEvent.setup();
    renderStep6({
      spells: [
        { id: 'spell-1', name: 'Fireball' },
        { id: 'spell-2', name: 'Shield' },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Remove Fireball' }));

    expect(screen.queryByDisplayValue('Fireball')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Shield')).toBeInTheDocument();
  });

  it('removing the last spell row shows the empty state again', async () => {
    const user = userEvent.setup();
    renderStep6({ spells: [{ id: 'spell-1', name: 'Fireball' }] });

    await user.click(screen.getByRole('button', { name: 'Remove Fireball' }));

    expect(screen.getByText(/No spells yet/)).toBeInTheDocument();
  });

  it('pre-populates rows from an existing character.spells, including level/prepared', () => {
    renderStep6({
      spells: [
        { id: 'spell-1', name: 'Eldritch Blast', level: 0, prepared: true },
        { id: 'spell-2', name: 'Hex', level: 1 },
      ],
    });

    expect(screen.getByDisplayValue('Eldritch Blast')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hex')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox', { name: 'Prepared' });
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });
});
