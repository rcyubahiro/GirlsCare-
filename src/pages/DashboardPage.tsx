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
      <header>
        <h1 className="font-heading text-2xl font-semibold text-textBase">Hello, {user.name}</h1>
        <p className="text-sm text-slate-600">Your safe space for education, guidance, and support.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {dashboardCards.map((item) => (
          <Card key={item.title} className="group">
            <h2 className="font-heading text-lg font-semibold text-textBase">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            <Link
              to={item.route}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-2"
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
