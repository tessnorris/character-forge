import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step8Sheet } from '../Step8Sheet';
import { makeCharacter } from '../../../test/factories';
import type { Character } from '../../../types/character';

function renderStep5(initial: Partial<Character> = {}) {
  function Harness() {
    const [character, setCharacter] = useState<Character>(makeCharacter(initial));
    const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
    return <Step8Sheet character={character} updateCharacter={updateCharacter} onOpenInitiative={() => {}} />;
  }
  return render(<Harness />);
}

describe('Step8Sheet — character details', () => {
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

describe('Step8Sheet — spells (read-only)', () => {
  it('shows "No cantrips." and "No spells." when there are none', () => {
    renderStep5();
    expect(screen.getByText('No cantrips.')).toBeInTheDocument();
    expect(screen.getByText('No spells.')).toBeInTheDocument();
  });

  it('renders correctly for a character with no `spells` field at all (pre-existing/imported save)', () => {
    renderStep5({ spells: undefined });
    expect(screen.getByText('No cantrips.')).toBeInTheDocument();
    expect(screen.getByText('No spells.')).toBeInTheDocument();
  });

  it('lists cantrips (level 0) separately from leveled spells', () => {
    renderStep5({
      spells: [
        { id: 'c-1', name: 'Fire Bolt', level: 0 },
        { id: 's-1', name: 'Shield' },
      ],
    });

    expect(screen.getByText('Fire Bolt')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
    expect(screen.queryByText('No cantrips.')).not.toBeInTheDocument();
    expect(screen.queryByText('No spells.')).not.toBeInTheDocument();
  });

  it('marks a prepared spell but never a cantrip', () => {
    renderStep5({
      spells: [
        { id: 'c-1', name: 'Mage Hand', level: 0, prepared: true },
        { id: 's-1', name: 'Hex', prepared: true },
        { id: 's-2', name: 'Web' },
      ],
    });

    expect(screen.getAllByText('(prepared)')).toHaveLength(1);
  });

  it('does not render any editable inputs, buttons to add/remove, or checkboxes', () => {
    renderStep5({
      spells: [
        { id: 'c-1', name: 'Fire Bolt', level: 0 },
        { id: 's-1', name: 'Shield' },
      ],
    });

    expect(screen.queryByPlaceholderText('Cantrip name')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Spell name')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '+ Add Cantrip' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '+ Add Spell' })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
