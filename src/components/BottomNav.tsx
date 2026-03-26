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
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white md:hidden">
      <ul className="mx-auto flex max-w-5xl justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={[
                  'flex min-w-14 flex-col items-center rounded-lg px-2 py-1 text-xs',
                  active ? 'text-primary' : 'text-slate-500',
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
