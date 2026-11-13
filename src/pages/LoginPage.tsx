import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth, ensureUserProfile, googleProvider } from '../lib/firebase';
import { signInSchema, signUpSchema } from '../lib/validation';
import { useUser } from '../hooks/useUser';
import { useToast } from '../components/ToastProvider';
import { useTheme } from '../components/ThemeProvider';
import { SeonLogo } from '../components/SeonLogo';

type AuthMode = 'signin' | 'signup';

function mapAuthError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please verify your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Switch to Sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment before trying again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not yet enabled in Firebase Console (Authentication > Sign-in method). You can enable it there or use Google sign-in.';
    default:
      return err instanceof Error ? err.message : 'Authentication failed. Please try again.';
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/app', { replace: true });
    }
  }, [loading, user, navigate]);

  const handleModeSwitch = (next: AuthMode) => {
    setMode(next);
    setFieldErrors({});
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    if (mode === 'signup') {
      const parsed = signUpSchema.safeParse({ displayName, email, password });
      if (!parsed.success) {
        const nextErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0] ?? 'form');
          if (!nextErrors[key]) nextErrors[key] = issue.message;
        }
        setFieldErrors(nextErrors);
        return;
      }

      setSubmitting(true);
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          parsed.data.email,
          parsed.data.password,
        );
        await updateProfile(cred.user, { displayName: parsed.data.displayName });
        await ensureUserProfile(cred.user, parsed.data.displayName);
        toast({
          title: 'Account created',
          description: `Welcome to SEON, ${parsed.data.displayName}.`,
          variant: 'success',
        });
        navigate('/app', { replace: true });
      } catch (err) {
        const message = mapAuthError(err);
        setFormError(message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        parsed.data.email,
        parsed.data.password,
      );
      await ensureUserProfile(cred.user);
      toast({
        title: 'Signed in',
        description: 'Welcome back to SEON.',
        variant: 'success',
      });
      navigate('/app', { replace: true });
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureUserProfile(cred.user);
      toast({
        title: 'Signed in with Google',
        description: cred.user.displayName
          ? `Welcome, ${cred.user.displayName}.`
          : 'Your workspace is ready.',
        variant: 'success',
      });
      navigate('/app', { replace: true });
    } catch (err) {
      setFormError(mapAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-background/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to SEON</span>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:text-foreground"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <SeonLogo size={42} showWordmark={false} />
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
              {mode === 'signin' ? 'Sign in to SEON' : 'Create your SEON account'}
            </h1>
            <p className="mt-1.5 text-sm text-secondary">
              Smart Energy Optimization Network workspace
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Authentication mode"
            className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-background p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              onClick={() => handleModeSwitch('signin')}
              className={`h-9 rounded-md text-sm font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              onClick={() => handleModeSwitch('signup')}
              className={`h-9 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-card text-foreground shadow-xs border border-border'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Create account
            </button>
          </div>

          {formError && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-500/35 bg-red-500/10 p-3 text-xs leading-relaxed text-red-500 dark:text-red-400"
            >
              {formError}
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || submitting}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-card-muted disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="display-name"
                  className="block text-xs font-medium text-secondary"
                >
                  Display name
                </label>
                <input
                  id="display-name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Devansh Saxena"
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-emerald-500 focus:outline-none"
                />
                {fieldErrors.displayName && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.displayName}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-secondary">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-emerald-500 focus:outline-none"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block text-xs font-medium text-secondary"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="h-10 w-full rounded-lg border border-border bg-background pr-10 pl-3 text-sm text-foreground placeholder:text-muted focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || googleLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
