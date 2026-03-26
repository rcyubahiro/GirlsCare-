import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface IconBadgeProps {
  icon: IconType;
  tone?: 'primary' | 'secondary';
}

export default function IconBadge({ icon: Icon, tone = 'primary' }: IconBadgeProps) {
  const toneClasses =
    tone === 'secondary'
      ? 'from-secondary to-[#f9a13a]'
      : 'from-primary to-[#0aa59d]';

  return (
    <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${toneClasses} text-white shadow-soft`}>
      <Icon className="h-5 w-5" />
    </span>
  );
}
