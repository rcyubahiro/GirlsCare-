import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface PageIllustrationProps {
  title: string;
  subtitle: string;
  icon: IconType;
  badge: string;
}

export default function PageIllustration({ title, subtitle, icon: Icon, badge }: PageIllustrationProps) {
  return (
    <div className="relative overflow-hidden rounded-card border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/80">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/25 blur-2xl dark:bg-primary/15" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-secondary/25 blur-2xl dark:bg-secondary/15" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-primary dark:border-primary/40 dark:bg-primary/15">
            {badge}
          </p>
          <h1 className="mt-3 font-heading text-2xl font-bold text-textBase dark:text-slate-100">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-300">{subtitle}</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-soft">
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
