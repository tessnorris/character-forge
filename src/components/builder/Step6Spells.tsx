import { useId } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { uid } from '../../engine/dice';
import type { Character, SpellEntry } from '../../types/character';

interface Step6Props {
  character: Character;
  updateCharacter: (patch: Partial<Character>) => void;
}

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
  const levelId = useId();
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
      <label htmlFor={levelId} className="sr-only">
        Spell level
      </label>
      <input
        id={levelId}
        type="number"
        min={0}
        max={9}
        value={spell.level ?? ''}
        onChange={(e) => onChange({ level: e.target.value === '' ? undefined : Number(e.target.value) })}
        placeholder="Lvl"
        className="w-16 shrink-0 bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-sm text-center focus:border-accent-500 outline-none"
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

/** Free-text spell list — names only, with optional level/prepared flags.
 * Deliberately not driven by class (no "Wizards must pick from the Wizard
 * list" gating) or backed by any spell catalog: the player just types
 * whatever they want to track. Available on every character regardless of
 * class, since plenty of non-caster builds still want to log
 * scroll/item/multiclass spells. */
export const Step6Spells = ({ character, updateCharacter }: Step6Props) => {
  const spells = character.spells ?? [];

  const addSpell = () => {
    updateCharacter({ spells: [...spells, { id: uid(), name: '' }] });
  };
  const updateSpell = (id: string, patch: Partial<SpellEntry>) => {
    updateCharacter({ spells: spells.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  };
  const removeSpell = (id: string) => {
    updateCharacter({ spells: spells.filter((s) => s.id !== id) });
  };

  return (
    <Card className="p-8 space-y-4 anim-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-white">Spells</h2>
        <p className="text-slate-400 text-sm mt-1">Just type in names — level and prepared are optional.</p>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={addSpell}>
          + Add Spell
        </Button>
      </div>

      {spells.length === 0 ? (
        <p className="text-slate-500 italic text-sm text-center py-6">No spells yet.</p>
      ) : (
        <div className="space-y-2">
          {spells.map((spell) => (
            <SpellRow key={spell.id} spell={spell} onChange={(patch) => updateSpell(spell.id, patch)} onRemove={() => removeSpell(spell.id)} />
          ))}
        </div>
      )}
    </Card>
  );
};
