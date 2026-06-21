import { useId } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ABILITY_NAMES, ABILITY_BY_NAME, ABILITY_BY_ID } from '../../data/abilities';
import { CLASSES_DATA } from '../../data/classes';
import { SPECIES_DATA } from '../../data/species';
import { BACKGROUNDS_BY_NAME } from '../../data/backgrounds';
import { finalScores, proficientSkills } from '../../engine/derive';
import { emptyCharacterDetails } from '../../types/character';
import type { Character, CharacterDetails } from '../../types/character';
import type { ReactNode } from 'react';

interface Step8Props {
  character: Character;
  updateCharacter: (patch: Partial<Character>) => void;
  onOpenInitiative: () => void;
  onSave?: () => void;
}

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between items-center border-b border-slate-800 py-2">
    <span className="text-slate-500 uppercase text-xs tracking-wider">{label}</span>
    <span className="text-lg font-bold text-accent-400">{value || '—'}</span>
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:border-accent-500 outline-none resize-y min-h-[5rem]"
      />
    </div>
  );
};

export const Step8Sheet = ({ character, updateCharacter, onOpenInitiative, onSave }: Step8Props) => {
  const scores = finalScores(character);
  const rolled = !!character.baseScores;
  const details = character.details ?? emptyCharacterDetails();
  const skills = proficientSkills(character);
  const bg = character.background ? BACKGROUNDS_BY_NAME[character.background] : null;

  const updateDetails = (patch: Partial<CharacterDetails>) => {
    updateCharacter({ details: { ...details, ...patch } });
  };

  const classObj = CLASSES_DATA.find((c) => c.name === character.charClass);
  const speciesObj = SPECIES_DATA.find((s) => s.name === character.species);
  const pkg = classObj?.packages.find((p) => p.id === character.equipmentPackageId);
  const combinedEquipment: Record<string, number> = {};
  if (pkg) {
    Object.assign(combinedEquipment, pkg.items);
    for (const [name, qty] of Object.entries(character.purchasedItems || {})) {
      combinedEquipment[name] = (combinedEquipment[name] || 0) + qty;
    }
  }

  return (
    <Card className="overflow-hidden anim-fade-in">
      <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{character.name || 'Unnamed Adventurer'}</h2>
          <p className="text-slate-400 text-sm">{[character.species, character.charClass].filter(Boolean).join(' · ') || 'Character Sheet'}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {onSave && (
            <Button variant="ghost" onClick={onSave}>
              💾 Save
            </Button>
          )}
          <Button onClick={onOpenInitiative}>⚔ Initiative</Button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Field label="Class" value={character.charClass} />
          <Field label="Species" value={character.species} />
          <Field label="Background" value={character.background} />
        </div>
        <div>
          <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-2">Ability Scores</h3>
          {!rolled && <p className="text-slate-500 italic text-sm mb-2">Roll abilities in the Abilities step to see final scores.</p>}
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left py-1">Ability</th>
                <th className="text-center py-1">Base</th>
                <th className="text-center py-1">Bonus</th>
                <th className="text-center py-1">Final</th>
              </tr>
            </thead>
            <tbody>
              {ABILITY_NAMES.map((n) => {
                const s = scores[n];
                return (
                  <tr key={n} className="border-t border-slate-800">
                    <td className="py-1.5 text-slate-300">{ABILITY_BY_NAME[n].short}</td>
                    <td className="py-1.5 text-center text-slate-400">{s.base == null ? '—' : s.base}</td>
                    <td className={`py-1.5 text-center font-bold ${s.bonus > 0 ? 'text-accent-400' : 'text-slate-600'}`}>
                      {s.bonus > 0 ? `+${s.bonus}` : '—'}
                    </td>
                    <td className="py-1.5 text-center text-lg font-bold text-white">{s.final == null ? '—' : s.final}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 border-t border-slate-800">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Skills &amp; Class Features</h3>
        {skills.length === 0 ? (
          <p className="text-slate-500 italic text-sm">No skill proficiencies selected yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((s) => (
              <span key={s} className="bg-slate-800 border border-slate-700 text-slate-300 py-1 px-3 rounded-full text-sm">
                {s}
              </span>
            ))}
          </div>
        )}
        {bg && (
          <div className="text-sm text-slate-400 mb-1">
            Origin Feat: <span className="text-slate-200 font-medium">{bg.feat}</span>
          </div>
        )}
        {character.weaponMastery && character.weaponMastery.length > 0 && (
          <div className="text-sm text-slate-400 mb-1">
            Weapon Mastery: <span className="text-slate-200 font-medium">{character.weaponMastery.join(', ')}</span>
          </div>
        )}
        {character.fightingStyle && (
          <div className="text-sm text-slate-400 mb-1">
            Fighting Style: <span className="text-slate-200 font-medium">{character.fightingStyle}</span>
          </div>
        )}
        {character.classOrder && (
          <div className="text-sm text-slate-400 mb-1">
            Order: <span className="text-slate-200 font-medium">{character.classOrder}</span>
          </div>
        )}
        {character.expertise && character.expertise.length > 0 && (
          <div className="text-sm text-slate-400 mb-1">
            Expertise: <span className="text-slate-200 font-medium">{character.expertise.join(', ')}</span>
          </div>
        )}
        {character.invocation && (
          <div className="text-sm text-slate-400 mb-1">
            Eldritch Invocation: <span className="text-slate-200 font-medium">{character.invocation}</span>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Species Traits</h3>
        {!speciesObj?.speciesFeatures1 ? (
          <p className="text-slate-500 italic text-sm">{character.species ? 'No species choices for this character.' : 'No species selected yet.'}</p>
        ) : (
          <>
            {character.speciesAncestry && (
              <div className="text-sm text-slate-400 mb-1">
                {speciesObj.speciesFeatures1.ancestry?.label ?? 'Ancestry'}: <span className="text-slate-200 font-medium">{character.speciesAncestry}</span>
              </div>
            )}
            {character.speciesLineage && (
              <div className="text-sm text-slate-400 mb-1">
                {speciesObj.speciesFeatures1.lineage?.label ?? 'Lineage'}: <span className="text-slate-200 font-medium">{character.speciesLineage}</span>
                {character.lineageSpellcastingAbility && (
                  <>
                    {' '}
                    (spellcasting: <span className="text-slate-200 font-medium">{ABILITY_BY_ID[character.lineageSpellcastingAbility]?.name ?? character.lineageSpellcastingAbility}</span>)
                  </>
                )}
              </div>
            )}
            {character.speciesBonusSkill && (
              <div className="text-sm text-slate-400 mb-1">
                Bonus Skill: <span className="text-slate-200 font-medium">{character.speciesBonusSkill}</span>
              </div>
            )}
            {character.speciesBonusFeat && (
              <div className="text-sm text-slate-400 mb-1">
                Bonus Origin Feat: <span className="text-slate-200 font-medium">{character.speciesBonusFeat}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-6 border-t border-slate-800">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Equipment</h3>
        {Object.keys(combinedEquipment).length === 0 ? (
          <p className="text-slate-500 italic text-sm">No equipment selected.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(combinedEquipment)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, qty]) => (
                <span key={name} className="bg-slate-800 border border-slate-700 text-slate-300 py-1 px-3 rounded-full text-sm">
                  {name} <span className="text-slate-500">×{qty}</span>
                </span>
              ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 space-y-4">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider">Character Details</h3>
        <TextAreaField
          label="Background story"
          value={details.backgroundDescription}
          onChange={(v) => updateDetails({ backgroundDescription: v })}
          placeholder="How did they get here? What shaped them?"
        />
        <TextAreaField
          label="Physical description"
          value={details.physicalDescription}
          onChange={(v) => updateDetails({ physicalDescription: v })}
          placeholder="Height, build, distinguishing features..."
        />
        <TextAreaField
          label="Personality"
          value={details.personality}
          onChange={(v) => updateDetails({ personality: v })}
          placeholder="Traits, ideals, bonds, flaws..."
        />
        <TextAreaField
          label="Notes"
          value={details.notes}
          onChange={(v) => updateDetails({ notes: v })}
          placeholder="Anything else worth remembering..."
        />
      </div>
    </Card>
  );
};
