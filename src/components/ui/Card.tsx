import type { ReactNode } from 'react';

export const Card = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl shadow-lg ${className}`}>{children}</div>
);
