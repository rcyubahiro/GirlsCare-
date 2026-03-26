import type { PropsWithChildren } from 'react';

interface CardProps {
  className?: string;
}

export default function Card({ children, className = '' }: PropsWithChildren<CardProps>) {
  return (
    <section className={`rounded-card bg-white p-5 shadow-card ${className}`.trim()}>
      {children}
    </section>
  );
}
