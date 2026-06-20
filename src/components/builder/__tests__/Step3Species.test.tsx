import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step3Species } from '../Step3Species';
import { makeCharacter } from '../../../test/factories';
import type { Character } from '../../../types/character';

/** Step components are "controlled" — they take `character` + `updateCharacter`
 * and don't own state themselves. This wrapper holds the state exactly the way
 * App.tsx does, so tests exercise the real data flow rather than mocking
 * updateCharacter and asserting on call arguments. */
function renderStep3(initial: Partial<Character> = {}) {
  function Harness() {
    const [character, setCharacter] = useState<Character>(makeCharacter(initial));
    const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
    return <Step3Species character={character} updateCharacter={updateCharacter} />;
  }
  return render(<Harness />);
}

describe('Step3Species', () => {
  it('shows a prompt instead of pickers when no species is chosen', () => {
    renderStep3();
    expect(screen.getByText(/Choose a species in Step 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Traits/)).not.toBeInTheDocument();
  });

  it('shows a no-choices message for a species with fixed traits only (e.g. Dwarf)', () => {
    renderStep3({ species: 'Dwarf' });
    expect(screen.getByText(/no choices to make at level 1/)).toBeInTheDocument();
  });

  it('shows a Draconic Ancestry picker with 10 options for Dragonborn', () => {
    renderStep3({ species: 'Dragonborn' });
    expect(screen.getByText('Draconic Ancestry (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
  });

  it('shows a Giant Ancestry picker with 6 options for Goliath', () => {
    renderStep3({ species: 'Goliath' });
    expect(screen.getByText('Giant Ancestry (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Cloud Giant')).toBeInTheDocument();
    expect(screen.getByText('Storm Giant')).toBeInTheDocument();
  });

  it('shows Elf’s lineage picker, the level 1/3/5 grant preview once chosen, the spellcasting ability picker, and the bonus skill picker', async () => {
    const user = userEvent.setup();
    renderStep3({ species: 'Elf' });

    expect(screen.getByText('Elven Lineage (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Drow')).toBeInTheDocument();
    expect(screen.getByText('High Elf')).toBeInTheDocument();
    expect(screen.getByText('Wood Elf')).toBeInTheDocument();

    // No grant preview until a lineage is picked.
    expect(screen.queryByText(/Level 1:/)).not.toBeInTheDocument();

    await user.click(screen.getByText('Drow'));
    expect(screen.getByText(/Level 1:/)).toBeInTheDocument();
    expect(screen.getByText('Dancing Lights', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Level 3:/)).toBeInTheDocument();
    expect(screen.getByText(/Level 5:/)).toBeInTheDocument();

    // Spellcasting ability picker shows int/wis/cha as display names.
    expect(screen.getByText('Spellcasting Ability')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Intelligence' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wisdom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Charisma' })).toBeInTheDocument();

    // Elf's bonus skill picker is restricted to its 3-option list.
    expect(screen.getByText('Bonus Skill (choose 1)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Insight' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perception' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Survival' })).toBeInTheDocument();
    // Not every skill is offered — Elf's list is the fixed 3, not 'any'.
    expect(screen.queryByRole('button', { name: 'Athletics' })).not.toBeInTheDocument();
  });

  it('toggling the same spellcasting ability again deselects it', async () => {
    const user = userEvent.setup();
    renderStep3({ species: 'Elf', speciesLineage: 'Drow' });

    const isSelected = (el: HTMLElement) => el.className.split(/\s+/).includes('border-accent-500');

    await user.click(screen.getByRole('button', { name: 'Wisdom' }));
    expect(isSelected(screen.getByRole('button', { name: 'Wisdom' }))).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Wisdom' }));
    expect(isSelected(screen.getByRole('button', { name: 'Wisdom' }))).toBe(false);
  });

  it('Gnome’s lineage options show only a level-1 grant, no level 3/5', async () => {
    const user = userEvent.setup();
    renderStep3({ species: 'Gnome' });
    expect(screen.getByText('Gnomish Lineage (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Forest Gnome')).toBeInTheDocument();
    expect(screen.getByText('Rock Gnome')).toBeInTheDocument();

    await user.click(screen.getByText('Forest Gnome'));
    expect(screen.getByText(/Level 1:/)).toBeInTheDocument();
    expect(screen.queryByText(/Level 3:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Level 5:/)).not.toBeInTheDocument();

    // Gnome has no separate bonus-skill picker.
    expect(screen.queryByText(/Bonus Skill/)).not.toBeInTheDocument();
  });

  it('Human shows an any-skill bonus-skill picker and a bonus Origin feat picker, with no ancestry/lineage section', () => {
    renderStep3({ species: 'Human' });
    expect(screen.queryByText(/Ancestry/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Lineage/)).not.toBeInTheDocument();

    expect(screen.getByText('Bonus Skill (choose 1)')).toBeInTheDocument();
    // 'any' skill list includes skills well outside Elf's fixed 3.
    expect(screen.getByRole('button', { name: 'Athletics' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Arcana' })).toBeInTheDocument();

    expect(screen.getByText('Bonus Origin Feat (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Skilled')).toBeInTheDocument();
    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('selecting a bonus Origin feat for Human persists the choice', async () => {
    const user = userEvent.setup();
    renderStep3({ species: 'Human' });
    await user.click(screen.getByText('Lucky'));
    const luckyCard = screen.getByText('Lucky').closest('button')!;
    expect(luckyCard.className).toContain('border-accent-500');
  });
});
