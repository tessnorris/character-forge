import { SPECIES_DATA } from '../../data/species';
import { SKILL_NAMES } from '../../data/skills';
import { FEATS } from '../../data/feats';
import { ABILITY_BY_ID } from '../../data/abilities';
import { Card } from '../ui/Card';
import { RadioCardPicker, RadioChipPicker, SectionHeading } from '../ui/Pickers';
import type { LineageOption } from '../../types/content';
import type { StepProps } from './types';

/** A compact preview of a lineage option's level 1/3/5 grants, shown below
 * the RadioCardPicker once a lineage is selected — the picker card itself
 * only has room for the trait description, not the full leveled spell
 * list, so this fills in the rest. */
const LineageGrantPreview = ({ option }: { option: LineageOption }) => (
  <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 space-y-1.5">
    {option.grants.map((g) => (
      <div key={g.level} className="text-sm text-slate-400">
        <span className="text-accent-400 font-semibold">Level {g.level}:</span> <span className="text-slate-200 font-medium">{g.name}</span> — {g.description}
      </div>
    ))}
  </div>
);

export const Step3Species = ({ character, updateCharacter }: StepProps) => {
  const speciesDef = SPECIES_DATA.find((s) => s.name === character.species);
  const features = speciesDef?.speciesFeatures1;

  if (!character.species || !speciesDef) {
    return (
      <Card className="p-8 text-center anim-fade-in">
        <p className="text-slate-400">Choose a species in Step 1 to see its traits and choices here.</p>
      </Card>
    );
  }

  if (!features) {
    return (
      <Card className="p-8 text-center anim-fade-in">
        <h2 className="text-2xl font-bold text-white mb-2">{character.species}</h2>
        <p className="text-slate-400">This species has no choices to make at level 1 — just its fixed traits.</p>
      </Card>
    );
  }

  const selectedLineage = features.lineage?.options.find((o) => o.name === character.speciesLineage);

  const bonusSkillOptions = features.bonusSkillOptions === 'any' ? SKILL_NAMES : (features.bonusSkillOptions ?? []);
  const bonusFeatOptions = FEATS.map((f) => ({ name: f.name, description: f.description }));

  return (
    <Card className="p-8 space-y-8 anim-fade-in">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-white">{character.species} Traits</h2>
        <p className="text-slate-400 text-sm mt-1">Choices granted by your species at level 1.</p>
      </div>

      {features.ancestry && (
        <div>
          <SectionHeading title={`${features.ancestry.label} (choose 1)`} hint="A single ancestry that shapes a few of your traits." />
          <RadioCardPicker
            options={features.ancestry.options}
            selected={character.speciesAncestry ?? ''}
            onSelect={(name) => updateCharacter({ speciesAncestry: name })}
          />
        </div>
      )}

      {features.lineage && (
        <div className="space-y-4">
          <div>
            <SectionHeading title={`${features.lineage.label} (choose 1)`} hint="A lineage grants a trait and a cantrip now, plus spells at higher levels." />
            <RadioCardPicker
              options={features.lineage.options.map((o) => ({ name: o.name, description: o.traitDescription }))}
              selected={character.speciesLineage ?? ''}
              onSelect={(name) => updateCharacter({ speciesLineage: name })}
            />
          </div>
          {selectedLineage && <LineageGrantPreview option={selectedLineage} />}

          <div>
            <SectionHeading title="Spellcasting Ability" hint="Used for your lineage's spells." />
            <RadioChipPicker
              options={features.lineage.spellcastingAbilityOptions.map((id) => ABILITY_BY_ID[id]?.name ?? id)}
              selected={character.lineageSpellcastingAbility ? (ABILITY_BY_ID[character.lineageSpellcastingAbility]?.name ?? character.lineageSpellcastingAbility) : ''}
              onSelect={(name) => {
                const id = features.lineage!.spellcastingAbilityOptions.find((aid) => (ABILITY_BY_ID[aid]?.name ?? aid) === name);
                updateCharacter({ lineageSpellcastingAbility: name ? id : undefined });
              }}
            />
          </div>
        </div>
      )}

      {features.bonusSkillOptions && (
        <div>
          <SectionHeading
            title="Bonus Skill (choose 1)"
            hint={features.bonusSkillOptions === 'any' ? 'Pick any skill.' : 'Pick from your species’ short list.'}
          />
          <RadioChipPicker
            options={bonusSkillOptions}
            selected={character.speciesBonusSkill ?? ''}
            onSelect={(skill) => updateCharacter({ speciesBonusSkill: skill || undefined })}
          />
        </div>
      )}

      {features.bonusFeat && (
        <div>
          <SectionHeading title="Bonus Origin Feat (choose 1)" hint="An extra Origin feat on top of the one your background grants." />
          <RadioCardPicker
            options={bonusFeatOptions}
            selected={character.speciesBonusFeat ?? ''}
            onSelect={(name) => updateCharacter({ speciesBonusFeat: name })}
          />
        </div>
      )}
    </Card>
  );
};
