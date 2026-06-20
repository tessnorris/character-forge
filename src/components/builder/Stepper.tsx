import { Fragment } from 'react';
import { STEPS } from './types';

interface StepperProps {
  step: number;
  canEnter: (n: number) => boolean;
  onJump: (n: number) => void;
}

export const Stepper = ({ step, canEnter, onJump }: StepperProps) => (
  <div className="flex items-center justify-between mb-8">
    {STEPS.map((s, i) => {
      const active = s.n === step;
      const done = s.n < step && canEnter(s.n);
      const enabled = canEnter(s.n);
      return (
        <Fragment key={s.n}>
          <button
            onClick={() => enabled && onJump(s.n)}
            disabled={!enabled}
            className={`flex flex-col items-center gap-1 group ${enabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                                ${
                                  active
                                    ? 'bg-accent-600 border-accent-400 text-white'
                                    : done
                                      ? 'bg-accent-900/40 border-accent-600 text-accent-300'
                                      : enabled
                                        ? 'bg-slate-800 border-slate-600 text-slate-300 group-hover:border-accent-500'
                                        : 'bg-slate-900 border-slate-800 text-slate-600'
                                }`}
            >
              {done ? '✓' : s.n}
            </span>
            <span className={`text-xs ${active ? 'text-accent-300 font-semibold' : 'text-slate-500'}`}>{s.label}</span>
          </button>
          {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${s.n < step ? 'bg-accent-700' : 'bg-slate-800'}`}></div>}
        </Fragment>
      );
    })}
  </div>
);
