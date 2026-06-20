import { ABILITY_BY_NAME } from '../../data/abilities';

export const AbilityBadge = ({ ability }: { ability: string }) => {
  const a = ABILITY_BY_NAME[ability];
  return (
    <span
      className={`px-2 py-1 rounded border text-xs font-bold uppercase tracking-wide ${
        a ? a.badge : 'bg-slate-700 border-slate-500 text-slate-200'
      }`}
    >
      {ability}
    </span>
  );
};
