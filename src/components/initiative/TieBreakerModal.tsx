import { useState } from 'react';
import { Button } from '../ui/Button';
import { IconD20 } from '../ui/icons';
import { rollD20 } from '../../engine/dice';
import type { Combatant } from '../../types/character';

export interface TieResolution {
  id: string;
  roll: number;
}

interface TieBreakerModalProps {
  group: Combatant[];
  onResolve: (resolutions: TieResolution[]) => void;
}

const emptyRolls = (group: Combatant[]): Record<string, string | number> => {
  const init: Record<string, string | number> = {};
  group.forEach((c) => {
    init[c.id] = '';
  });
  return init;
};

export const TieBreakerModal = ({ group, onResolve }: TieBreakerModalProps) => {
  // Initialized directly from props rather than via an effect: the parent
  // mounts this with a `key` tied to the group's member IDs, so React
  // remounts (and re-initializes this state) whenever the tied set changes.
  const [rolls, setRolls] = useState<Record<string, string | number>>(() => emptyRolls(group));

  const handleAutoRoll = () => {
    const next: Record<string, number> = {};
    group.forEach((c) => {
      next[c.id] = rollD20();
    });
    setRolls(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolved: TieResolution[] = [];
    for (const c of group) {
      const val = parseInt(String(rolls[c.id]));
      if (isNaN(val)) {
        alert(`Please enter a roll for ${c.name}`);
        return;
      }
      resolved.push({ id: c.id, roll: val });
    }
    onResolve(resolved);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-6 anim-fade-in">
        <div className="flex items-center gap-3 mb-4 text-accent-400">
          <IconD20 />
          <h2 className="text-xl font-bold text-white">Tie Breaker Needed!</h2>
        </div>
        <p className="mb-4 text-slate-300 text-sm">
          These combatants share Initiative, Dexterity, and prior tie rolls. Roll a d20 for each to break the tie.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 mb-6">
            {group.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                <div>
                  <div className="font-bold text-white">{c.name}</div>
                  <div className="text-xs text-slate-400">
                    Init: {c.init} | Dex: {c.dex}
                    {c.tieHistory.length > 0 && ` | Prev: [${c.tieHistory.join(', ')}]`}
                  </div>
                </div>
                <input
                  type="number"
                  className="bg-slate-900 border border-slate-600 text-white text-center w-16 p-2 rounded focus:border-accent-500 outline-none"
                  value={rolls[c.id] ?? ''}
                  onChange={(e) => setRolls((prev) => ({ ...prev, [c.id]: e.target.value }))}
                  autoFocus={i === 0}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={handleAutoRoll}>
              Auto Roll All
            </Button>
            <Button type="submit">Resolve Tie</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
