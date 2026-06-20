import { useId, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { parseDiceNotation, rollNotation, rollD20WithAdvantage, uid } from '../../engine/dice';
import type { RollResult, D20AdvantageResult } from '../../engine/dice';

const QUICK_DICE = [4, 6, 8, 10, 12, 20, 100];

type HistoryEntry =
  | { id: string; kind: 'roll'; label: string; result: RollResult }
  | { id: string; kind: 'advantage'; label: string; result: D20AdvantageResult };

const MAX_HISTORY = 20;

export const DiceRollerView = () => {
  const [notation, setNotation] = useState('');
  const [notationError, setNotationError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const notationId = useId();

  const pushEntry = (entry: HistoryEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
  };

  const rollQuickDie = (sides: number) => {
    const result = rollNotation({ count: 1, sides, modifier: 0 });
    pushEntry({ id: uid(), kind: 'roll', label: `d${sides}`, result });
  };

  const rollAdvantage = (mode: 'advantage' | 'disadvantage') => {
    const result = rollD20WithAdvantage(mode);
    pushEntry({ id: uid(), kind: 'advantage', label: mode === 'advantage' ? 'd20 (advantage)' : 'd20 (disadvantage)', result });
  };

  const submitNotation = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseDiceNotation(notation);
    if (!parsed) {
      setNotationError(`Couldn't parse "${notation}". Try something like 2d6+3.`);
      return;
    }
    setNotationError(null);
    const result = rollNotation(parsed);
    const label = notation.trim();
    pushEntry({ id: uid(), kind: 'roll', label, result });
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="anim-fade-in h-full flex flex-col">
      <div className="mb-4 border-b border-slate-800 pb-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Dice Roller</h2>
          <p className="text-slate-500 mt-1 text-sm">Quick rolls, custom notation, advantage/disadvantage</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 underline">
            Clear history
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Roll</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-5">
            {QUICK_DICE.map((sides) => (
              <button
                key={sides}
                onClick={() => rollQuickDie(sides)}
                className="bg-slate-800 border border-slate-700 hover:border-accent-500 hover:bg-slate-800/60 rounded-lg py-3 text-center font-bold text-white transition-colors"
              >
                d{sides}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-5">
            <Button variant="ghost" onClick={() => rollAdvantage('advantage')} className="flex-1">
              d20 Advantage
            </Button>
            <Button variant="ghost" onClick={() => rollAdvantage('disadvantage')} className="flex-1">
              d20 Disadvantage
            </Button>
          </div>

          <form onSubmit={submitNotation} className="space-y-2">
            <label htmlFor={notationId} className="block text-sm font-medium text-slate-300">
              Custom notation
            </label>
            <div className="flex gap-2">
              <input
                id={notationId}
                value={notation}
                onChange={(e) => {
                  setNotation(e.target.value);
                  if (notationError) setNotationError(null);
                }}
                placeholder="e.g. 2d6+3"
                className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:border-accent-500 outline-none"
              />
              <Button type="submit">Roll</Button>
            </div>
            {notationError && <p className="text-sm text-red-400">{notationError}</p>}
          </form>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">History</h3>
            <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300">{history.length}</span>
          </div>
          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-500 italic">No rolls yet.</div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {history.map((entry) => (
                <li key={entry.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-200">{entry.label}</div>
                    {entry.kind === 'roll' ? (
                      <div className="text-xs text-slate-500">
                        [{entry.result.rolls.join(', ')}]
                        {entry.result.notation.modifier !== 0 &&
                          ` ${entry.result.notation.modifier > 0 ? '+' : ''}${entry.result.notation.modifier}`}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">rolled {entry.result.rolls.join(' and ')}</div>
                    )}
                  </div>
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-slate-700 rounded border border-slate-600 text-xl font-bold text-white">
                    {entry.kind === 'roll' ? entry.result.total : entry.result.kept}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};
