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

describe('Step6Spells — shared empty state', () => {
  it('shows both empty-state messages and no rows when there are no entries at all', () => {
    renderStep6();
    expect(screen.getByText('No cantrips yet.')).toBeInTheDocument();
    expect(screen.getByText('No spells yet.')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Cantrip name')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Spell name')).not.toBeInTheDocument();
  });

  it('renders correctly for a character with no `spells` field at all (pre-existing/imported save)', () => {
    renderStep6({ spells: undefined });
    expect(screen.getByText('No cantrips yet.')).toBeInTheDocument();
    expect(screen.getByText('No spells yet.')).toBeInTheDocument();
  });
});

describe('Step6Spells — Cantrips section', () => {
  it('clicking "+ Add Cantrip" adds one name-only row, with no prepared field', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Cantrip' }));

    expect(screen.queryByText('No cantrips yet.')).not.toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Cantrip name')).toHaveLength(1);
    expect(screen.queryByRole('checkbox', { name: 'Prepared' })).not.toBeInTheDocument();
  });

  it('typing a cantrip name persists it back into character.spells', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Cantrip' }));
    await user.type(screen.getByPlaceholderText('Cantrip name'), 'Fire Bolt');

    expect(screen.getByPlaceholderText('Cantrip name')).toHaveValue('Fire Bolt');
  });

  it('a pre-existing level-0 entry shows up under Cantrips, not Spells', () => {
    renderStep6({ spells: [{ id: 'c-1', name: 'Mage Hand', level: 0 }] });

    expect(screen.getByDisplayValue('Mage Hand')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cantrip name')).toHaveValue('Mage Hand');
    expect(screen.getByText('No spells yet.')).toBeInTheDocument();
  });

  it('removing a cantrip removes only that cantrip', async () => {
    const user = userEvent.setup();
    renderStep6({
      spells: [
        { id: 'c-1', name: 'Fire Bolt', level: 0 },
        { id: 'c-2', name: 'Mage Hand', level: 0 },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Remove Fire Bolt' }));

    expect(screen.queryByDisplayValue('Fire Bolt')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Mage Hand')).toBeInTheDocument();
  });

  it('removing the last cantrip shows the cantrip empty state again, independent of the spells section', async () => {
    const user = userEvent.setup();
    renderStep6({
      spells: [
        { id: 'c-1', name: 'Fire Bolt', level: 0 },
        { id: 's-1', name: 'Shield' },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Remove Fire Bolt' }));

    expect(screen.getByText('No cantrips yet.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Shield')).toBeInTheDocument();
  });
});

describe('Step6Spells — Spells section', () => {
  it('clicking "+ Add Spell" adds one empty, editable row with a Prepared checkbox', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));

    expect(screen.queryByText('No spells yet.')).not.toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Spell name')).toHaveLength(1);
    expect(screen.getByRole('checkbox', { name: 'Prepared' })).toBeInTheDocument();
  });

  it('a newly added spell does not land in Cantrips by accident', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));

    expect(screen.getByText('No cantrips yet.')).toBeInTheDocument();
  });

  it('typing a spell name persists it back into character.spells', async () => {
    const user = userEvent.setup();
    renderStep6();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));
    await user.type(screen.getByPlaceholderText('Spell name'), 'Fireball');

    expect(screen.getByPlaceholderText('Spell name')).toHaveValue('Fireball');
  });

  it('toggling prepared persists independently of the name', async () => {
    const user = userEvent.setup();
    renderStep6({ spells: [{ id: 's-1', name: 'Fireball' }] });

    await user.click(screen.getByRole('checkbox', { name: 'Prepared' }));

    expect(screen.getByRole('checkbox', { name: 'Prepared' })).toBeChecked();
    expect(screen.getByPlaceholderText('Spell name')).toHaveValue('Fireball');
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
        { id: 's-1', name: 'Fireball' },
        { id: 's-2', name: 'Shield' },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Remove Fireball' }));

    expect(screen.queryByDisplayValue('Fireball')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Shield')).toBeInTheDocument();
  });

  it('removing the last spell shows the spells empty state again, independent of the cantrips section', async () => {
    const user = userEvent.setup();
    renderStep6({
      spells: [
        { id: 'c-1', name: 'Fire Bolt', level: 0 },
        { id: 's-1', name: 'Shield' },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Remove Shield' }));

    expect(screen.getByText('No spells yet.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fire Bolt')).toBeInTheDocument();
  });

  it('pre-populates rows from existing character.spells, including prepared', () => {
    renderStep6({
      spells: [
        { id: 's-1', name: 'Hex', prepared: true },
        { id: 's-2', name: 'Web' },
      ],
    });

    expect(screen.getByDisplayValue('Hex')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Web')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox', { name: 'Prepared' });
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });
});
