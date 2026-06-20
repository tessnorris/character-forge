/** Shared picker primitives used by builder steps that present "choose N
 * from a list" or "choose 1 of N named options" selections (currently
 * Step3Class and Step3Species). Kept here rather than duplicated per step
 * so the look and selection-limit behavior stays consistent as more
 * pickers are added. */

/** A row of single-select chips — visually like ChipPicker, but exactly one
 * can be active at a time and clicking the active one deselects it. Used
 * for short "pick one of a few short words" choices (e.g. a spellcasting
 * ability, a single bonus skill) where RadioCardPicker's full description
 * cards would be overkill and ChipPicker's multi-select-with-a-cap framing
 * would be misleading. */
export const RadioChipPicker = ({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const isSelected = selected === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(isSelected ? '' : opt)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            isSelected
              ? 'border-accent-500 bg-accent-900/30 text-white'
              : 'border-slate-700 text-slate-300 hover:border-accent-500 hover:text-white'
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

/** A row of toggleable chips with an external "(n of m selected)" counter
 * (the counter itself is left to the caller, since its exact wording
 * varies — "skills", "weapons", etc.). */
export const ChipPicker = ({
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
 * Divine/Primal Order, Eldritch Invocation, species Ancestry/Lineage). */
export const RadioCardPicker = ({
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

export const SectionHeading = ({ title, hint }: { title: string; hint: string }) => (
  <div className="mb-3">
    <h3 className="font-semibold text-slate-200">{title}</h3>
    <p className="text-sm text-slate-500">{hint}</p>
  </div>
);
