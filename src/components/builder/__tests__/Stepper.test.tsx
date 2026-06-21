import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from '../Stepper';
import { STEPS } from '../types';

describe('Stepper', () => {
  it('shows the current step label and position collapsed by default', () => {
    render(<Stepper step={2} canEnter={() => true} onJump={() => {}} />);
    expect(screen.getByText('Class')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of ' + STEPS.length)).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clicking the trigger opens a listbox with every step', async () => {
    const user = userEvent.setup();
    render(<Stepper step={2} canEnter={() => true} onJump={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Class/ }));

    const listbox = screen.getByRole('listbox');
    STEPS.forEach((s) => {
      expect(within(listbox).getByText(s.label)).toBeInTheDocument();
    });
  });

  it('clicking an enabled, already-reached step calls onJump and closes the menu', async () => {
    const user = userEvent.setup();
    const onJump = vi.fn();
    render(<Stepper step={3} canEnter={(n) => n <= 3} onJump={onJump} />);

    await user.click(screen.getByRole('button', { name: /Species/ }));
    await user.click(screen.getByRole('option', { name: /Identity/ }));

    expect(onJump).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not call onJump for a step that has not been reached yet', async () => {
    const user = userEvent.setup();
    const onJump = vi.fn();
    render(<Stepper step={2} canEnter={(n) => n <= 2} onJump={onJump} />);

    await user.click(screen.getByRole('button', { name: /Class/ }));
    const lockedOption = screen.getByRole('option', { name: /Background/ });
    expect(lockedOption).toBeDisabled();

    await user.click(lockedOption);
    expect(onJump).not.toHaveBeenCalled();
  });

  it('pressing Escape closes the open menu', async () => {
    const user = userEvent.setup();
    render(<Stepper step={2} canEnter={() => true} onJump={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Class/ }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clicking outside the dropdown closes it', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Stepper step={2} canEnter={() => true} onJump={() => {}} />
        <button>Outside</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: /Class/ }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('marks the current step as selected and earlier reached steps as done (checkmark)', async () => {
    const user = userEvent.setup();
    render(<Stepper step={3} canEnter={(n) => n <= 3} onJump={() => {}} />);

    await user.click(screen.getByRole('button', { name: /Species/ }));
    const listbox = screen.getByRole('listbox');

    const currentOption = within(listbox).getByRole('option', { name: /Species/ });
    expect(currentOption).toHaveAttribute('aria-selected', 'true');

    const doneOption = within(listbox).getByRole('option', { name: /Class/ });
    expect(within(doneOption).getByText('✓')).toBeInTheDocument();
  });
});
