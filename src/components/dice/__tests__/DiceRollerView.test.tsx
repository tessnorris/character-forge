import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiceRollerView } from '../DiceRollerView';

describe('DiceRollerView', () => {
  let randomSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    randomSpy = vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it('shows an empty history initially', () => {
    render(<DiceRollerView />);
    expect(screen.getByText('No rolls yet.')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // history count badge
  });

  it('clicking a quick-roll die adds a result to history', async () => {
    const user = userEvent.setup();
    randomSpy.mockReturnValue(0.5); // -> 11 on a d20 (floor(0.5*20)+1)
    render(<DiceRollerView />);

    await user.click(screen.getByRole('button', { name: 'd20' }));

    expect(screen.queryByText('No rolls yet.')).not.toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('rolling custom notation parses and displays the result', async () => {
    const user = userEvent.setup();
    // 2d6+3: rolls of 3 and 5 (random 2/6, 4/6) -> total 11
    randomSpy.mockReturnValueOnce(2 / 6).mockReturnValueOnce(4 / 6);
    render(<DiceRollerView />);

    await user.type(screen.getByLabelText('Custom notation'), '2d6+3');
    await user.click(screen.getByRole('button', { name: 'Roll' }));

    expect(screen.getByText('2d6+3')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('[3, 5] +3')).toBeInTheDocument();
  });

  it('shows an error and does not add to history for unparseable notation', async () => {
    const user = userEvent.setup();
    render(<DiceRollerView />);

    await user.type(screen.getByLabelText('Custom notation'), 'banana');
    await user.click(screen.getByRole('button', { name: 'Roll' }));

    expect(screen.getByText(/Couldn't parse "banana"/)).toBeInTheDocument();
    expect(screen.getByText('No rolls yet.')).toBeInTheDocument();
  });

  it('clears the error once the user edits the notation field again', async () => {
    const user = userEvent.setup();
    render(<DiceRollerView />);

    await user.type(screen.getByLabelText('Custom notation'), 'bad');
    await user.click(screen.getByRole('button', { name: 'Roll' }));
    expect(screen.getByText(/Couldn't parse/)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Custom notation'), 'x');
    expect(screen.queryByText(/Couldn't parse/)).not.toBeInTheDocument();
  });

  it('advantage keeps the higher of two d20 rolls and shows both', async () => {
    const user = userEvent.setup();
    randomSpy.mockReturnValueOnce(0.25).mockReturnValueOnce(0.9); // -> 6, 19
    render(<DiceRollerView />);

    await user.click(screen.getByRole('button', { name: 'd20 Advantage' }));

    expect(screen.getByText('d20 (advantage)')).toBeInTheDocument();
    expect(screen.getByText('rolled 6 and 19')).toBeInTheDocument();
    expect(screen.getByText('19')).toBeInTheDocument(); // kept value shown in the result badge
  });

  it('disadvantage keeps the lower of two d20 rolls', async () => {
    const user = userEvent.setup();
    randomSpy.mockReturnValueOnce(0.25).mockReturnValueOnce(0.9); // -> 6, 19
    render(<DiceRollerView />);

    await user.click(screen.getByRole('button', { name: 'd20 Disadvantage' }));

    expect(screen.getByText('6')).toBeInTheDocument(); // kept value
  });

  it('newest roll appears first in history', async () => {
    const user = userEvent.setup();
    randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0.9999); // d4 -> 1, then d6 -> 6
    render(<DiceRollerView />);

    await user.click(screen.getByRole('button', { name: 'd4' }));
    await user.click(screen.getByRole('button', { name: 'd6' }));

    // Scope to the history list — the quick-roll buttons themselves are
    // also labeled "d4"/"d6", so an unscoped query would match both.
    const historyCard = screen.getByText('History').closest('div.bg-slate-900') as HTMLElement;
    const entries = within(historyCard).getAllByText(/^d(4|6)$/);
    expect(entries[0]).toHaveTextContent('d6'); // most recent roll first
  });

  it('clear history removes all entries and the clear button itself', async () => {
    const user = userEvent.setup();
    randomSpy.mockReturnValue(0);
    render(<DiceRollerView />);

    await user.click(screen.getByRole('button', { name: 'd6' }));
    expect(screen.getByRole('button', { name: 'Clear history' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear history' }));

    expect(screen.getByText('No rolls yet.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear history' })).not.toBeInTheDocument();
  });
});
