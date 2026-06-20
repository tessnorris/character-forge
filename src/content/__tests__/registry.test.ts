import { describe, it, expect } from 'vitest';
import { getAllEquipment, getPurchasableEquipment, findEquipment } from '../registry';
import { emptyUserContent } from '../../types/content';
import type { UserContent } from '../../types/content';

describe('getAllEquipment', () => {
  it('includes all built-in shop items when there is no homebrew', () => {
    const entries = getAllEquipment(emptyUserContent());
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((e) => !e.isHomebrew)).toBe(true);
  });

  it('includes homebrew items alongside built-ins', () => {
    const userContent: UserContent = {
      customEquipment: [{ id: 'item-1', name: 'Flametongue Letter Opener', description: 'A gag gift, mostly.', costCP: 500 }],
    };
    const entries = getAllEquipment(userContent);
    const homebrew = entries.find((e) => e.key === 'item-1');
    expect(homebrew).toBeDefined();
    expect(homebrew!.name).toBe('Flametongue Letter Opener');
    expect(homebrew!.isHomebrew).toBe(true);
    expect(homebrew!.costCP).toBe(500);
  });

  it('returns entries sorted alphabetically by name', () => {
    const userContent: UserContent = {
      customEquipment: [{ id: 'item-1', name: 'Aardvark Tooth Charm' }],
    };
    const entries = getAllEquipment(userContent);
    const names = entries.map((e) => e.name);
    expect(names[0]).toBe('Aardvark Tooth Charm'); // sorts before built-in "Arcane Focus" etc.
  });

  it('represents a homebrew item with no cost as costCP: null, not 0', () => {
    const userContent: UserContent = {
      customEquipment: [{ id: 'item-1', name: 'DM Gift Dagger' }], // no costCP given
    };
    const entry = getAllEquipment(userContent).find((e) => e.key === 'item-1')!;
    expect(entry.costCP).toBeNull();
  });
});

describe('getPurchasableEquipment', () => {
  it('excludes homebrew items that have no listed cost', () => {
    const userContent: UserContent = {
      customEquipment: [
        { id: 'priced', name: 'Priced Homebrew Item', costCP: 200 },
        { id: 'free', name: 'Unpriced Campaign Loot' }, // no cost — not purchasable
      ],
    };
    const purchasable = getPurchasableEquipment(userContent);
    expect(purchasable.some((e) => e.key === 'priced')).toBe(true);
    expect(purchasable.some((e) => e.key === 'free')).toBe(false);
  });

  it('includes every built-in shop item (all are priced)', () => {
    const purchasable = getPurchasableEquipment(emptyUserContent());
    const all = getAllEquipment(emptyUserContent());
    expect(purchasable).toHaveLength(all.length);
  });
});

describe('findEquipment', () => {
  it('finds a built-in item by its name key', () => {
    const entry = findEquipment('Dagger', emptyUserContent());
    expect(entry).toBeDefined();
    expect(entry!.isHomebrew).toBe(false);
  });

  it('finds a homebrew item by its id key', () => {
    const userContent: UserContent = {
      customEquipment: [{ id: 'custom-1', name: 'Whatever' }],
    };
    const entry = findEquipment('custom-1', userContent);
    expect(entry).toBeDefined();
    expect(entry!.isHomebrew).toBe(true);
  });

  it('returns undefined for an unknown key', () => {
    expect(findEquipment('not-a-real-key', emptyUserContent())).toBeUndefined();
  });

  it('a homebrew item sharing a name with a built-in item does not shadow it — both remain separately keyed', () => {
    // Built-ins are keyed by name; homebrew is keyed by id. A homebrew item
    // named "Dagger" must not be confused with (or overwrite) the built-in
    // "Dagger" shop item, since their keys ('Dagger' vs. a generated id) differ.
    const userContent: UserContent = {
      customEquipment: [{ id: 'homebrew-dagger', name: 'Dagger', description: 'A cursed homebrew dagger.' }],
    };
    const builtIn = findEquipment('Dagger', userContent);
    const homebrew = findEquipment('homebrew-dagger', userContent);
    expect(builtIn!.isHomebrew).toBe(false);
    expect(homebrew!.isHomebrew).toBe(true);
    expect(homebrew!.name).toBe('Dagger');

    // Both should also appear in the full list — same display name, distinct entries.
    const all = getAllEquipment(userContent);
    expect(all.filter((e) => e.name === 'Dagger')).toHaveLength(2);
  });
});
