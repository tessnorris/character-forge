import { useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ABILITY_NAMES, ABILITY_BY_NAME } from '../../data/abilities';
import { finalScores } from '../../engine/derive';
import { downloadJSON } from '../../state/storage';
import type { Character } from '../../types/character';

interface RosterViewProps {
  roster: Character[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onImport: (data: unknown) => void;
}

export const RosterView = ({ roster, onView, onDelete, onNew, onImport }: RosterViewProps) => {
  const sorted = [...roster].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
  const fileRef = useRef<HTMLInputElement>(null);

  const today = () => new Date().toISOString().slice(0, 10);
  const exportAll = () => downloadJSON(`character-roster-${today()}.json`, roster);
  const exportOne = (c: Character) => downloadJSON(`${(c.name || 'character').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`, c);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport(JSON.parse(reader.result as string));
      } catch {
        alert('Could not import: the file is not valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // allow re-importing the same file
  };

  return (
    <div className="anim-fade-in h-full flex flex-col">
      <div className="mb-4 border-b border-slate-800 pb-4 flex justify-between items-center gap-3 flex-wrap shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white">Saved Characters</h2>
          <p className="text-slate-500 mt-1 text-sm">
            {roster.length} saved {roster.length === 1 ? 'character' : 'characters'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" onClick={exportAll} disabled={roster.length === 0}>
            ⬇ Export
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current && fileRef.current.click()}>
            ⬆ Import
          </Button>
          <Button onClick={onNew}>✦ New Character</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFile} className="hidden" />
        </div>
      </div>

      {sorted.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 shrink-0">
          <p className="italic mb-4">No saved characters yet. Build one and hit “Save to Roster” on the summary.</p>
          <Button onClick={onNew}>Create your first character</Button>
        </Card>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
          {sorted.map((c) => {
            const scores = finalScores(c);
            const rolled = !!c.baseScores;
            return (
              <Card key={c.id} className="p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{c.name || 'Unnamed Adventurer'}</h3>
                    <p className="text-slate-400 text-sm">{[c.species, c.charClass].filter(Boolean).join(' · ') || '—'}</p>
                    {c.background && <p className="text-slate-500 text-xs mt-0.5">Background: {c.background}</p>}
                  </div>
                  {c.savedAt && <span className="text-[10px] text-slate-600 whitespace-nowrap">{new Date(c.savedAt).toLocaleDateString()}</span>}
                </div>
                <div className="mt-3 mb-4 flex flex-wrap gap-1.5">
                  {rolled ? (
                    ABILITY_NAMES.map((n) => (
                      <span key={n} className="text-xs bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-300">
                        {ABILITY_BY_NAME[n].short} <span className="text-white font-bold">{scores[n].final}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600 italic">Abilities not rolled</span>
                  )}
                </div>
                <div className="mt-auto flex gap-2">
                  <Button onClick={() => onView(c.id)} className="flex-1">
                    View
                  </Button>
                  <Button variant="ghost" onClick={() => exportOne(c)} title="Export this character as JSON">
                    ⬇
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(c.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
