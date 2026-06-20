import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step4Background } from '../Step4Background';
import { makeCharacter } from '../../../test/factories';
import type { Character } from '../../../types/character';

/** Step components are "controlled" — they take `character` + `updateCharacter`
 * and don't own state themselves. This wrapper holds the state exactly the way
 * App.tsx does, so tests exercise the real data flow rather than mocking
 * updateCharacter and asserting on call arguments. */
function renderStep4(initial: Partial<Character> = {}) {
  function Harness() {
    const [character, setCharacter] = useState<Character>(makeCharacter(initial));
    const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
    return <Step4Background character={character} updateCharacter={updateCharacter} />;
  }
  return render(<Harness />);
}

describe('Step4Background', () => {
  it('shows no bonus-distribution panel until a background is chosen', () => {
    renderStep4();
    expect(screen.queryByText('Bonus distribution')).not.toBeInTheDocument();
  });

  it('selecting a background reveals its associated abilities as badges', async () => {
    const user = userEvent.setup();
    renderStep4();

    await user.selectOptions(screen.getByLabelText('Choose a Background'), 'Sage');

    expect(screen.getByText('Bonus distribution')).toBeInTheDocument();
    // Sage grants Constitution, Intelligence, Wisdom — shown as badges in
    // the "Associated abilities" row. Scope to that row since the ability
    // names also appear as <option> text inside the dropdowns below.
    const associated = screen.getByText('Associated abilities:').closest('div')!;
    expect(within(associated).getByText('Constitution')).toBeInTheDocument();
    expect(within(associated).getByText('Intelligence')).toBeInTheDocument();
    expect(within(associated).getByText('Wisdom')).toBeInTheDocument();
  });

  it('defaults to the 2-1 split with the background’s first two abilities', async () => {
    const user = userEvent.setup();
    renderStep4();
    await user.selectOptions(screen.getByLabelText('Choose a Background'), 'Sage');

    // 2-1 is selected by default, so both ability dropdowns should be visible.
    expect(screen.getByText('+2 Ability')).toBeInTheDocument();
    expect(screen.getByText('+1 Ability')).toBeInTheDocument();
  });

  it('switching to 1-1-1 mode shows the flat +1-to-all summary instead of dropdowns', async () => {
    const user = userEvent.setup();
    renderStep4();
    await user.selectOptions(screen.getByLabelText('Choose a Background'), 'Sage');
    await user.click(screen.getByRole('radio', { name: '+1 to all three' }));

    expect(screen.queryByText('+2 Ability')).not.toBeInTheDocument();
    expect(screen.getByText(/Applying/)).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('disables the +1 option that is currently selected for +2 (and vice versa), preventing a duplicate pick', async () => {
    const user = userEvent.setup();
    renderStep4({ background: 'Sage', bonusType: '2-1', bonus2: 'Intelligence', bonus1: 'Wisdom' });

    const plus2 = screen.getByLabelText('+2 Ability') as HTMLSelectElement;
    const plus1 = screen.getByLabelText('+1 Ability') as HTMLSelectElement;

    // The ability currently held by the other dropdown must not be a
    // selectable option, so a user can never end up with the same ability
    // applied twice.
    expect(within(plus2).getByRole('option', { name: 'Wisdom' })).toBeDisabled();
    expect(within(plus1).getByRole('option', { name: 'Intelligence' })).toBeDisabled();

    // Picking a different, unconflicted ability works normally.
    await user.selectOptions(plus2, 'Constitution');
    expect(plus2.value).toBe('Constitution');
    expect(plus1.value).toBe('Wisdom'); // unaffected
  });

  it('clearing the background resets the bonus selections', async () => {
    const user = userEvent.setup();
    renderStep4({ background: 'Sage', bonusType: '2-1', bonus2: 'Intelligence', bonus1: 'Wisdom' });

    await user.selectOptions(screen.getByLabelText('Choose a Background'), '-- Select Background --');

    expect(screen.queryByText('Bonus distribution')).not.toBeInTheDocument();
  });
});
