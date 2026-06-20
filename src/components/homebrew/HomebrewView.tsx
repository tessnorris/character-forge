import { useId, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { uid } from '../../engine/dice';
import { formatCurrency } from '../../engine/derive';
import type { UserContent, CustomEquipmentItem } from '../../types/content';

interface HomebrewViewProps {
  userContent: UserContent;
  updateUserContent: (patch: Partial<UserContent>) => void;
}

interface FormState {
  name: string;
  description: string;
  costGP: string; // entered in GP for convenience; stored as costCP
}

const emptyForm: FormState = { name: '', description: '', costGP: '' };

export const HomebrewView = ({ userContent, updateUserContent }: HomebrewViewProps) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const nameId = useId();
  const descId = useId();
  const costId = useId();

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    const gp = parseFloat(form.costGP);
    const item: CustomEquipmentItem = {
      id: uid(),
      name,
      description: form.description.trim() || undefined,
      costCP: !isNaN(gp) && gp >= 0 ? Math.round(gp * 100) : undefined,
    };

    updateUserContent({ customEquipment: [...userContent.customEquipment, item] });
    setForm(emptyForm);
  };

  const removeItem = (id: string) => {
    updateUserContent({ customEquipment: userContent.customEquipment.filter((i) => i.id !== id) });
  };

  return (
    <div className="anim-fade-in h-full flex flex-col">
      <div className="mb-4 border-b border-slate-800 pb-4 shrink-0">
        <h2 className="text-3xl font-bold text-white">Homebrew Equipment</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Add campaign-specific gear that isn't in the standard catalog. Items with a cost appear in the equipment
          shop; items without one can still be carried.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-accent-400">+</span> Add Item
          </h3>
          <form onSubmit={addItem} className="space-y-4">
            <div>
              <label htmlFor={nameId} className="block mb-1 text-sm font-medium text-slate-300">
                Name
              </label>
              <input
                id={nameId}
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:border-accent-500 outline-none"
                placeholder="e.g. Glowing Hex Coin"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label htmlFor={descId} className="block mb-1 text-sm font-medium text-slate-300">
                Description <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <textarea
                id={descId}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:border-accent-500 outline-none resize-y min-h-[4.5rem]"
                placeholder="What it does, where it came from..."
              />
            </div>
            <div className="max-w-xs">
              <label htmlFor={costId} className="block mb-1 text-sm font-medium text-slate-300">
                Cost in GP <span className="text-slate-500 font-normal">(optional — leave blank if not for sale)</span>
              </label>
              <input
                id={costId}
                type="number"
                min="0"
                step="0.01"
                value={form.costGP}
                onChange={(e) => setForm((p) => ({ ...p, costGP: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-center focus:border-accent-500 outline-none"
                placeholder="0"
              />
            </div>
            <Button type="submit" className="w-full">
              Add to Homebrew
            </Button>
          </form>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Your Items</h3>
            <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300">
              {userContent.customEquipment.length} item{userContent.customEquipment.length === 1 ? '' : 's'}
            </span>
          </div>
          {userContent.customEquipment.length === 0 ? (
            <div className="p-12 text-center text-slate-500 italic">No homebrew items yet.</div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {userContent.customEquipment.map((item) => (
                <li key={item.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-xs text-slate-400">
                        {item.costCP != null ? formatCurrency(item.costCP) : 'not for sale'}
                      </span>
                    </div>
                    {item.description && <p className="text-sm text-slate-400 mt-1">{item.description}</p>}
                  </div>
                  <Button variant="danger" onClick={() => removeItem(item.id)} className="shrink-0">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};
