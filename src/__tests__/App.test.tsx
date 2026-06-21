import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});

describe('App — header navigation', () => {
  it('shows only a "Characters" link on the top line, not the other view names', () => {
    render(<App />);
    const topBar = screen.getByRole('button', { name: 'Characters' }).closest('div')!;
    expect(within(topBar).getByRole('button', { name: 'Characters' })).toBeInTheDocument();
    expect(within(topBar).queryByRole('button', { name: 'Builder' })).not.toBeInTheDocument();
    expect(within(topBar).queryByRole('button', { name: 'Initiative' })).not.toBeInTheDocument();
    expect(within(topBar).queryByRole('button', { name: 'Dice' })).not.toBeInTheDocument();
    expect(within(topBar).queryByRole('button', { name: 'Homebrew' })).not.toBeInTheDocument();
  });

  it('the hamburger menu is closed by default', () => {
    render(<App />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('opens the hamburger to reveal the full list of destinations', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    const menu = screen.getByRole('navigation');
    expect(within(menu).getByRole('button', { name: 'Builder' })).toBeInTheDocument();
    expect(within(menu).getByRole('button', { name: 'Characters' })).toBeInTheDocument();
    expect(within(menu).getByRole('button', { name: 'Initiative' })).toBeInTheDocument();
    expect(within(menu).getByRole('button', { name: 'Dice' })).toBeInTheDocument();
    expect(within(menu).getByRole('button', { name: 'Homebrew' })).toBeInTheDocument();
  });

  it('clicking a destination in the menu navigates there and closes the menu', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(within(screen.getByRole('navigation')).getByRole('button', { name: 'Dice' }));

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /dice/i })).toBeInTheDocument();
  });

  it('clicking outside the open menu closes it', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
