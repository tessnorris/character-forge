interface SelectInputProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

import { useId } from 'react';

interface SelectInputProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export const SelectInput = ({ label, options, value, onChange, placeholder, disabled }: SelectInputProps) => {
  const id = useId();
  return (
    <div className={`transition-opacity duration-300 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {label && (
        <label htmlFor={id} className="block text-accent-400 font-semibold mb-2">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-800 border border-slate-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export const numberInputCls =
  'w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-center focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500';
