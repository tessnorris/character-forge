import { useId } from 'react';
import { Card } from '../ui/Card';
import { SelectInput } from '../ui/SelectInput';
import { CLASSES } from '../../data/classes';
import { SPECIES } from '../../data/species';
import type { StepProps } from './types';

export const Step1Identity = ({ character, updateCharacter }: StepProps) => {
  const nameId = useId();
  return (
    <Card className="p-8 space-y-6 anim-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-white">Who are you?</h2>
        <p className="text-slate-400 text-sm mt-1">Name your hero and choose a class and species.</p>
      </div>
      <div>
        <label htmlFor={nameId} className="block text-accent-400 font-semibold mb-2">
          Character Name
        </label>
        <input
          id={nameId}
          type="text"
          value={character.name}
          onChange={(e) => updateCharacter({ name: e.target.value })}
          placeholder="e.g. Mialee Brightwood"
          className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
        />
      </div>
      <SelectInput
        label="Class"
        options={CLASSES}
        value={character.charClass}
        onChange={(v) =>
          updateCharacter({
            charClass: v,
            equipmentPackageId: null,
            purchasedItems: {},
            classSkills: [],
            weaponMastery: [],
            fightingStyle: undefined,
            classOrder: undefined,
            expertise: [],
            invocation: undefined,
          })
        }
        placeholder="-- Select Class --"
      />
      <SelectInput
        label="Species"
        options={SPECIES}
        value={character.species}
        onChange={(v) =>
          updateCharacter({
            species: v,
            speciesAncestry: undefined,
            speciesLineage: undefined,
            lineageSpellcastingAbility: undefined,
            speciesBonusSkill: undefined,
            speciesBonusFeat: undefined,
          })
        }
        placeholder="-- Select Species --"
      />
    </Card>
  );
};
