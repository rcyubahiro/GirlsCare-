import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-[#0aa59d] text-white shadow-soft hover:brightness-95 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/35 dark:from-primary dark:to-primary/80 dark:hover:shadow-lg dark:shadow-primary/30',
  secondary:
    'bg-gradient-to-r from-secondary to-[#f9a13a] text-white shadow-soft hover:brightness-95 hover:shadow-md focus-visible:ring-2 focus-visible:ring-secondary/35 dark:from-secondary dark:to-secondary/80 dark:hover:shadow-lg dark:shadow-secondary/30',
  ghost:
    'border border-white/70 bg-white/90 text-textBase shadow-sm hover:bg-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/25 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:shadow-md',
};

export default function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={[
        'rounded-2xl px-5 py-3 text-sm font-bold tracking-wide transition duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
