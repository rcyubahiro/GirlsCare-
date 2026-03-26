import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import type { UserSession } from '../types';
import { dashboardCards } from '../utils/data';

interface DashboardPageProps {
  user: UserSession;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  return (
    <div className="space-y-5 pb-20 animate-fadeInUp">
      <header className="rounded-card border border-white/70 bg-white/80 p-5 shadow-card backdrop-blur-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Welcome back</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-textBase md:text-3xl">Hello, {user.name}</h1>
        <p className="mt-1 text-sm text-slate-700">Your safe space for education, guidance, and support.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {dashboardCards.map((item) => (
          <Card key={item.title} className="group relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-75" />
            <h2 className="font-heading text-lg font-semibold text-textBase">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-700">{item.description}</p>
            <Link
              to={item.route}
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition group-hover:gap-2"
            >
              Open <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </section>

      <BottomNav />
    </div>
  );
}
