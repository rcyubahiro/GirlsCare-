import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function InputField({ label, id, error, className = '', ...props }: InputFieldProps) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-sm font-medium text-textBase">{label}</span>
      <input
        id={id}
        className={[
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-primary/30 transition focus:ring',
          error ? 'border-secondary' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-secondary">{error}</span> : null}
    </label>
  );
}
