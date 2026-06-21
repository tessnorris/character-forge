import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step7Sheet } from '../Step7Sheet';
import { makeCharacter } from '../../../test/factories';
import type { Character } from '../../../types/character';

function renderStep5(initial: Partial<Character> = {}) {
  function Harness() {
    const [character, setCharacter] = useState<Character>(makeCharacter(initial));
    const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
    return <Step7Sheet character={character} updateCharacter={updateCharacter} onOpenInitiative={() => {}} />;
  }
  return render(<Harness />);
}

describe('Step7Sheet — character details', () => {
  it('renders all four detail fields empty by default', () => {
    renderStep5();
    expect(screen.getByLabelText('Background story')).toHaveValue('');
    expect(screen.getByLabelText('Physical description')).toHaveValue('');
    expect(screen.getByLabelText('Personality')).toHaveValue('');
    expect(screen.getByLabelText('Notes')).toHaveValue('');
  });

  it('typing into a detail field persists it back into character.details', async () => {
    const user = userEvent.setup();
    renderStep5();

    await user.type(screen.getByLabelText('Background story'), 'Raised by wolves.');

    expect(screen.getByLabelText('Background story')).toHaveValue('Raised by wolves.');
  });

  it('editing one field does not clear the others', async () => {
    const user = userEvent.setup();
    renderStep5();

    await user.type(screen.getByLabelText('Background story'), 'Backstory text');
    await user.type(screen.getByLabelText('Personality'), 'Personality text');

    expect(screen.getByLabelText('Background story')).toHaveValue('Backstory text');
    expect(screen.getByLabelText('Personality')).toHaveValue('Personality text');
  });

  it('renders correctly for a character with no `details` field at all (pre-existing/imported save)', () => {
    // Characters saved before this field existed won't have `details` set;
    // the component must fall back to empty strings rather than crashing
    // on character.details.backgroundDescription being undefined.
    renderStep5({ details: undefined });
    expect(screen.getByLabelText('Background story')).toHaveValue('');
  });

  it('pre-populates fields from an existing character.details', () => {
    renderStep5({
      details: {
        backgroundDescription: 'An old story.',
        physicalDescription: 'Tall and weathered.',
        personality: 'Stoic.',
        notes: 'Owes a debt to the thieves guild.',
      },
    });

    expect(screen.getByLabelText('Background story')).toHaveValue('An old story.');
    expect(screen.getByLabelText('Physical description')).toHaveValue('Tall and weathered.');
    expect(screen.getByLabelText('Personality')).toHaveValue('Stoic.');
    expect(screen.getByLabelText('Notes')).toHaveValue('Owes a debt to the thieves guild.');
  });
});

describe('Step7Sheet — spells', () => {
  it('shows an empty-state message and no rows when there are no spells', () => {
    renderStep5();
    expect(screen.getByText(/No spells yet/)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Spell name')).not.toBeInTheDocument();
  });

  it('renders correctly for a character with no `spells` field at all (pre-existing/imported save)', () => {
    renderStep5({ spells: undefined });
    expect(screen.getByText(/No spells yet/)).toBeInTheDocument();
  });

  it('clicking "+ Add Spell" adds one empty, editable row', async () => {
    const user = userEvent.setup();
    renderStep5();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));

    expect(screen.queryByText(/No spells yet/)).not.toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Spell name')).toHaveLength(1);
  });

  it('typing a spell name persists it back into character.spells', async () => {
    const user = userEvent.setup();
    renderStep5();

    await user.click(screen.getByRole('button', { name: '+ Add Spell' }));
    await user.type(screen.getByPlaceholderText('Spell name'), 'Fireball');

    expect(screen.getByPlaceholderText('Spell name')).toHaveValue('Fireball');
  });

  it('setting a level and toggling prepared both persist independently of the name', async () => {
    const user = userEvent.setup();
    renderStep5({ spells: [{ id: 'spell-1', name: 'Fireball' }] });

    await user.type(screen.getByPlaceholderText('Lvl'), '3');
    await user.click(screen.getByRole('checkbox', { name: 'Prepared' }));

    expect(screen.getByPlaceholderText('Lvl')).toHaveValue(3);
    expect(screen.getByRole('checkbox', { name: 'Prepared' })).toBeChecked();
    // Name field is untouched by editing level/prepared.
    expect(screen.getByPlaceholderText('Spell name')).toHaveValue('Fireball');
  });

  it('level can be cleared back to empty (it is optional)', async () => {
    const user = userEvent.setup();
    renderStep5({ spells: [{ id: 'spell-1', name: 'Mage Hand', level: 0 }] });

    const levelInput = screen.getByPlaceholderText('Lvl');
    expect(levelInput).toHaveValue(0);

    await user.clear(levelInput);
    expect(levelInput).toHaveValue(null);
  });

  it('supports multiple independent spell rows', async () => {
    const user = userEvent.setup();
    renderStep5();

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
    renderStep5({
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
    renderStep5({ spells: [{ id: 'spell-1', name: 'Fireball' }] });

    await user.click(screen.getByRole('button', { name: 'Remove Fireball' }));

    expect(screen.getByText(/No spells yet/)).toBeInTheDocument();
  });

  it('pre-populates rows from an existing character.spells, including level/prepared', () => {
    renderStep5({
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
