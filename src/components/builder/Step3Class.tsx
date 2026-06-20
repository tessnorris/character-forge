import { useMemo } from 'react';
import { Card } from '../ui/Card';
import { CLASSES_DATA } from '../../data/classes';
import { SKILL_NAMES } from '../../data/skills';
import { BACKGROUNDS_BY_NAME } from '../../data/backgrounds';
import { WEAPONS, isSimple, isMartial, isMelee, isFinesseOrLight } from '../../data/weapons';
import { FIGHTING_STYLES } from '../../data/fightingStyles';
import { LEVEL_1_INVOCATIONS } from '../../data/invocations';
import { proficientSkills } from '../../engine/derive';
import type { WeaponMasteryPool } from '../../types/content';
import type { StepProps } from './types';

/** Filter the weapon catalog down to the pool a given Weapon Mastery grant
 * draws from. */
const weaponsForPool = (pool: WeaponMasteryPool) => {
  switch (pool) {
    case 'simpleOrMartial':
      return WEAPONS;
    case 'simpleOrMartialMelee':
      return WEAPONS.filter(isMelee);
    case 'finesseOrLight':
      return WEAPONS.filter((w) => (isSimple(w) || isMartial(w)) && isFinesseOrLight(w));
  }
};

/** A row of toggleable chips with an "(n of m selected)" counter. Used for
 * every checkbox-style picker on this step (skills, weapon mastery,
 * expertise) so the selection-limit behavior stays consistent. */
const ChipPicker = ({
  options,
  selected,
  max,
  onToggle,
}: {
  options: string[];
  selected: string[];
  max: number;
  onToggle: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      const isDisabled = !isSelected && selected.length >= max;
      return (
        <button
          key={opt}
          type="button"
          disabled={isDisabled}
          onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            isSelected
              ? 'border-accent-500 bg-accent-900/30 text-white'
              : isDisabled
                ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                : 'border-slate-700 text-slate-300 hover:border-accent-500 hover:text-white'
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

/** A vertical list of radio-style cards with name + description. Used for
 * every "choose exactly 1 of N named options" picker (Fighting Style,
 * Divine/Primal Order, Eldritch Invocation). */
const RadioCardPicker = ({
  options,
  selected,
  onSelect,
}: {
  options: { name: string; description: string }[];
  selected: string;
  onSelect: (name: string) => void;
}) => (
  <div className="space-y-2">
    {options.map((opt) => {
      const isSelected = selected === opt.name;
      return (
        <button
          key={opt.name}
          type="button"
          onClick={() => onSelect(opt.name)}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${
            isSelected ? 'border-accent-500 bg-accent-900/20' : 'border-slate-700 hover:border-slate-500'
          }`}
        >
          <div className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>{opt.name}</div>
          <div className="text-sm text-slate-400 mt-0.5">{opt.description}</div>
        </button>
      );
    })}
  </div>
);

const SectionHeading = ({ title, hint }: { title: string; hint: string }) => (
  <div className="mb-3">
    <h3 className="font-semibold text-slate-200">{title}</h3>
    <p className="text-sm text-slate-500">{hint}</p>
  </div>
);

export const Step3Class = ({ character, updateCharacter }: StepProps) => {
  const classDef = CLASSES_DATA.find((c) => c.name === character.charClass);
  const bg = character.background ? BACKGROUNDS_BY_NAME[character.background] : null;
  const features = classDef?.classFeatures1;

  const classSkills = character.classSkills ?? [];
  const weaponMastery = character.weaponMastery ?? [];
  const expertise = character.expertise ?? [];

  // Skill choice options: the class's fixed list, or all 18 skills for
  // "any" classes like Bard. Background's two fixed skills are excluded
  // from the *pickable* list since they're already locked in — picking the
  // same skill again wouldn't grant anything new — but still shown above
  // as read-only context.
  const skillOptions = useMemo(() => {
    if (!classDef) return [];
    const all = classDef.skillChoices.options === 'any' ? SKILL_NAMES : classDef.skillChoices.options;
    const bgSkillSet = new Set(bg?.skills ?? []);
    return all.filter((s) => !bgSkillSet.has(s));
  }, [classDef, bg]);

  const weaponOptions = useMemo(() => {
    if (!features?.weaponMastery) return [];
    return weaponsForPool(features.weaponMastery.pool).map((w) => w.name);
  }, [features]);

  // Expertise picks from skills the character is actually proficient in —
  // background's fixed skills plus whatever was picked above in this step.
  const expertiseOptions = useMemo(() => {
    if (!features?.expertise) return [];
    return proficientSkills({ ...character, classSkills });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, character.background, classSkills]);

  if (!character.charClass || !classDef) {
    return (
      <Card className="p-8 text-center anim-fade-in">
        <p className="text-slate-400">Choose a class in Step 1 to see its skills and class features here.</p>
      </Card>
    );
  }

  const toggleSkill = (skill: string) => {
    const next = classSkills.includes(skill) ? classSkills.filter((s) => s !== skill) : [...classSkills, skill];
    updateCharacter({ classSkills: next });
  };

  const toggleWeapon = (weapon: string) => {
    const next = weaponMastery.includes(weapon) ? weaponMastery.filter((w) => w !== weapon) : [...weaponMastery, weapon];
    updateCharacter({ weaponMastery: next });
  };

  const toggleExpertise = (skill: string) => {
    const next = expertise.includes(skill) ? expertise.filter((s) => s !== skill) : [...expertise, skill];
    updateCharacter({ expertise: next });
  };

  const skillCount = classDef.skillChoices.count;

  return (
    <Card className="p-8 space-y-8 anim-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-white">{character.charClass} Features</h2>
        <p className="text-slate-400 text-sm mt-1">Skills and class-specific choices granted at level 1.</p>
      </div>

      {bg && (
        <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">
            Already granted by your <span className="text-slate-300 font-medium">{character.background}</span> background:
          </div>
          <div className="flex flex-wrap gap-2">
            {bg.skills.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-300">
                {s}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-300">{bg.feat}</span>
          </div>
        </div>
      )}

      <div>
        <SectionHeading
          title={`Skill Proficiencies (choose ${skillCount})`}
          hint={classDef.skillChoices.options === 'any' ? 'This class can choose from any skill.' : 'Choose from this class\u2019s skill list.'}
        />
        <ChipPicker options={skillOptions} selected={classSkills} max={skillCount} onToggle={toggleSkill} />
        <p className="text-xs text-slate-500 mt-2">
          {classSkills.length} of {skillCount} selected
        </p>
      </div>

      {features?.weaponMastery && (
        <div>
          <SectionHeading title={`Weapon Mastery (choose ${features.weaponMastery.count})`} hint="You can use the mastery property of these weapons." />
          <ChipPicker options={weaponOptions} selected={weaponMastery} max={features.weaponMastery.count} onToggle={toggleWeapon} />
          <p className="text-xs text-slate-500 mt-2">
            {weaponMastery.length} of {features.weaponMastery.count} selected
          </p>
        </div>
      )}

      {features?.fightingStyle && (
        <div>
          <SectionHeading title="Fighting Style (choose 1)" hint="A combat specialization feat." />
          <RadioCardPicker options={FIGHTING_STYLES} selected={character.fightingStyle ?? ''} onSelect={(name) => updateCharacter({ fightingStyle: name })} />
        </div>
      )}

      {features?.order && (
        <div>
          <SectionHeading title={`${features.order.label} (choose 1)`} hint="A sacred role you've dedicated yourself to." />
          <RadioCardPicker options={features.order.options} selected={character.classOrder ?? ''} onSelect={(name) => updateCharacter({ classOrder: name })} />
        </div>
      )}

      {features?.expertise && (
        <div>
          <SectionHeading title={`Expertise (choose ${features.expertise.count})`} hint="Pick from skills you're already proficient in for double proficiency bonus." />
          {expertiseOptions.length === 0 ? (
            <p className="text-sm text-slate-500 italic">Pick your skill proficiencies above first.</p>
          ) : (
            <>
              <ChipPicker options={expertiseOptions} selected={expertise} max={features.expertise.count} onToggle={toggleExpertise} />
              <p className="text-xs text-slate-500 mt-2">
                {expertise.length} of {features.expertise.count} selected
              </p>
            </>
          )}
        </div>
      )}

      {features?.invocation && (
        <div>
          <SectionHeading title="Eldritch Invocation (choose 1)" hint="Forbidden knowledge available at level 1." />
          <RadioCardPicker options={LEVEL_1_INVOCATIONS} selected={character.invocation ?? ''} onSelect={(name) => updateCharacter({ invocation: name })} />
        </div>
      )}
    </Card>
  );
};
