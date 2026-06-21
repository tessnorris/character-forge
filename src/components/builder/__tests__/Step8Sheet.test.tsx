import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step8Sheet } from '../Step8Sheet';
import { makeCharacter } from '../../../test/factories';
import type { Character } from '../../../types/character';

function renderSheet(initial: Partial<Character> = {}) {
  function Harness() {
    const [character, setCharacter] = useState<Character>(makeCharacter(initial));
    const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
    return <Step8Sheet character={character} updateCharacter={updateCharacter} onOpenInitiative={() => {}} />;
  }
  return render(<Harness />);
}

/** Read the big number out of a StatCard, located by its label text. */
const statValue = (label: string) => {
  const card = screen.getByText(label).parentElement as HTMLElement;
  return card;
};

describe('Step8Sheet — character details', () => {
  it('renders all four detail fields empty by default', () => {
    renderSheet();
    expect(screen.getByLabelText('Background story')).toHaveValue('');
    expect(screen.getByLabelText('Physical description')).toHaveValue('');
    expect(screen.getByLabelText('Personality')).toHaveValue('');
    expect(screen.getByLabelText('Notes')).toHaveValue('');
  });

  it('typing into a detail field persists it back into character.details', async () => {
    const user = userEvent.setup();
    renderSheet();

    await user.type(screen.getByLabelText('Background story'), 'Raised by wolves.');

    expect(screen.getByLabelText('Background story')).toHaveValue('Raised by wolves.');
  });

  it('editing one field does not clear the others', async () => {
    const user = userEvent.setup();
    renderSheet();

    await user.type(screen.getByLabelText('Background story'), 'Backstory text');
    await user.type(screen.getByLabelText('Personality'), 'Personality text');

    expect(screen.getByLabelText('Background story')).toHaveValue('Backstory text');
    expect(screen.getByLabelText('Personality')).toHaveValue('Personality text');
  });

  it('renders correctly for a character with no `details` field at all (pre-existing/imported save)', () => {
    renderSheet({ details: undefined });
    expect(screen.getByLabelText('Background story')).toHaveValue('');
  });

  it('pre-populates fields from an existing character.details', () => {
    renderSheet({
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

const CLEAN_SCORES = { Strength: 16, Dexterity: 14, Constitution: 12, Intelligence: 10, Wisdom: 13, Charisma: 8 };

describe('Step8Sheet — derived sheet', () => {
  it('shows derived AC, HP, and proficiency bonus for a rolled character', () => {
    renderSheet({ charClass: 'Fighter', baseScores: CLEAN_SCORES });
    expect(within(statValue('AC')).getByText('12')).toBeInTheDocument(); // unarmored 10 + DEX 2
    expect(within(statValue('HP')).getByText('11')).toBeInTheDocument(); // d10 + CON 1
    expect(within(statValue('Prof')).getByText('+2')).toBeInTheDocument();
  });

  it('prompts to roll abilities when scores are missing', () => {
    renderSheet({ charClass: 'Fighter', baseScores: null });
    expect(screen.getByText(/Roll abilities/i)).toBeInTheDocument();
  });

  it('toggling an armor item as equipped recomputes AC', async () => {
    const user = userEvent.setup();
    renderSheet({ charClass: 'Fighter', baseScores: CLEAN_SCORES, purchasedItems: { 'Studded Leather Armor': 1 } });

    // Unarmored to start: 10 + DEX 2 = 12.
    expect(within(statValue('AC')).getByText('12')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Equip' }));

    // Studded Leather (12) + DEX 2 = 14.
    expect(within(statValue('AC')).getByText('14')).toBeInTheDocument();
  });

  it('renders a weapon attack line with attack bonus and damage', () => {
    renderSheet({ charClass: 'Fighter', baseScores: CLEAN_SCORES, purchasedItems: { Longsword: 1 } });
    // "Longsword" also appears in the equipment list, so scope to the Attacks section.
    const attacks = within(screen.getByText('Attacks').closest('div')!);
    expect(attacks.getByText('Longsword')).toBeInTheDocument();
    expect(attacks.getByText('+5')).toBeInTheDocument(); // STR +3 + PB 2
    expect(attacks.getByText(/1d8 \+ 3/)).toBeInTheDocument();
  });

  it('groups features under their source', () => {
    renderSheet({ charClass: 'Fighter', species: 'Human', background: 'Soldier', baseScores: CLEAN_SCORES, fightingStyle: 'Archery', speciesBonusFeat: 'Alert' });
    expect(screen.getByText('Fighter (Class)')).toBeInTheDocument();
    expect(screen.getByText('Soldier (Background)')).toBeInTheDocument();
    expect(screen.getByText(/Fighting Style: Archery/)).toBeInTheDocument();
  });
});

describe('Step8Sheet — spells (read-only)', () => {
  it('shows "No cantrips." and "No spells." when there are none', () => {
    renderSheet();
    expect(screen.getByText('No cantrips.')).toBeInTheDocument();
    expect(screen.getByText('No spells.')).toBeInTheDocument();
  });

  it('renders correctly for a character with no `spells` field at all (pre-existing/imported save)', () => {
    renderSheet({ spells: undefined });
    expect(screen.getByText('No cantrips.')).toBeInTheDocument();
    expect(screen.getByText('No spells.')).toBeInTheDocument();
  });

  it('lists cantrips (level 0) separately from leveled spells', () => {
    renderSheet({
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
    renderSheet({
      spells: [
        { id: 'c-1', name: 'Mage Hand', level: 0, prepared: true },
        { id: 's-1', name: 'Hex', prepared: true },
        { id: 's-2', name: 'Web' },
      ],
    });

    expect(screen.getAllByText('(prepared)')).toHaveLength(1);
  });

  it('does not render any editable inputs, buttons to add/remove, or checkboxes for spells', () => {
    renderSheet({
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
