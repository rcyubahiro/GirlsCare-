import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/education', label: 'Education' },
  { to: '/life-skills', label: 'Life Skills' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/ask', label: 'Ask' },
  { to: '/answers', label: 'Answers' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/profile', label: 'Profile' },
];

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-heading text-lg font-semibold tracking-wide text-primary">
            GIRLCARE
          </Link>
          <span
            className={[
              'rounded-full px-2 py-0.5 text-[11px] font-medium',
              isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
            ].join(' ')}
            title={isOnline ? 'Online' : 'Offline mode'}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        {isLoggedIn ? (
          <nav className="hidden gap-2 md:flex">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    'rounded-lg px-3 py-1.5 text-sm transition',
                    active ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
