import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, extractImportedCharacters } from '../storage';
import { makeCharacter } from '../../test/factories';

const STORAGE_KEY = 'dnd-charforge-v1';

describe('saveState / loadState round trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing has been saved yet', () => {
    expect(loadState()).toBeNull();
  });

  it('round-trips a saved state unchanged (aside from added version)', () => {
    const character = makeCharacter({ name: 'Mialee' });
    saveState({ character, combatants: [], roster: [], step: 3 });

    const loaded = loadState();
    expect(loaded).not.toBeNull();
    expect(loaded!.character.name).toBe('Mialee');
    expect(loaded!.step).toBe(3);
    expect(loaded!.version).toBe(1);
  });

  it('returns null (not a throw) if the stored value is corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadState()).toBeNull();
  });
});

describe('migrate (via loadState) — pre-versioning saves', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('upgrades a save with no `version` field (the original prototype shape)', () => {
    const legacyShape = {
      character: makeCharacter({ name: 'Legacy Hero' }),
      combatants: [],
      // `roster` and `step` deliberately omitted, as the original app
      // could produce saves without them.
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyShape));

    const loaded = loadState();
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(1);
    expect(loaded!.character.name).toBe('Legacy Hero');
    expect(loaded!.roster).toEqual([]); // defaulted, not undefined
    expect(loaded!.step).toBe(1); // defaulted, not undefined
  });
});

describe('extractImportedCharacters', () => {
  it('accepts a bare array of characters', () => {
    const chars = [makeCharacter({ name: 'A' }), makeCharacter({ name: 'B' })];
    expect(extractImportedCharacters(chars)).toEqual(chars);
  });

  it('accepts a { roster: [...] } wrapper', () => {
    const chars = [makeCharacter({ name: 'A' })];
    expect(extractImportedCharacters({ roster: chars })).toEqual(chars);
  });

  it('accepts a single character object (has an id, no roster array)', () => {
    const char = makeCharacter({ name: 'Solo' });
    const result = extractImportedCharacters(char);
    expect(result).toHaveLength(1);
    expect(result![0].name).toBe('Solo');
  });

  it('returns null for unrecognized shapes', () => {
    expect(extractImportedCharacters(null)).toBeNull();
    expect(extractImportedCharacters(42)).toBeNull();
    expect(extractImportedCharacters('a string')).toBeNull();
    expect(extractImportedCharacters({ notARoster: true })).toBeNull();
  });
});
