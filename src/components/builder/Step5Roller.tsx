import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { ABILITIES } from '../../data/abilities';
import { generateAbilityScore, getMod, fmtMod, uid } from '../../engine/dice';
import type { GeneratedScore, RollerState } from '../../types/character';
import type { StepProps } from './types';

type Phase = RollerState['phase'];
type Mode = RollerState['mode'];

export const Step5Roller = ({ character, updateCharacter }: StepProps) => {
  // Restore the roller's full state so navigating back retains rolled scores.
  const saved = character.rollerState;
  const [numDice, setNumDice] = useState(saved?.numDice ?? 4);
  const [rerollThreshold, setRerollThreshold] = useState(saved?.rerollThreshold ?? 1);
  const [poolSize, setPoolSize] = useState(saved?.poolSize ?? 6);
  const [mode, setMode] = useState<Mode>(saved?.mode ?? 'manual');
  // Never restore a half-finished 'rolling' phase (its timer is gone).
  const [phase, setPhase] = useState<Phase>(saved?.phase === 'result' ? 'result' : 'config');
  const [generatedScores, setGeneratedScores] = useState<GeneratedScore[]>(saved?.generatedScores ?? []);
  const [assignments, setAssignments] = useState<Record<string, string>>(saved?.assignments ?? {}); // { abilityId: scoreId }
  const [selectedScoreId, setSelectedScoreId] = useState<string | null>(null);

  // Persist assigned scores to the character whenever all six slots are filled.
  useEffect(() => {
    if (Object.keys(assignments).length !== 6) return;
    const scores: Record<string, number> = {};
    ABILITIES.forEach((ab) => {
      const sc = generatedScores.find((s) => s.id === assignments[ab.id]);
      scores[ab.name] = sc ? sc.sum : 0;
    });
    updateCharacter({ baseScores: scores });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, generatedScores]);

  // Persist the roller's working state so Back/return keeps the rolled pool & assignments.
  useEffect(() => {
    updateCharacter({ rollerState: { numDice, rerollThreshold, poolSize, mode, phase, generatedScores, assignments } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDice, rerollThreshold, poolSize, mode, phase, generatedScores, assignments]);

  const handleRoll = () => {
    setPhase('rolling');
    updateCharacter({ baseScores: null }); // invalidate previous result until reassigned
    setSelectedScoreId(null);
    setTimeout(() => {
      const raw: GeneratedScore[] = [];
      for (let i = 0; i < poolSize; i++) {
        raw.push({ ...generateAbilityScore(numDice, rerollThreshold), id: uid() });
      }
      // Keep the best 6 by total.
      const top6 = new Set([...raw].sort((a, b) => b.sum - a.sum).slice(0, 6).map((s) => s.id));
      const pool = raw.filter((s) => top6.has(s.id));
      setGeneratedScores(pool);

      if (mode === 'strict') {
        const auto: Record<string, string> = {};
        ABILITIES.forEach((ab, idx) => {
          if (pool[idx]) auto[ab.id] = pool[idx].id;
        });
        setAssignments(auto);
      } else {
        setAssignments({});
      }
      setPhase('result');
    }, 800);
  };

  const toggleAssignment = (abilityId: string) => {
    if (selectedScoreId === null) {
      if (assignments[abilityId]) {
        const next = { ...assignments };
        delete next[abilityId];
        setAssignments(next);
      }
      return;
    }
    const next = { ...assignments };
    Object.keys(next).forEach((k) => {
      if (next[k] === selectedScoreId) delete next[k];
    });
    next[abilityId] = selectedScoreId;
    setAssignments(next);
    setSelectedScoreId(null);
  };

  const startOver = () => {
    setPhase('config');
    setGeneratedScores([]);
    setAssignments({});
    setSelectedScoreId(null);
  };

  const savedScores = character.baseScores;

  return (
    <Card className="overflow-hidden anim-fade-in">
      <div className="bg-slate-800/80 p-5 border-b border-slate-700 text-center">
        <h2 className="text-2xl font-bold text-white">Fate Spinner</h2>
        <p className="text-slate-400 text-sm mt-1">Roll your ability scores and assign them.</p>
      </div>

      {phase === 'config' && (
        <div className="p-8 space-y-6">
          {savedScores && (
            <div className="bg-accent-900/20 border border-accent-800/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <span className="text-accent-400 font-semibold text-sm">✓ Your rolled scores are saved</span>
                <span className="text-xs text-slate-500">Reroll below only if you want to replace them</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ABILITIES.map((ab) => (
                  <div key={ab.id} className="bg-slate-800 rounded-lg p-2 text-center border border-slate-700">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{ab.short}</div>
                    <div className="text-lg font-bold text-white">{savedScores[ab.name]}</div>
                    <div className={`text-xs ${getMod(savedScores[ab.name]) >= 0 ? 'text-accent-400' : 'text-red-400'}`}>
                      {fmtMod(getMod(savedScores[ab.name]))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-slate-400 text-sm font-bold uppercase">Dice per Stat</label>
              <select
                value={numDice}
                onChange={(e) => setNumDice(parseInt(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-accent-500 outline-none"
              >
                <option value="3">3d6 (Hardcore)</option>
                <option value="4">4d6 (Standard)</option>
                <option value="5">5d6 (Heroic)</option>
              </select>
              <p className="text-xs text-slate-500">Highest 3 dice are kept.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-slate-400 text-sm font-bold uppercase">Reroll Threshold</label>
              <select
                value={rerollThreshold}
                onChange={(e) => setRerollThreshold(parseInt(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-accent-500 outline-none"
              >
                <option value="0">No Rerolls</option>
                <option value="1">Reroll 1s</option>
                <option value="2">Reroll 1s & 2s</option>
              </select>
              <p className="text-xs text-slate-500">Dice ≤ this are rerolled.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-slate-400 text-sm font-bold uppercase">Pool Size</label>
              <input
                type="number"
                min="6"
                max="20"
                value={poolSize}
                onChange={(e) => setPoolSize(Math.max(6, parseInt(e.target.value) || 6))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-accent-500 outline-none"
              />
              <p className="text-xs text-slate-500">Roll this many, keep best 6.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-slate-400 text-sm font-bold uppercase">Assignment Mode</label>
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => setMode('strict')}
                  className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${mode === 'strict' ? 'bg-accent-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Strict Order
                </button>
                <button
                  onClick={() => setMode('manual')}
                  className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${mode === 'manual' ? 'bg-accent-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Arrange Any
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleRoll}
            className="w-full bg-accent-600 hover:bg-accent-500 text-white font-bold py-4 rounded-lg text-xl shadow-lg transition transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {savedScores ? '🎲 Reroll Scores' : '🎲 ROLL THE DICE'}
          </button>
        </div>
      )}

      {phase === 'rolling' && (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[360px]">
          <div className="text-6xl mb-4 dice-anim">🎲</div>
          <h3 className="text-2xl font-bold text-white animate-pulse">Rolling Bones...</h3>
          <p className="text-slate-500 mt-2">Praying to RNGesus</p>
        </div>
      )}

      {phase === 'result' && (
        <div>
          <div className="bg-slate-800/80 border-b border-slate-700 p-4 flex justify-between items-center">
            <div className="text-xs text-slate-400">
              {numDice}d6 (top 3) · {rerollThreshold > 0 ? `reroll ≤ ${rerollThreshold}` : 'no reroll'} · pool {poolSize} ·{' '}
              {mode === 'strict' ? 'strict order' : 'arrange any'}
            </div>
            <button onClick={startOver} className="text-xs text-accent-400 hover:text-accent-300 font-bold uppercase tracking-wider">
              ↻ Reroll
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {mode === 'manual' && (
              <div className="space-y-4">
                <h3 className="text-slate-400 font-bold uppercase text-sm tracking-wider border-b border-slate-700 pb-2">Available Rolls</h3>
                <div className="grid grid-cols-3 gap-3">
                  {generatedScores.map((score) => {
                    const isAssigned = Object.values(assignments).includes(score.id);
                    const isSelected = selectedScoreId === score.id;
                    return (
                      <button
                        key={score.id}
                        disabled={isAssigned}
                        onClick={() => setSelectedScoreId(isSelected ? null : score.id)}
                        className={`relative p-3 rounded-lg border-2 text-center transition-all
                                                            ${
                                                              isAssigned
                                                                ? 'bg-slate-800 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                                                                : isSelected
                                                                  ? 'bg-accent-900/30 border-accent-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                                                                  : 'bg-slate-700 border-slate-600 text-slate-200 hover:border-slate-400'
                                                            }`}
                      >
                        <div className="text-2xl font-bold">{score.sum}</div>
                        <div className="text-[10px] text-slate-400 mt-1">[{score.rolls.join(',')}]</div>
                        {isAssigned && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-slate-500 font-bold text-lg">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 text-center">Tap a number, then tap an ability to assign it.</p>
              </div>
            )}

            <div className={`${mode === 'strict' ? 'md:col-span-2' : ''} space-y-4`}>
              <h3 className="text-slate-400 font-bold uppercase text-sm tracking-wider border-b border-slate-700 pb-2 flex justify-between">
                <span>Ability Scores</span>
                {mode === 'strict' && <span className="text-xs text-slate-500 normal-case font-normal">(applied in order rolled)</span>}
              </h3>
              <div className="space-y-3">
                {ABILITIES.map((ability) => {
                  const sc = generatedScores.find((s) => s.id === assignments[ability.id]);
                  return (
                    <div
                      key={ability.id}
                      onClick={() => (mode === 'manual' ? toggleAssignment(ability.id) : undefined)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all
                                                        ${
                                                          mode === 'strict'
                                                            ? 'bg-slate-800 border-slate-700'
                                                            : sc
                                                              ? 'bg-slate-800 border-slate-600 cursor-pointer hover:border-accent-700'
                                                              : selectedScoreId
                                                                ? 'bg-slate-800/50 border-accent-500/50 border-dashed cursor-pointer hover:bg-accent-900/10'
                                                                : 'bg-slate-900 border-slate-800'
                                                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl" role="img" aria-label={ability.name}>
                          {ability.icon}
                        </span>
                        <div>
                          <div className="font-bold text-slate-200">{ability.name}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-widest">{ability.short}</div>
                        </div>
                      </div>
                      {sc ? (
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xs text-slate-500">MOD</div>
                            <div className={`font-bold ${getMod(sc.sum) >= 0 ? 'text-accent-400' : 'text-red-400'}`}>{fmtMod(getMod(sc.sum))}</div>
                          </div>
                          <div className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded border border-slate-600 text-xl font-bold text-white">
                            {sc.sum}
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">?</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 text-center border-t border-slate-700 text-sm">
            {Object.keys(assignments).length === 6 ? (
              <span className="text-accent-400 font-bold">All scores assigned — continue when ready.</span>
            ) : (
              <span className="text-slate-400">Assign all 6 scores to continue.</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
