import { useEffect, useMemo, useState } from 'react';
import { Button } from './components/ui/Button';
import { Stepper } from './components/builder/Stepper';
import { Step1Identity } from './components/builder/Step1Identity';
import { Step2Background } from './components/builder/Step2Background';
import { Step3Class } from './components/builder/Step3Class';
import { Step3Roller } from './components/builder/Step3Roller';
import { Step4Equipment } from './components/builder/Step4Equipment';
import { Step5Sheet } from './components/builder/Step5Sheet';
import { InitiativeTracker } from './components/initiative/InitiativeTracker';
import { RosterView } from './components/roster/RosterView';
import { HomebrewView } from './components/homebrew/HomebrewView';
import { DiceRollerView } from './components/dice/DiceRollerView';
import { uid, rollD20, getMod } from './engine/dice';
import { finalScores } from './engine/derive';
import { CLASSES_DATA } from './data/classes';
import { loadState, saveState, loadUserContent, saveUserContent, extractImportedCharacters, PC_ID } from './state/storage';
import { emptyUserContent } from './types/content';
import type { UserContent } from './types/content';
import type { Character, Combatant } from './types/character';

type View = 'builder' | 'roster' | 'initiative' | 'dice' | 'homebrew';

const blankCharacter = (): Character => ({
  id: uid(),
  name: '',
  charClass: '',
  species: '',
  background: '',
  bonusType: '2-1',
  bonus2: '',
  bonus1: '',
  baseScores: null,
  equipmentPackageId: null,
  purchasedItems: {},
});

function App() {
  const persisted = useMemo(() => loadState(), []);
  const [character, setCharacter] = useState<Character>(() => ({ ...blankCharacter(), ...(persisted?.character || {}) }));
  const [combatants, setCombatants] = useState<Combatant[]>(() => persisted?.combatants || []);
  const [roster, setRoster] = useState<Character[]>(() => persisted?.roster || []);
  const [userContent, setUserContent] = useState<UserContent>(() => loadUserContent() ?? emptyUserContent());
  const [view, setView] = useState<View>('builder');
  const [step, setStep] = useState<number>(() => persisted?.step || 1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    saveState({ character, combatants, step, roster });
  }, [character, combatants, step, roster]);

  useEffect(() => {
    saveUserContent(userContent);
  }, [userContent]);

  const updateCharacter = (patch: Partial<Character>) => setCharacter((prev) => ({ ...prev, ...patch }));
  const updateUserContent = (patch: Partial<UserContent>) => setUserContent((prev) => ({ ...prev, ...patch }));
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  // Save (upsert) the current build into the roster.
  const saveCharacter = () => {
    const snapshot: Character = { ...JSON.parse(JSON.stringify(character)), savedAt: Date.now() };
    setRoster((prev) => {
      const idx = prev.findIndex((c) => c.id === snapshot.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = snapshot;
        return next;
      }
      return [...prev, snapshot];
    });
    flash(character.name ? `Saved “${character.name}”` : 'Character saved');
  };

  // Load a saved character into the builder and show its sheet.
  const viewCharacter = (id: string) => {
    const entry = roster.find((c) => c.id === id);
    if (!entry) return;
    setCharacter(JSON.parse(JSON.stringify(entry)));
    setStep(6);
    setView('builder');
  };

  const deleteCharacter = (id: string) => {
    const entry = roster.find((c) => c.id === id);
    if (!confirm(`Delete ${entry?.name || 'this character'}? This cannot be undone.`)) return;
    setRoster((prev) => prev.filter((c) => c.id !== id));
  };

  // Import characters from parsed JSON: an array, a {roster:[...]}, or a single character.
  const importCharacters = (data: unknown) => {
    const incoming = extractImportedCharacters(data);
    if (!incoming) {
      flash('Import failed: unrecognized file');
      return;
    }
    const withIds = incoming.filter((c) => c && typeof c === 'object').map((c) => ({ ...c, id: c.id || uid() }));
    if (withIds.length === 0) {
      flash('Nothing to import');
      return;
    }
    setRoster((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      withIds.forEach((c) => map.set(c.id, c)); // upsert by id
      return Array.from(map.values());
    });
    flash(`Imported ${withIds.length} character${withIds.length === 1 ? '' : 's'}`);
  };

  const classDef = CLASSES_DATA.find((c) => c.name === character.charClass);
  const classFeatures = classDef?.classFeatures1;
  const classStepComplete = (): boolean => {
    if (!classDef) return false;
    if ((character.classSkills?.length ?? 0) !== classDef.skillChoices.count) return false;
    if (classFeatures?.weaponMastery && (character.weaponMastery?.length ?? 0) !== classFeatures.weaponMastery.count) return false;
    if (classFeatures?.fightingStyle && !character.fightingStyle) return false;
    if (classFeatures?.order && !character.classOrder) return false;
    if (classFeatures?.expertise && (character.expertise?.length ?? 0) !== classFeatures.expertise.count) return false;
    if (classFeatures?.invocation && !character.invocation) return false;
    return true;
  };

  const completed: Record<number, boolean> = {
    1: !!(character.charClass && character.species),
    2: !!character.background,
    3: classStepComplete(),
    4: !!character.baseScores,
    5: !!character.equipmentPackageId,
  };
  const canEnter = (s: number) => {
    for (let i = 1; i < s; i++) if (!completed[i]) return false;
    return true;
  };

  const newCharacter = () => {
    const dirty = character.name || character.charClass || character.species || character.background || character.baseScores;
    if (dirty && !confirm('Start a new character? Unsaved changes to the current build will be lost.')) return;
    setCharacter(blankCharacter());
    setCombatants((prev) => prev.filter((c) => c.id !== PC_ID));
    setStep(1);
    setView('builder');
  };

  // Upsert the current character into the initiative list, then switch views.
  const openInitiative = () => {
    const hasCharacter = character.name || character.charClass || character.species;
    if (hasCharacter) {
      setCombatants((prev) => {
        const existing = prev.find((c) => c.id === PC_ID);
        const dex = finalScores(character).Dexterity.final ?? 10;
        const name = character.name || [character.species, character.charClass].filter(Boolean).join(' ') || 'Adventurer';
        const pc: Combatant = {
          id: PC_ID,
          name,
          dex,
          init: existing ? existing.init : rollD20() + getMod(dex),
          ac: existing ? existing.ac : 10,
          hp: existing ? existing.hp : 10,
          tieHistory: existing ? existing.tieHistory : [],
          isPC: true,
        };
        return [...prev.filter((c) => c.id !== PC_ID), pc];
      });
    }
    setView('initiative');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Identity character={character} updateCharacter={updateCharacter} />;
      case 2:
        return <Step2Background character={character} updateCharacter={updateCharacter} />;
      case 3:
        return <Step3Class character={character} updateCharacter={updateCharacter} />;
      case 4:
        return <Step3Roller character={character} updateCharacter={updateCharacter} />;
      case 5:
        return <Step4Equipment character={character} updateCharacter={updateCharacter} onJump={setStep} userContent={userContent} />;
      case 6:
        return <Step5Sheet character={character} updateCharacter={updateCharacter} onOpenInitiative={openInitiative} onSave={saveCharacter} />;
      default:
        return null;
    }
  };

  return (
    <div id="app-root" className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur shrink-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button onClick={() => setView('builder')} className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">⚔️</span>
            <div className="text-left">
              <h1 className="text-lg font-bold text-white leading-tight">Character Forge</h1>
              <p className="text-xs text-slate-500 leading-tight hidden sm:block">D&D 5.5 character builder</p>
            </div>
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            {(
              [
                { v: 'builder' as const, label: 'Builder', onClick: () => setView('builder') },
                { v: 'roster' as const, label: 'Characters', onClick: () => setView('roster') },
                { v: 'initiative' as const, label: 'Initiative', onClick: openInitiative },
                { v: 'dice' as const, label: 'Dice', onClick: () => setView('dice') },
                { v: 'homebrew' as const, label: 'Homebrew', onClick: () => setView('homebrew') },
              ]
            ).map((tab) => (
              <button
                key={tab.v}
                onClick={tab.onClick}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${view === tab.v ? 'bg-accent-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
              >
                {tab.label}
              </button>
            ))}
            <Button variant="ghost" onClick={newCharacter} className="hidden md:inline-flex">
              New
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <div className="max-w-3xl mx-auto px-4 py-6 h-full">
          {view === 'builder' && (
            <div className="h-full flex flex-col">
              <div className="shrink-0">
                <Stepper step={step} canEnter={canEnter} onJump={setStep} />
              </div>
              {/* Step content — fixed area; tall steps scroll inside */}
              <div className="flex-1 min-h-0">{step === 5 ? renderStep() : <div className="h-full overflow-y-auto pr-1">{renderStep()}</div>}</div>

              {/* Footer nav — always visible at the bottom */}
              <div className="shrink-0 flex justify-between items-center pt-4">
                <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
                  ← Back
                </Button>
                {step < 6 ? (
                  <Button onClick={() => setStep((s) => s + 1)} disabled={!completed[step]}>
                    {completed[step] ? 'Next →' : 'Complete this step →'}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={saveCharacter}>
                      💾 Save to Roster
                    </Button>
                    <Button onClick={openInitiative}>⚔ Send to Initiative</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'roster' && <RosterView roster={roster} onView={viewCharacter} onDelete={deleteCharacter} onNew={newCharacter} onImport={importCharacters} />}

          {view === 'initiative' && <InitiativeTracker combatants={combatants} setCombatants={setCombatants} />}

          {view === 'dice' && <DiceRollerView />}

          {view === 'homebrew' && <HomebrewView userContent={userContent} updateUserContent={updateUserContent} />}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-accent-600 text-white px-5 py-2.5 rounded-lg shadow-xl z-50 anim-fade-in font-semibold">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
