import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CLASSES_DATA } from '../../data/classes';
import { SHOP_ITEMS } from '../../data/equipment';
import { formatCurrency } from '../../engine/derive';
import type { StepProps } from './types';

interface Step4Props extends StepProps {
  onJump: (step: number) => void;
}

export const Step4Equipment = ({ character, updateCharacter, onJump }: Step4Props) => {
  const classObj = CLASSES_DATA.find((c) => c.name === character.charClass);
  const pkg = classObj ? classObj.packages.find((p) => p.id === character.equipmentPackageId) : undefined;

  // Cheap computations over small objects — the React Compiler handles
  // memoization automatically, so no manual useMemo is needed here.
  let spentFundsCP = 0;
  for (const [name, qty] of Object.entries(character.purchasedItems || {})) {
    const item = SHOP_ITEMS.find((i) => i.name === name);
    if (item) spentFundsCP += item.costCP * qty;
  }

  const combinedEquipment: Record<string, number> = pkg ? { ...pkg.items } : {};
  for (const [name, qty] of Object.entries(character.purchasedItems || {})) {
    combinedEquipment[name] = (combinedEquipment[name] || 0) + qty;
  }

  const initialFundsCP = pkg ? pkg.gp * 100 : 0;
  const remainingFundsCP = initialFundsCP - spentFundsCP;

  const updateCart = (name: string, delta: number) => {
    const prev = character.purchasedItems || {};
    const qty = (prev[name] || 0) + delta;
    const next = { ...prev };
    if (qty <= 0) delete next[name];
    else next[name] = qty;
    updateCharacter({ purchasedItems: next });
  };

  if (!classObj) {
    return (
      <Card className="p-8 text-center anim-fade-in">
        <p className="text-slate-400 mb-4">Choose a class first to pick starting equipment.</p>
        <Button onClick={() => onJump(1)}>Go to Identity</Button>
      </Card>
    );
  }

  // Package selection
  if (!pkg) {
    return (
      <Card className="p-8 anim-fade-in">
        <h2 className="text-2xl font-bold text-white mb-1">Starting Equipment — {classObj.name}</h2>
        <p className="text-slate-400 text-sm mb-6">Choose a starting package. You can spend leftover gold in the shop.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classObj.packages.map((p) => (
            <button
              key={p.id}
              onClick={() => updateCharacter({ equipmentPackageId: p.id, purchasedItems: {} })}
              className="bg-slate-800 border-2 border-slate-700 rounded-xl p-5 text-left hover:border-accent-500 hover:bg-slate-800/60 transition-colors"
            >
              <span className="text-slate-200 leading-relaxed">{p.desc}</span>
            </button>
          ))}
        </div>
      </Card>
    );
  }

  // Shop + summary (fills the fixed page height; lists scroll internally)
  return (
    <div className="h-full flex flex-col gap-4 anim-fade-in">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold text-white">Additional Gear</h2>
        <button
          onClick={() => updateCharacter({ equipmentPackageId: null, purchasedItems: {} })}
          className="text-sm text-accent-400 hover:text-accent-300 font-medium"
        >
          ← Change package
        </button>
      </div>

      {/* Remaining money */}
      <div className="flex items-center justify-between bg-accent-700 rounded-lg px-5 py-3 shrink-0">
        <span className="text-accent-100 text-xs font-semibold uppercase tracking-wider">Remaining Money</span>
        <span className="text-2xl font-bold text-white">{formatCurrency(remainingFundsCP)}</span>
      </div>

      {/* Shop — fills remaining height with its own scrollbar */}
      <Card className="overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-4 py-2.5 border-b border-slate-800 text-xs text-slate-400 shrink-0">
          Shop — spend remaining GP. 1 GP = 10 SP = 100 CP.
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-slate-400 text-sm sticky top-0">
              <tr>
                <th className="p-3 font-semibold">Item</th>
                <th className="p-3 font-semibold">Cost</th>
                <th className="p-3 font-semibold text-center">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {SHOP_ITEMS.map((item) => {
                const qty = (character.purchasedItems || {})[item.name] || 0;
                const canAfford = remainingFundsCP >= item.costCP;
                return (
                  <tr key={item.name} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-200">{item.name}</td>
                    <td className="p-3 text-slate-400">{formatCurrency(item.costCP)}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => updateCart(item.name, -1)}
                          disabled={qty === 0}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-700 text-slate-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-white">{qty}</span>
                        <button
                          onClick={() => updateCart(item.name, 1)}
                          disabled={!canAfford}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-700 text-slate-200 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Equipment list */}
      <Card className="p-5 shrink-0">
        <h3 className="font-bold text-white mb-3 border-b border-slate-800 pb-2">Equipment List</h3>
        {Object.keys(combinedEquipment).length === 0 ? (
          <p className="text-slate-500 italic text-sm">No equipment yet.</p>
        ) : (
          <div className="max-h-48 overflow-y-auto">
            <ul className="space-y-2 pr-1">
              {Object.entries(combinedEquipment)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([name, qty]) => (
                  <li key={name} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">{name}</span>
                    <span className="bg-slate-800 text-slate-300 py-1 px-3 rounded-full font-medium text-xs">x{qty}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};
