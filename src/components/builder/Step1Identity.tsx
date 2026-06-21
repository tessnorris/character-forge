import { useId } from 'react';
import { Card } from '../ui/Card';
import { SelectInput } from '../ui/SelectInput';
import { IconDice, IconGenderMale, IconGenderFemale, IconGenderNonbinary } from '../ui/icons';
import { CLASSES } from '../../data/classes';
import { SPECIES } from '../../data/species';
import { suggestName, hasNames } from '../../data/names';
import type { ReactElement } from 'react';
import type { Gender } from '../../types/character';
import type { StepProps } from './types';

const GENDERS: { value: Gender; label: string; Icon: () => ReactElement }[] = [
  { value: 'male', label: 'Male', Icon: IconGenderMale },
  { value: 'nonbinary', label: 'Non-binary', Icon: IconGenderNonbinary },
  { value: 'female', label: 'Female', Icon: IconGenderFemale },
];

export const Step1Identity = ({ character, updateCharacter }: StepProps) => {
  const nameId = useId();

  const canSuggest = hasNames(character.species);
  const rollName = () => {
    const suggestion = suggestName(character.species, character.gender);
    if (suggestion) updateCharacter({ name: suggestion });
  };

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
        <div className="flex gap-2">
          <input
            id={nameId}
            type="text"
            value={character.name}
            onChange={(e) => updateCharacter({ name: e.target.value })}
            placeholder="e.g. Mialee Brightwood"
            className="flex-1 min-w-0 bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
          />
          <button
            type="button"
            onClick={rollName}
            disabled={!canSuggest}
            title={canSuggest ? 'Suggest a name for this species' : 'Choose a species first'}
            aria-label="Suggest a name"
            className="shrink-0 flex items-center gap-2 px-4 rounded-lg border border-slate-600 text-slate-300 hover:border-accent-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-600 disabled:hover:text-slate-300"
          >
            <IconDice />
            <span className="hidden sm:inline font-semibold text-sm">Suggest</span>
          </button>
        </div>
        {!canSuggest && character.species && (
          <p className="text-xs text-slate-500 mt-1.5">No name suggestions for {character.species} yet.</p>
        )}
      </div>

      <div>
        <span className="block text-accent-400 font-semibold mb-2">Gender</span>
        <div className="flex gap-2">
          {GENDERS.map(({ value, label, Icon }) => {
            const selected = character.gender === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => updateCharacter({ gender: selected ? undefined : value })}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border transition-colors ${
                  selected ? 'border-accent-500 bg-accent-900/20 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                }`}
              >
                <Icon />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-1.5">Optional — used to tailor name suggestions.</p>
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
