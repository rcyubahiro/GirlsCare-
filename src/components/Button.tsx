import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-[#5d55ef]',
  secondary: 'bg-secondary text-white hover:bg-[#f05275]',
  ghost: 'bg-white text-textBase border border-slate-200 hover:bg-slate-50',
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
        'rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70',
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
