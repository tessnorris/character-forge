import { useId } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { uid } from '../../engine/dice';
import type { Character, SpellEntry } from '../../types/character';

interface Step6Props {
  character: Character;
  updateCharacter: (patch: Partial<Character>) => void;
}

/** A cantrip row — name only. Cantrips are always level 0 and always
 * available (no daily preparation), so neither field from the full
 * SpellRow applies here. */
const CantripRow = ({ spell, onChange, onRemove }: { spell: SpellEntry; onChange: (patch: Partial<SpellEntry>) => void; onRemove: () => void }) => {
  const nameId = useId();
  return (
    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg p-2.5">
      <label htmlFor={nameId} className="sr-only">
        Cantrip name
      </label>
      <input
        id={nameId}
        type="text"
        value={spell.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Cantrip name"
        className="flex-1 min-w-0 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm focus:border-accent-500 outline-none"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${spell.name || 'cantrip'}`}
        className="shrink-0 text-slate-500 hover:text-red-400 px-1.5 py-1 text-sm"
      >
        ✕
      </button>
    </div>
  );
};

const SpellRow = ({
  spell,
  onChange,
  onRemove,
}: {
  spell: SpellEntry;
  onChange: (patch: Partial<SpellEntry>) => void;
  onRemove: () => void;
}) => {
  const nameId = useId();
  return (
    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-lg p-2.5">
      <label htmlFor={nameId} className="sr-only">
        Spell name
      </label>
      <input
        id={nameId}
        type="text"
        value={spell.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Spell name"
        className="flex-1 min-w-0 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm focus:border-accent-500 outline-none"
      />
      <label className="flex items-center gap-1.5 shrink-0 text-xs text-slate-400 select-none">
        <input
          type="checkbox"
          checked={spell.prepared ?? false}
          onChange={(e) => onChange({ prepared: e.target.checked })}
          className="accent-accent-500"
        />
        Prepared
      </label>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${spell.name || 'spell'}`}
        className="shrink-0 text-slate-500 hover:text-red-400 px-1.5 py-1 text-sm"
      >
        ✕
      </button>
    </div>
  );
};

/** Free-text spell list — just names, split into two sections. Deliberately
 * not driven by class (no "Wizards must pick from the Wizard list" gating)
 * or backed by any spell catalog: the player just types whatever they want
 * to track. Available on every character regardless of class, since
 * plenty of non-caster builds still want to log scroll/item/multiclass
 * spells.
 *
 * Cantrips get their own section at the top — they're always available and
 * never "prepared" in the D&D sense, so their rows are name-only. Leveled
 * spells go below with an optional Prepared flag. There's no spell-level
 * field anywhere yet (nothing past level 1 is tracked), so a cantrip is
 * just "stored with level: 0" under the hood — the field itself stays
 * hidden from the player on both row types for now.
 */
export const Step6Spells = ({ character, updateCharacter }: Step6Props) => {
  const allSpells = character.spells ?? [];
  const cantrips = allSpells.filter((s) => s.level === 0);
  const spells = allSpells.filter((s) => s.level !== 0);

  const addCantrip = () => {
    updateCharacter({ spells: [...allSpells, { id: uid(), name: '', level: 0 }] });
  };
  const addSpell = () => {
    updateCharacter({ spells: [...allSpells, { id: uid(), name: '' }] });
  };
  const updateEntry = (id: string, patch: Partial<SpellEntry>) => {
    updateCharacter({ spells: allSpells.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  };
  const removeEntry = (id: string) => {
    updateCharacter({ spells: allSpells.filter((s) => s.id !== id) });
  };

  return (
    <Card className="p-8 space-y-8 anim-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-white">Spells</h2>
        <p className="text-slate-400 text-sm mt-1">Just type in names.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-400 uppercase text-xs tracking-wider">Cantrips</h3>
          <Button variant="ghost" onClick={addCantrip}>
            + Add Cantrip
          </Button>
        </div>
        {cantrips.length === 0 ? (
          <p className="text-slate-500 italic text-sm text-center py-6">No cantrips yet.</p>
        ) : (
          <div className="space-y-2">
            {cantrips.map((spell) => (
              <CantripRow key={spell.id} spell={spell} onChange={(patch) => updateEntry(spell.id, patch)} onRemove={() => removeEntry(spell.id)} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-slate-800 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-400 uppercase text-xs tracking-wider">Spells</h3>
          <Button variant="ghost" onClick={addSpell}>
            + Add Spell
          </Button>
        </div>
        {spells.length === 0 ? (
          <p className="text-slate-500 italic text-sm text-center py-6">No spells yet.</p>
        ) : (
          <div className="space-y-2">
            {spells.map((spell) => (
              <SpellRow key={spell.id} spell={spell} onChange={(patch) => updateEntry(spell.id, patch)} onRemove={() => removeEntry(spell.id)} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
