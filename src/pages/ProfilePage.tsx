import Button from '../components/Button';
import Card from '../components/Card';
import type { UserSession } from '../types';

interface ProfilePageProps {
  user: UserSession;
  onLogout: () => void;
}

export default function ProfilePage({ user, onLogout }: ProfilePageProps) {
  return (
    <div className="mx-auto max-w-lg animate-fadeInUp pb-20">
      <Card>
        <h1 className="font-heading text-2xl font-bold text-textBase dark:text-slate-100">My Profile</h1>
        <div className="mt-5 space-y-3 rounded-2xl border border-slate-200/50 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</span>
            <p className="text-sm font-semibold text-textBase dark:text-slate-100">{user.email}</p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</span>
            <p className="text-sm font-semibold text-textBase dark:text-slate-100">{user.name}</p>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Member Since</span>
            <p className="text-sm font-semibold text-textBase dark:text-slate-100">
              {new Date(user.loggedInAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Button className="mt-6 w-full" variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
