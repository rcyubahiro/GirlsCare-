import type { PropsWithChildren } from 'react';

interface CardProps {
  className?: string;
}

export default function Card({ children, className = '' }: PropsWithChildren<CardProps>) {
  return (
    <section
      className={`rounded-card border border-white/70 bg-white/88 p-5 shadow-card backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-700/80 dark:bg-slate-900/80 ${className}`.trim()}
    >
      {children}
    </section>
  );
}
