import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function InputField({ label, id, error, className = '', ...props }: InputFieldProps) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-sm font-semibold text-textBase dark:text-slate-100">{label}</span>
      <input
        id={id}
        className={[
          'w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm outline-none ring-primary/30 transition placeholder:text-slate-400 focus:border-primary focus:ring dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary/70 dark:focus:ring-primary/20',
          error ? 'border-secondary focus:border-secondary dark:border-secondary/50' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-secondary dark:text-secondary/70">{error}</span> : null}
    </label>
  );
}
