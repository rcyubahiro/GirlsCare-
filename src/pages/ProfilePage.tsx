import Button from '../components/Button';
import Card from '../components/Card';
import type { UserSession } from '../types';

interface ProfilePageProps {
  user: UserSession;
  onLogout: () => void;
}

export default function ProfilePage({ user, onLogout }: ProfilePageProps) {
  return (
    <div className="mx-auto max-w-lg animate-fadeInUp">
      <Card>
        <h1 className="font-heading text-2xl font-semibold text-textBase">My Profile</h1>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Logged in:</span>{' '}
            {new Date(user.loggedInAt).toLocaleString()}
          </p>
        </div>

        <Button className="mt-6" variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
