import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const base =
    'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-40 disabled:cursor-not-allowed';
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-accent-600 hover:bg-accent-500 text-white focus:ring-accent-400 px-5 py-2.5',
    ghost:
      'bg-transparent border border-slate-600 text-slate-300 hover:border-accent-500 hover:text-white focus:ring-accent-400 px-5 py-2.5',
    danger: 'bg-red-700 hover:bg-red-600 text-white focus:ring-red-400 px-3 py-2',
  };
  return <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props} />;
};
