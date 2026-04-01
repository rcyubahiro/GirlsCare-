import { HeartIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function LandingPage() {
  return (
    <div className="grid gap-7 md:grid-cols-[1.25fr_1fr] md:items-center">
      <section className="space-y-5 py-6 animate-fadeInUp">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wide text-primary">
          <SparklesIcon className="h-4 w-4" />
          Rural Rwanda Prototype
        </p>
        <h1 className="font-heading text-4xl font-extrabold leading-tight text-textBase md:text-6xl">
          Learning, support,
          <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            and confidence in one place
          </span>
        </h1>
        <p className="max-w-xl text-base leading-7 text-slate-700">
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
        <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
          <Card className="animate-fadeInUp p-3 text-center" >
            <p className="font-heading text-xl font-bold text-primary">24/7</p>
            <p className="text-xs text-slate-600">Learning Access</p>
          </Card>
          <Card className="animate-fadeInUp p-3 text-center" >
            <p className="font-heading text-xl font-bold text-secondary">Safe</p>
            <p className="text-xs text-slate-600">Anonymous Questions</p>
          </Card>
          <Card className="animate-fadeInUp p-3 text-center" >
            <p className="font-heading text-xl font-bold text-primary">Local</p>
            <p className="text-xs text-slate-600">Trusted Care Centers</p>
          </Card>
        </div>

        <Card className="mt-4 animate-fadeInUp border-2 border-blue-300 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:border-blue-700 dark:from-blue-950 dark:via-slate-800 dark:to-blue-950">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">⚙</span>
            </div>
            <p className="font-heading text-sm font-bold text-blue-900 dark:text-blue-300">Admin & Developers</p>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Backend integration tests, health checks, and real-time monitoring for mentor chat and push notifications.
          </p>
          <Link to="/login">
            <Button variant="ghost" className="mt-3 w-full">Access Admin Panel →</Button>
          </Link>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Login with an email containing "admin" to unlock the admin panel.
          </p>
        </Card>
      </section>

      <Card className="relative animate-fadeInUp overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/15">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-secondary/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative space-y-4 text-left">
          <HeartIcon className="h-9 w-9 text-secondary animate-floatSlow" />
          <h2 className="font-heading text-2xl font-bold">Our Mission</h2>
          <p className="text-sm leading-6 text-slate-700">
            Prevent unwanted pregnancy by making knowledge, confidence, and support accessible on any phone.
          </p>
          <div className="rounded-2xl border border-primary/20 bg-white/80 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Promise</p>
            <p className="mt-1 text-sm text-slate-700">No judgment. Clear information. Fast help when you need it.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
