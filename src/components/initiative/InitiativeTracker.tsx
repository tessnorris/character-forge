import { useMemo, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { numberInputCls } from '../ui/SelectInput';
import { IconTrash } from '../ui/icons';
import { uid, getMod, rollD20 } from '../../engine/dice';
import { compareCombatants, findTieGroup } from '../../engine/derive';
import { TieBreakerModal, type TieResolution } from './TieBreakerModal';
import type { Combatant } from '../../types/character';

interface InitiativeTrackerProps {
  combatants: Combatant[];
  setCombatants: React.Dispatch<React.SetStateAction<Combatant[]>>;
}

interface FormData {
  name: string;
  init: string;
  dex: string;
  ac: string;
  hp: string;
}

const emptyForm: FormData = { name: '', init: '', dex: '', ac: '', hp: '' };

export const InitiativeTracker = ({ combatants, setCombatants }: InitiativeTrackerProps) => {
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const sortedList = useMemo(() => [...combatants].sort(compareCombatants), [combatants]);

  // Derived directly from combatants — no effect needed. Resolving a tie
  // updates `combatants` (adding to tieHistory), which naturally recomputes
  // this and clears or advances to the next unresolved tie.
  const tieGroup = useMemo(() => findTieGroup(combatants), [combatants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.init === '' || formData.dex === '') return;
    const newCombatant: Combatant = {
      id: uid(),
      name: formData.name,
      init: parseInt(formData.init),
      dex: parseInt(formData.dex),
      ac: formData.ac === '' ? 10 : parseInt(formData.ac),
      hp: formData.hp === '' ? 10 : parseInt(formData.hp),
      tieHistory: [],
    };
    setCombatants((prev) => [...prev, newCombatant]);
    setFormData(emptyForm);
    const el = document.getElementById('nameInput');
    if (el) el.focus();
  };

  const handleDelete = (id: string) => setCombatants((prev) => prev.filter((c) => c.id !== id));
  const updateInit = (id: string, value: string) =>
    setCombatants((prev) => prev.map((c) => (c.id === id ? { ...c, init: value === '' ? 0 : parseInt(value) } : c)));
  const rerollInit = (id: string) =>
    setCombatants((prev) => prev.map((c) => (c.id === id ? { ...c, init: rollD20() + getMod(c.dex) } : c)));
  const handleReset = () => {
    if (confirm('Clear all combatants?')) setCombatants([]);
  };

  const handleTieResolution = (resolutions: TieResolution[]) => {
    setCombatants((prev) =>
      prev.map((c) => {
        const res = resolutions.find((r) => r.id === c.id);
        return res ? { ...c, tieHistory: [...c.tieHistory, res.roll] } : c;
      }),
    );
  };

  return (
    <div className="anim-fade-in h-full flex flex-col">
      <div className="mb-4 border-b border-slate-800 pb-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Initiative Tracker</h2>
          <p className="text-slate-500 mt-1 text-sm">Auto-sorting · tie-breaker logic</p>
        </div>
        <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-300 underline">
          Clear table
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-6">
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-accent-400">+</span> Add Combatant
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-300">Name</label>
                <input
                  id="nameInput"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:border-accent-500 outline-none"
                  placeholder="e.g. Goblin King"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">Initiative</label>
                  <input
                    type="number"
                    value={formData.init}
                    onChange={(e) => setFormData((p) => ({ ...p, init: e.target.value }))}
                    className={numberInputCls}
                    placeholder="d20 + Dex"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">Dexterity</label>
                  <input
                    type="number"
                    value={formData.dex}
                    onChange={(e) => setFormData((p) => ({ ...p, dex: e.target.value }))}
                    className={numberInputCls}
                    placeholder="Score"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">Armor Class</label>
                  <input
                    type="number"
                    value={formData.ac}
                    onChange={(e) => setFormData((p) => ({ ...p, ac: e.target.value }))}
                    className={numberInputCls}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-300">HP</label>
                  <input
                    type="number"
                    value={formData.hp}
                    onChange={(e) => setFormData((p) => ({ ...p, hp: e.target.value }))}
                    className={numberInputCls}
                    placeholder="Max"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add to Combat
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="overflow-hidden">
            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Initiative Order</h3>
              <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300">{combatants.length} entities</span>
            </div>
            {combatants.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic">No combatants yet. The battlefield is silent.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-slate-300">
                  <thead className="text-xs uppercase bg-slate-800/60 text-slate-400">
                    <tr>
                      <th className="px-3 py-3 text-center w-12">#</th>
                      <th className="px-3 py-3">Character</th>
                      <th className="px-3 py-3 text-center text-accent-400">Init</th>
                      <th className="px-3 py-3 text-center">Dex</th>
                      <th className="px-3 py-3 text-center">AC</th>
                      <th className="px-3 py-3 text-center text-red-400">HP</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {sortedList.map((c, index) => (
                      <tr key={c.id} className={`hover:bg-slate-800/40 ${c.isPC ? 'bg-accent-900/10' : ''}`}>
                        <td className="px-3 py-3 text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="px-3 py-3">
                          <div className="font-bold text-white flex items-center gap-2">
                            {c.name}
                            {c.isPC && <span className="text-[10px] bg-accent-700 text-white px-1.5 py-0.5 rounded uppercase tracking-wide">PC</span>}
                          </div>
                          {c.tieHistory.length > 0 && <div className="text-xs text-slate-500 mt-1">Tie rolls: {c.tieHistory.join(' → ')}</div>}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={c.init}
                              onChange={(e) => updateInit(c.id, e.target.value)}
                              className="w-14 bg-slate-800 border border-slate-700 text-accent-300 font-bold text-center rounded p-1 focus:border-accent-500 outline-none"
                            />
                            <button onClick={() => rerollInit(c.id)} title="Roll d20 + Dex mod" className="text-slate-500 hover:text-accent-400">
                              🎲
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-mono">{c.dex}</td>
                        <td className="px-3 py-3 text-center font-mono">{c.ac}</td>
                        <td className="px-3 py-3 text-center font-mono text-red-300 font-bold">{c.hp}</td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => handleDelete(c.id)}
                            title="Remove"
                            className="p-2 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded transition-all"
                          >
                            <IconTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {tieGroup && (
        <TieBreakerModal
          key={tieGroup.map((c) => c.id).join(',')}
          group={tieGroup}
          onResolve={handleTieResolution}
        />
      )}
    </div>
  );
};
