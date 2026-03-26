import type { PropsWithChildren } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Layout({
  isLoggedIn,
  theme,
  onToggleTheme,
  children,
}: PropsWithChildren<LayoutProps>) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg font-body text-textBase dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(249,115,107,0.20),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(14,138,132,0.18),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(20,33,61,0.08),transparent_34%)]" />
      <Navbar isLoggedIn={isLoggedIn} theme={theme} onToggleTheme={onToggleTheme} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-7 md:px-6 md:pb-8 md:pt-10">{children}</main>
    </div>
  );
}
