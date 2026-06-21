import { useEffect, useRef, useState } from 'react';
import { STEPS } from './types';

interface StepperProps {
  step: number;
  canEnter: (n: number) => boolean;
  onJump: (n: number) => void;
}

/** Step progress + navigation, shown as a single dropdown rather than a
 * row of circles across the top — the step row stopped fitting once the
 * builder grew past 6-7 steps, forcing the page wider than the content
 * below it. Clicking the trigger reveals every step with a status icon
 * (done / current / locked); the forward-jump restriction is unchanged
 * from the old Stepper — `canEnter` still gates which steps are
 * clickable, so you can always jump back to a completed step but can't
 * skip ahead of one you haven't reached yet. */
export const Stepper = ({ step, canEnter, onJump }: StepperProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = STEPS.find((s) => s.n === step);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const jump = (n: number) => {
    if (!canEnter(n)) return;
    onJump(n);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative mb-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-left hover:border-accent-500 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-accent-600 border-accent-400 text-white">
            {step}
          </span>
          <span className="font-semibold text-white">{current?.label ?? 'Step'}</span>
          <span className="text-xs text-slate-500">
            Step {step} of {STEPS.length}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul role="listbox" className="absolute z-20 mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden anim-fade-in-down">
          {STEPS.map((s) => {
            const active = s.n === step;
            const done = s.n < step && canEnter(s.n);
            const enabled = canEnter(s.n);
            return (
              <li key={s.n}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => jump(s.n)}
                  disabled={!enabled}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    active
                      ? 'bg-accent-900/30 text-white'
                      : enabled
                        ? 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                        : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold border-2 ${
                      active
                        ? 'bg-accent-600 border-accent-400 text-white'
                        : done
                          ? 'bg-accent-900/40 border-accent-600 text-accent-300'
                          : enabled
                            ? 'bg-slate-800 border-slate-600 text-slate-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {done ? '✓' : s.n}
                  </span>
                  <span className="flex-1">{s.label}</span>
                  {!enabled && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-700">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
