import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';

interface AuthPageProps {
  onLogin: (email: string) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const errors = useMemo(
    () => ({
      email: attempted && !email.trim() ? 'Email is required.' : '',
      password: attempted && !password.trim() ? 'Password is required.' : '',
    }),
    [attempted, email, password],
  );

  const hasErrors = Boolean(errors.email || errors.password);

  const handleSubmit = async () => {
    setAttempted(true);
    if (!email.trim() || !password.trim()) {
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onLogin(email.trim());
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-md animate-fadeInUp">
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
        <div className="relative">
        <h1 className="font-heading text-2xl font-bold text-textBase">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="mt-1 text-sm text-slate-700">
          {mode === 'login' ? 'Login to continue your journey.' : 'Register to access learning and support.'}
        </p>

        <div className="mt-5 space-y-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
          />
          <Button fullWidth onClick={handleSubmit} disabled={loading || hasErrors}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </Button>
        </div>

        <button
          className="mt-4 text-sm font-bold text-primary underline-offset-2 hover:underline"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
        </div>
      </Card>
    </div>
  );
}
