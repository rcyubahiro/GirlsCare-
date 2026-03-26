import { BookOpenIcon, BuildingOffice2Icon, ChatBubbleLeftRightIcon, HomeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Home', icon: HomeIcon },
  { to: '/education', label: 'Learn', icon: BookOpenIcon },
  { to: '/ask', label: 'Ask', icon: ChatBubbleLeftRightIcon },
  { to: '/facilities', label: 'Care', icon: BuildingOffice2Icon },
  { to: '/profile', label: 'Profile', icon: UserCircleIcon },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-20 md:hidden">
      <ul className="mx-auto flex max-w-md justify-around rounded-2xl border border-white/70 bg-white/85 px-2 py-2 shadow-card backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={[
                  'flex min-w-14 flex-col items-center rounded-xl px-2 py-1 text-[11px] font-semibold transition',
                  active ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-300',
                ].join(' ')}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
