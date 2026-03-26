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
