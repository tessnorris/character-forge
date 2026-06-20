import type { Character, Combatant } from '../types/character';
import type { UserContent } from '../types/content';
import { emptyUserContent } from '../types/content';

const STORAGE_KEY = 'dnd-charforge-v1';
const USER_CONTENT_STORAGE_KEY = 'dnd-charforge-content-v1';
export const PC_ID = '__pc__';

/** Bump this whenever the shape of PersistedState changes, and add a case
 * to `migrate()` to upgrade older saves instead of discarding them. */
export const SCHEMA_VERSION = 1;

/** Homebrew content has its own independent schema version: it's a
 * separate storage key with a different lifecycle than character/roster
 * state, so a future change to one doesn't force a migration of the other. */
export const USER_CONTENT_SCHEMA_VERSION = 1;

export interface PersistedState {
  version: number;
  character: Character;
  combatants: Combatant[];
  roster: Character[];
  step: number;
}

interface PersistedUserContent {
  version: number;
  content: UserContent;
}

/** Upgrade older persisted shapes to the current one. Add cases as the
 * schema evolves; never delete old cases while users might still have
 * that version saved in their browser. */
function migrate(raw: unknown): PersistedState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  // Pre-versioning saves (no `version` field) — original prototype shape.
  if (obj.version === undefined) {
    return {
      version: SCHEMA_VERSION,
      character: obj.character as Character,
      combatants: (obj.combatants as Combatant[]) ?? [],
      roster: (obj.roster as Character[]) ?? [],
      step: (obj.step as number) ?? 1,
    };
  }

  if (obj.version === SCHEMA_VERSION) return obj as unknown as PersistedState;

  // Future migrations go here, e.g.:
  // if (obj.version === 1) { ...upgrade to 2...; obj.version = 2; }

  return obj as unknown as PersistedState;
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveState(state: Omit<PersistedState, 'version'>): void {
  try {
    const toSave: PersistedState = { version: SCHEMA_VERSION, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // storage unavailable (e.g. private browsing quota) — silently skip
  }
}

/** Upgrade older persisted UserContent shapes to the current one. Same
 * pattern as `migrate()` above, kept separate since the two evolve
 * independently. */
function migrateUserContent(raw: unknown): PersistedUserContent | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (obj.version === USER_CONTENT_SCHEMA_VERSION) return obj as unknown as PersistedUserContent;

  // Future migrations go here, e.g.:
  // if (obj.version === 1) { ...upgrade to 2...; obj.version = 2; }

  return obj as unknown as PersistedUserContent;
}

export function loadUserContent(): UserContent {
  try {
    const raw = localStorage.getItem(USER_CONTENT_STORAGE_KEY);
    if (!raw) return emptyUserContent();
    const migrated = migrateUserContent(JSON.parse(raw));
    return migrated?.content ?? emptyUserContent();
  } catch {
    return emptyUserContent();
  }
}

export function saveUserContent(content: UserContent): void {
  try {
    const toSave: PersistedUserContent = { version: USER_CONTENT_SCHEMA_VERSION, content };
    localStorage.setItem(USER_CONTENT_STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // storage unavailable — silently skip
  }
}

export function downloadJSON(filename: string, dataObj: unknown): void {
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Parse an imported JSON payload into a list of characters. Accepts a bare
 * array, a `{ roster: [...] }` wrapper, or a single character object.
 * Returns null if the shape isn't recognized. */
export function extractImportedCharacters(data: unknown): Character[] | null {
  if (Array.isArray(data)) return data as Character[];
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.roster)) return obj.roster as Character[];
    if (obj.id) return [obj as unknown as Character];
  }
  return null;
}
