import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
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
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ isLoggedIn, theme, onToggleTheme }: NavbarProps) {
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
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/75 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/75">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-heading text-lg font-bold tracking-wide text-textBase dark:text-slate-100">
            GIRL<span className="text-primary">CARE</span>
          </Link>
          <span
            className={[
              'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
              isOnline
                ? 'border-emerald-200 bg-emerald-100/80 text-emerald-800'
                : 'border-amber-200 bg-amber-100/80 text-amber-800',
            ].join(' ')}
            title={isOnline ? 'Online' : 'Offline mode'}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        {isLoggedIn ? (
          <nav className="hidden gap-1.5 rounded-2xl border border-slate-200/80 bg-white/80 p-1 shadow-soft md:flex dark:border-slate-700 dark:bg-slate-800/80">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    'rounded-xl px-3 py-1.5 text-sm font-semibold transition',
                    active
                      ? 'bg-gradient-to-r from-primary to-[#0aa59d] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
        <button
          onClick={onToggleTheme}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/90 bg-white/90 text-textBase shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
