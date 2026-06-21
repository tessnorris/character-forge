import { useId } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { isArmorName } from '../../data/armor';
import { WEAPON_BY_NAME } from '../../data/weapons';
import { deriveCharacter, combinedEquipment } from '../../engine/derive';
import { fmtMod } from '../../engine/dice';
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

const StatCard = ({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</div>
    <div className="text-2xl font-bold text-white leading-tight">{value}</div>
    {sub && <div className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</div>}
  </div>
);

/** A filled dot when proficient, hollow when not; double for expertise. */
const ProfDot = ({ proficient, expertise }: { proficient: boolean; expertise?: boolean }) => (
  <span
    className={`inline-block w-2.5 h-2.5 rounded-full border ${
      expertise ? 'bg-accent-400 border-accent-300 ring-2 ring-accent-700' : proficient ? 'bg-accent-500 border-accent-400' : 'border-slate-600'
    }`}
    title={expertise ? 'Expertise' : proficient ? 'Proficient' : 'Not proficient'}
  />
);

const fmt = (n: number | null): string => (n == null ? '—' : fmtMod(n));

const TextAreaField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) => {
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
  const derived = deriveCharacter(character);
  const rolled = !!character.baseScores;
  const details = character.details ?? emptyCharacterDetails();
  const inventory = combinedEquipment(character);
  const equipped = character.equipped ?? [];
  const allSpells = character.spells ?? [];
  const cantrips = allSpells.filter((s) => s.level === 0);
  const leveledSpells = allSpells.filter((s) => s.level !== 0);

  const updateDetails = (patch: Partial<CharacterDetails>) => updateCharacter({ details: { ...details, ...patch } });

  const isEquippable = (name: string): boolean => isArmorName(name) || name in WEAPON_BY_NAME;
  const toggleEquipped = (name: string) => {
    const next = equipped.includes(name) ? equipped.filter((n) => n !== name) : [...equipped, name];
    updateCharacter({ equipped: next });
  };

  const inventoryEntries = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <Card className="overflow-hidden anim-fade-in">
      <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex items-center justify-between gap-3 flex-wrap">
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

      {/* Top stat strip */}
      <div className="p-6 border-b border-slate-800">
        {!rolled && <p className="text-slate-500 italic text-sm mb-3">Roll abilities in the Abilities step to fill in modifiers, AC, HP, and attack bonuses.</p>}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <StatCard label="AC" value={derived.armorClass.value ?? '—'} sub={derived.armorClass.label} />
          <StatCard label="HP" value={derived.hitPoints.max ?? '—'} sub={derived.hitPoints.hitDie ? `d${derived.hitPoints.hitDie} + CON` : undefined} />
          <StatCard label="Init" value={fmt(derived.initiative)} />
          <StatCard label="Speed" value={`${derived.speed}`} sub="ft" />
          <StatCard label="Prof" value={fmtMod(derived.proficiencyBonus)} />
          <StatCard label="Pass. Per" value={derived.passivePerception ?? '—'} />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-800">
        <div>
          <Field label="Class" value={character.charClass} />
          <Field label="Species" value={character.species} />
          <Field label="Background" value={character.background} />
        </div>

        {/* Abilities */}
        <div>
          <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-2">Ability Scores</h3>
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left py-1">Ability</th>
                <th className="text-center py-1">Score</th>
                <th className="text-center py-1">Mod</th>
              </tr>
            </thead>
            <tbody>
              {derived.abilities.map((a) => (
                <tr key={a.id} className="border-t border-slate-800">
                  <td className="py-1.5 text-slate-300">
                    {a.short}
                    {a.bonus > 0 && <span className="text-accent-500 text-xs ml-1">(+{a.bonus})</span>}
                  </td>
                  <td className="py-1.5 text-center text-white font-bold">{a.final ?? '—'}</td>
                  <td className={`py-1.5 text-center font-bold ${a.mod == null ? 'text-slate-600' : a.mod >= 0 ? 'text-accent-400' : 'text-red-400'}`}>{fmt(a.mod)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saves + Skills */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-800">
        <div>
          <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Saving Throws</h3>
          <ul className="space-y-1.5">
            {derived.saves.map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-sm">
                <ProfDot proficient={s.proficient} />
                <span className="text-slate-300 flex-1">{s.ability}</span>
                <span className={`font-bold tabular-nums ${s.mod == null ? 'text-slate-600' : 'text-white'}`}>{fmt(s.mod)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Skills</h3>
          <ul className="space-y-1">
            {derived.skills.map((sk) => (
              <li key={sk.name} className="flex items-center gap-2 text-sm">
                <ProfDot proficient={sk.proficient} expertise={sk.expertise} />
                <span className={`flex-1 ${sk.proficient ? 'text-slate-200' : 'text-slate-400'}`}>
                  {sk.name} <span className="text-slate-600 text-xs">({sk.abilityShort})</span>
                </span>
                <span className={`font-bold tabular-nums ${sk.mod == null ? 'text-slate-600' : 'text-white'}`}>{fmt(sk.mod)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Weapon attacks */}
      {derived.weaponAttacks.length > 0 && (
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Attacks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-500 text-xs uppercase">
                <tr>
                  <th className="py-1 pr-2">Weapon</th>
                  <th className="py-1 px-2 text-center">Atk</th>
                  <th className="py-1 px-2">Damage</th>
                  <th className="py-1 px-2">Mastery</th>
                  <th className="py-1 pl-2 text-right">Equipped</th>
                </tr>
              </thead>
              <tbody>
                {derived.weaponAttacks.map((w) => (
                  <tr key={w.name} className="border-t border-slate-800">
                    <td className="py-1.5 pr-2">
                      <span className="text-slate-200">{w.name}</span>
                      {!w.proficient && <span className="text-amber-500/80 text-xs ml-1" title="Not proficient — proficiency bonus not added">⚠</span>}
                      {w.properties.length > 0 && <div className="text-[10px] text-slate-500">{w.properties.join(', ')}</div>}
                    </td>
                    <td className="py-1.5 px-2 text-center font-bold tabular-nums text-white">{w.attackBonus == null ? '—' : fmtMod(w.attackBonus)}</td>
                    <td className="py-1.5 px-2 text-slate-300">
                      {w.damage} <span className="text-slate-500 text-xs">{w.damageType}</span>
                      {w.versatile && <span className="text-slate-600 text-xs"> · {w.versatile} two-handed</span>}
                    </td>
                    <td className="py-1.5 px-2 text-slate-400">{w.mastery}</td>
                    <td className="py-1.5 pl-2 text-right">
                      <button
                        onClick={() => toggleEquipped(w.name)}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${
                          w.equipped ? 'bg-accent-600 border-accent-500 text-white' : 'border-slate-600 text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        {w.equipped ? 'Equipped' : 'Equip'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Capabilities grouped by source */}
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Features &amp; Traits</h3>
        {derived.capabilities.length === 0 ? (
          <p className="text-slate-500 italic text-sm">No class, species, or background features selected yet.</p>
        ) : (
          <div className="space-y-4">
            {derived.capabilities.map((group) => (
              <div key={group.source}>
                <h4 className="text-accent-400 text-sm font-semibold mb-2">{group.source}</h4>
                <ul className="space-y-2">
                  {group.items.map((item, i) => (
                    <li key={i} className="text-sm">
                      <span className="text-slate-200 font-medium">{item.name}</span>
                      {item.detail && <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{item.detail}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spells */}
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Spells</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-xs text-slate-500 mb-1.5">Cantrips</h4>
            {cantrips.length === 0 ? (
              <p className="text-slate-500 italic text-sm">No cantrips.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cantrips.map((spell) => (
                  <span key={spell.id} className="bg-slate-800 border border-slate-700 text-slate-300 py-1 px-3 rounded-full text-sm">
                    {spell.name || 'Unnamed cantrip'}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-xs text-slate-500 mb-1.5">Spells</h4>
            {leveledSpells.length === 0 ? (
              <p className="text-slate-500 italic text-sm">No spells.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {leveledSpells.map((spell) => (
                  <span key={spell.id} className="bg-slate-800 border border-slate-700 text-slate-300 py-1 px-3 rounded-full text-sm">
                    {spell.name || 'Unnamed spell'}
                    {spell.prepared && <span className="text-accent-400"> (prepared)</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Equipment with equipped toggles */}
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider mb-3">Equipment</h3>
        {inventoryEntries.length === 0 ? (
          <p className="text-slate-500 italic text-sm">No equipment selected.</p>
        ) : (
          <ul className="space-y-1.5">
            {inventoryEntries.map(([name, qty]) => (
              <li key={name} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-300">
                  {name} <span className="text-slate-500">×{qty}</span>
                </span>
                {isEquippable(name) ? (
                  <button
                    onClick={() => toggleEquipped(name)}
                    className={`text-xs px-2 py-1 rounded border transition-colors shrink-0 ${
                      equipped.includes(name) ? 'bg-accent-600 border-accent-500 text-white' : 'border-slate-600 text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {equipped.includes(name) ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-600 uppercase tracking-wide shrink-0">gear</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Free-text character details */}
      <div className="p-6 space-y-4">
        <h3 className="text-slate-400 uppercase text-xs tracking-wider">Character Details</h3>
        <TextAreaField label="Background story" value={details.backgroundDescription} onChange={(v) => updateDetails({ backgroundDescription: v })} placeholder="How did they get here? What shaped them?" />
        <TextAreaField label="Physical description" value={details.physicalDescription} onChange={(v) => updateDetails({ physicalDescription: v })} placeholder="Height, build, distinguishing features..." />
        <TextAreaField label="Personality" value={details.personality} onChange={(v) => updateDetails({ personality: v })} placeholder="Traits, ideals, bonds, flaws..." />
        <TextAreaField label="Notes" value={details.notes} onChange={(v) => updateDetails({ notes: v })} placeholder="Anything else worth remembering..." />
      </div>
    </Card>
  );
};
