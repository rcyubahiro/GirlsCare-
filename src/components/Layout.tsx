import type { PropsWithChildren } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  isLoggedIn: boolean;
}

export default function Layout({ isLoggedIn, children }: PropsWithChildren<LayoutProps>) {
  return (
    <div className="min-h-screen bg-bg font-body text-textBase">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
