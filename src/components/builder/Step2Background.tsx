import { useId } from 'react';
import { Card } from '../ui/Card';
import { SelectInput } from '../ui/SelectInput';
import { AbilityBadge } from '../ui/AbilityBadge';
import { BACKGROUNDS } from '../../data/backgrounds';
import type { StepProps } from './types';

export const Step2Background = ({ character, updateCharacter }: StepProps) => {
  const bg = character.background;
  const abilities = bg ? BACKGROUNDS[bg] : [];
  const plus2Id = useId();
  const plus1Id = useId();

  const handleBgChange = (val: string) => {
    if (!val) {
      updateCharacter({ background: '', bonus2: '', bonus1: '' });
      return;
    }
    const a = BACKGROUNDS[val];
    updateCharacter({ background: val, bonus2: a[0], bonus1: a[1] });
  };

  const handleBonus2 = (val: string) => {
    let b1 = character.bonus1;
    if (val === b1) b1 = abilities.find((a) => a !== val) ?? b1;
    updateCharacter({ bonus2: val, bonus1: b1 });
  };
  const handleBonus1 = (val: string) => {
    let b2 = character.bonus2;
    if (val === b2) b2 = abilities.find((a) => a !== val) ?? b2;
    updateCharacter({ bonus1: val, bonus2: b2 });
  };

  return (
    <Card className="p-8 space-y-6 anim-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-white">Background</h2>
        <p className="text-slate-400 text-sm mt-1">Your background grants ability-score increases.</p>
      </div>

      <SelectInput
        label="Choose a Background"
        options={Object.keys(BACKGROUNDS)}
        value={bg}
        onChange={handleBgChange}
        placeholder="-- Select Background --"
      />

      {bg && (
        <div className="anim-fade-in-down space-y-6">
          <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 flex items-center gap-3 flex-wrap">
            <span className="text-slate-400 text-sm">Associated abilities:</span>
            {abilities.map((a) => (
              <AbilityBadge key={a} ability={a} />
            ))}
          </div>

          <div className="bg-slate-800/60 p-5 rounded-lg border border-slate-700">
            <h3 className="font-semibold mb-3 text-slate-200">Bonus distribution</h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {[
                { v: '2-1' as const, label: '+2 and +1' },
                { v: '1-1-1' as const, label: '+1 to all three' },
              ].map((opt) => (
                <label
                  key={opt.v}
                  className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors
                                            ${
                                              character.bonusType === opt.v
                                                ? 'border-accent-500 bg-accent-900/20 text-white'
                                                : 'border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                >
                  <input
                    type="radio"
                    name="bonusType"
                    value={opt.v}
                    checked={character.bonusType === opt.v}
                    onChange={() => updateCharacter({ bonusType: opt.v })}
                    className="accent-orange-500"
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>

            {character.bonusType === '2-1' && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor={plus2Id} className="text-sm font-medium text-slate-400 mb-1 block">
                    +2 Ability
                  </label>
                  <select
                    id={plus2Id}
                    value={character.bonus2}
                    onChange={(e) => handleBonus2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-accent-500"
                  >
                    {abilities.map((a) => (
                      <option key={a} value={a} disabled={a === character.bonus1}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor={plus1Id} className="text-sm font-medium text-slate-400 mb-1 block">
                    +1 Ability
                  </label>
                  <select
                    id={plus1Id}
                    value={character.bonus1}
                    onChange={(e) => handleBonus1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-accent-500"
                  >
                    {abilities.map((a) => (
                      <option key={a} value={a} disabled={a === character.bonus2}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {character.bonusType === '1-1-1' && (
              <div className="text-slate-300 bg-accent-900/20 p-3 rounded border border-accent-800/60 text-sm">
                Applying <strong className="text-accent-400">+1</strong> to {abilities.join(', ')}.
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
