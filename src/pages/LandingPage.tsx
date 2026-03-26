import { HeartIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function LandingPage() {
  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
      <section className="space-y-4 py-6 animate-fadeInUp">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <SparklesIcon className="h-4 w-4" />
          Rural Rwanda Prototype
        </p>
        <h1 className="font-heading text-4xl font-semibold leading-tight text-textBase md:text-5xl">
          GIRLCARE
        </h1>
        <p className="text-lg text-slate-600">Empowering Young Women</p>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          A safe digital space for reproductive health education, mentorship, and access to local health services.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
        </div>
      </section>

      <Card className="animate-fadeInUp bg-gradient-to-br from-primary/10 via-white to-secondary/10">
        <div className="space-y-3 text-left">
          <HeartIcon className="h-8 w-8 text-secondary" />
          <h2 className="font-heading text-xl font-semibold">Our Mission</h2>
          <p className="text-sm leading-6 text-slate-600">
            Prevent unwanted pregnancy by making knowledge, confidence, and support accessible on any phone.
          </p>
        </div>
      </Card>
    </div>
  );
}
