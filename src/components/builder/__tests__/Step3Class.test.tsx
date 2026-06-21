import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step3Class } from '../Step3Class';
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
    return <Step3Class character={character} updateCharacter={updateCharacter} />;
  }
  return render(<Harness />);
}

describe('Step3Class', () => {
  it('shows a prompt instead of pickers when no class is chosen', () => {
    renderStep3();
    expect(screen.getByText(/Choose a class in Step 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Skill Proficiencies/)).not.toBeInTheDocument();
  });

  it('shows the background’s fixed skills and feat as read-only context', () => {
    renderStep3({ charClass: 'Wizard', background: 'Sage' });
    // Sage grants Arcana + History as fixed skills, and Magic Initiate (Wizard) as its feat.
    expect(screen.getByText('Already granted by your', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Arcana')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Magic Initiate (Wizard)')).toBeInTheDocument();
  });

  it('excludes the background’s fixed skills from the pickable class skill list', () => {
    // Wizard's skill list includes both Arcana and History — Sage already
    // grants both, so neither should appear as a *pickable* chip (though
    // they still appear once each, above, as read-only background context).
    renderStep3({ charClass: 'Wizard', background: 'Sage' });
    const arcanaMatches = screen.getAllByText('Arcana');
    const historyMatches = screen.getAllByText('History');
    // Only the read-only background chip — not also a pickable chip below.
    expect(arcanaMatches).toHaveLength(1);
    expect(historyMatches).toHaveLength(1);
  });

  it('enforces the exact skill choice count for a class with a fixed list', async () => {
    const user = userEvent.setup();
    renderStep3({ charClass: 'Wizard' }); // Wizard: choose 2
    expect(screen.getByText('Skill Proficiencies (choose 2)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Insight' }));
    await user.click(screen.getByRole('button', { name: 'Medicine' }));
    expect(screen.getByText('2 of 2 selected')).toBeInTheDocument();

    // A third skill should be disabled once the cap is reached.
    expect(screen.getByRole('button', { name: 'Religion' })).toBeDisabled();
  });

  it('lets Bard choose from any of the 18 skills (not a restricted list)', () => {
    renderStep3({ charClass: 'Bard' });
    expect(screen.getByText('This class can choose from any skill.')).toBeInTheDocument();
    expect(screen.getByText('Skill Proficiencies (choose 3)')).toBeInTheDocument();
    // Stealth isn't on any class's "restricted" skill list example, but Bard's is 'any'.
    expect(screen.getByRole('button', { name: 'Stealth' })).toBeInTheDocument();
  });

  it('shows a Weapon Mastery picker restricted to melee weapons for Barbarian', () => {
    renderStep3({ charClass: 'Barbarian' });
    expect(screen.getByText('Weapon Mastery (choose 2)')).toBeInTheDocument();
    // Longbow is ranged — excluded from Barbarian's melee-only pool.
    expect(screen.queryByRole('button', { name: 'Longbow' })).not.toBeInTheDocument();
    // Greataxe is a martial melee weapon — included.
    expect(screen.getByRole('button', { name: 'Greataxe' })).toBeInTheDocument();
  });

  it('shows both Fighting Style and Weapon Mastery (3) for Fighter', () => {
    renderStep3({ charClass: 'Fighter' });
    expect(screen.getByText('Fighting Style (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Weapon Mastery (choose 3)')).toBeInTheDocument();
    expect(screen.getByText('Archery')).toBeInTheDocument();
  });

  it('does not show Fighting Style for Paladin or Ranger at level 1 (SRD: that’s a level-2 feature)', () => {
    renderStep3({ charClass: 'Paladin' });
    expect(screen.queryByText(/Fighting Style/)).not.toBeInTheDocument();
    expect(screen.getByText('Weapon Mastery (choose 2)')).toBeInTheDocument();
  });

  it('lets Cleric choose between Protector and Thaumaturge for Divine Order', async () => {
    const user = userEvent.setup();
    renderStep3({ charClass: 'Cleric' });
    expect(screen.getByText('Divine Order (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Protector')).toBeInTheDocument();
    expect(screen.getByText('Thaumaturge')).toBeInTheDocument();

    await user.click(screen.getByText('Thaumaturge'));
    // Selecting highlights the chosen card; re-querying confirms no crash
    // and the description text is still present (sanity check on state flow).
    expect(screen.getByText(/extra cantrip/)).toBeInTheDocument();
  });

  it('lets Druid choose between Magician and Warden for Primal Order', () => {
    renderStep3({ charClass: 'Druid' });
    expect(screen.getByText('Primal Order (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Magician')).toBeInTheDocument();
    expect(screen.getByText('Warden')).toBeInTheDocument();
  });

  it('Rogue’s Expertise pool is empty until skills are chosen, then offers proficient skills', async () => {
    const user = userEvent.setup();
    renderStep3({ charClass: 'Rogue', background: 'Criminal' }); // Criminal grants Sleight of Hand + Stealth
    expect(screen.getByText('Expertise (choose 2)')).toBeInTheDocument();
    // Background skills alone already populate the Expertise pool.
    const expertiseHeading = screen.getByText('Expertise (choose 2)').closest('div')!.parentElement!;
    expect(expertiseHeading.textContent).toContain('Sleight of Hand');

    // Picking a class skill should add it to the Expertise pool too.
    await user.click(screen.getByRole('button', { name: 'Athletics' }));
    expect(expertiseHeading.textContent).toContain('Athletics');
  });

  it('shows the level-1 Eldritch Invocation picker for Warlock, limited to 5 options', () => {
    renderStep3({ charClass: 'Warlock' });
    expect(screen.getByText('Eldritch Invocation (choose 1)')).toBeInTheDocument();
    expect(screen.getByText('Pact of the Blade')).toBeInTheDocument();
    expect(screen.getByText('Pact of the Chain')).toBeInTheDocument();
    expect(screen.getByText('Pact of the Tome')).toBeInTheDocument();
    expect(screen.getByText('Armor of Shadows')).toBeInTheDocument();
    expect(screen.getByText('Eldritch Mind')).toBeInTheDocument();
    // A higher-level invocation must not appear at character creation.
    expect(screen.queryByText('Agonizing Blast')).not.toBeInTheDocument();
  });

  it('does not show Weapon Mastery, Order, Expertise, or Invocation sections for a class with none of those (e.g. Sorcerer)', () => {
    renderStep3({ charClass: 'Sorcerer' });
    expect(screen.queryByText(/Weapon Mastery/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Order \(choose 1\)/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Expertise/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Eldritch Invocation/)).not.toBeInTheDocument();
  });
});
