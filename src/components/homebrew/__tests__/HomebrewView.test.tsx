import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomebrewView } from '../HomebrewView';
import { emptyUserContent } from '../../../types/content';
import type { UserContent } from '../../../types/content';

function renderHomebrew(initial: UserContent = emptyUserContent()) {
  function Harness() {
    const [userContent, setUserContent] = useState<UserContent>(initial);
    const updateUserContent = (patch: Partial<UserContent>) => setUserContent((prev) => ({ ...prev, ...patch }));
    return <HomebrewView userContent={userContent} updateUserContent={updateUserContent} />;
  }
  return render(<Harness />);
}

describe('HomebrewView', () => {
  it('shows an empty state when there are no homebrew items', () => {
    renderHomebrew();
    expect(screen.getByText('No homebrew items yet.')).toBeInTheDocument();
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('adding an item with a name and cost shows it in the list, priced', async () => {
    const user = userEvent.setup();
    renderHomebrew();

    await user.type(screen.getByLabelText('Name'), 'Glowing Hex Coin');
    await user.type(screen.getByLabelText(/Cost in GP/), '12.5');
    await user.click(screen.getByRole('button', { name: 'Add to Homebrew' }));

    expect(screen.getByText('Glowing Hex Coin')).toBeInTheDocument();
    expect(screen.getByText('12 GP, 5 SP')).toBeInTheDocument(); // 12.5 GP -> 1250 cp -> 12 GP 5 SP
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('adding an item with no cost marks it "not for sale" rather than free (0 GP)', async () => {
    const user = userEvent.setup();
    renderHomebrew();

    await user.type(screen.getByLabelText('Name'), 'DM Story Token');
    await user.click(screen.getByRole('button', { name: 'Add to Homebrew' }));

    expect(screen.getByText('DM Story Token')).toBeInTheDocument();
    expect(screen.getByText('not for sale')).toBeInTheDocument();
  });

  it('does not add an item with a blank name', () => {
    renderHomebrew();

    // Required field — browser-level validation blocks submission, but
    // assert on the actual outcome (state unchanged) rather than the
    // validation mechanism.
    const form = screen.getByRole('button', { name: 'Add to Homebrew' }).closest('form')!;
    form.requestSubmit();

    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('clears the form after a successful add, ready for the next item', async () => {
    const user = userEvent.setup();
    renderHomebrew();

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
    await user.type(nameInput, 'First Item');
    await user.click(screen.getByRole('button', { name: 'Add to Homebrew' }));

    expect(nameInput.value).toBe('');
  });

  it('removing an item takes it out of the list', async () => {
    const user = userEvent.setup();
    renderHomebrew({
      customEquipment: [{ id: 'item-1', name: 'Doomed Item', costCP: 100 }],
    });

    expect(screen.getByText('Doomed Item')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.queryByText('Doomed Item')).not.toBeInTheDocument();
    expect(screen.getByText('No homebrew items yet.')).toBeInTheDocument();
  });

  it('shows a description when one is provided', async () => {
    const user = userEvent.setup();
    renderHomebrew();

    await user.type(screen.getByLabelText('Name'), 'Lucky Rabbit Paw');
    await user.type(screen.getByLabelText(/Description/), 'Found in the goblin warren.');
    await user.click(screen.getByRole('button', { name: 'Add to Homebrew' }));

    expect(screen.getByText('Found in the goblin warren.')).toBeInTheDocument();
  });
});
