import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Moon, Sun } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useTheme } from '../components/ThemeProvider';
import { useToast } from '../components/ToastProvider';
import { profileSchema } from '../lib/validation';
import type { AiToneOption, LanguageOption } from '../lib/firebase';

type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'ai';

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-emerald-600' : 'bg-card-muted border border-border'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') as SettingsTab | null;

  const { user, profile, preferences, saveProfile, updatePreferences } = useUser();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [tab, setTab] = useState<SettingsTab>(
    initialTab === 'appearance' || initialTab === 'notifications' || initialTab === 'ai'
      ? initialTab
      : 'profile',
  );

  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('Sustainability Lead');
  const [language, setLanguage] = useState<LanguageOption>('English');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(profile?.displayName ?? user?.displayName ?? '');
    setRole(profile?.role ?? 'Sustainability Lead');
    setLanguage(profile?.language ?? 'English');
  }, [profile, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    const parsed = profileSchema.safeParse({ displayName, role, language });
    if (!parsed.success) {
      setProfileError(parsed.error.issues[0]?.message ?? 'Invalid profile values.');
      return;
    }

    setSavingProfile(true);
    try {
      await saveProfile(parsed.data);
      toast({
        title: 'Profile saved',
        description: 'Your display name, role, and language preference were updated.',
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Failed to save profile',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePrefToggle = async (
    key:
      | 'reduceMotion'
      | 'compactDensity'
      | 'peakAlerts'
      | 'weeklyDigest'
      | 'esgMilestones'
      | 'productUpdates'
      | 'aiRecommendations'
      | 'autoApplyLowRisk',
    value: boolean,
  ) => {
    try {
      await updatePreferences({ [key]: value });
      toast({
        title: 'Preference saved',
        variant: 'info',
      });
    } catch {
      toast({
        title: 'Could not save preference',
        variant: 'error',
      });
    }
  };

  const handleToneChange = async (tone: AiToneOption) => {
    try {
      await updatePreferences({ aiTone: tone });
      toast({
        title: `Assistant tone set to ${tone}`,
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Could not update tone',
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Workspace Settings
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Manage your SEON account profile, theme appearance, and prototype preferences.
        </p>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Settings sections"
        className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1"
      >
        {(
          [
            { id: 'profile', label: 'Profile' },
            { id: 'appearance', label: 'Appearance' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'ai', label: 'AI' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`h-9 rounded-lg px-4 text-xs font-medium transition-colors ${
              tab === item.id
                ? 'bg-emerald-600 text-white'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="max-w-2xl rounded-xl border border-border bg-card p-6 space-y-5"
        >
          <div className="flex items-center gap-4 border-b border-border pb-5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-base font-semibold text-white">
                {user?.initials ?? 'U'}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">
                {user?.displayName}
              </p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Provider: {user?.provider}
              </p>
            </div>
          </div>

          {profileError && (
            <p className="text-xs text-red-500" role="alert">
              {profileError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-medium text-secondary">
                Full name
              </label>
              <input
                id="prof-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="prof-email" className="block text-xs font-medium text-secondary">
                Email
              </label>
              <input
                id="prof-email"
                type="email"
                disabled
                value={user?.email ?? ''}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card-muted px-3 text-sm text-muted"
              />
            </div>
            <div>
              <label htmlFor="prof-role" className="block text-xs font-medium text-secondary">
                Role (display label)
              </label>
              <input
                id="prof-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="prof-lang" className="block text-xs font-medium text-secondary">
                Language preference
              </label>
              <select
                id="prof-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageOption)}
                className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              >
                <option value="English">English</option>
                <option value="Français">Français</option>
                <option value="Deutsch">Deutsch</option>
                <option value="Español">Español</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <p className="text-xs text-muted">
              Saved directly to your owner-only Firestore profile.
            </p>
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Appearance tab */}
      {tab === 'appearance' && (
        <div className="max-w-2xl rounded-xl border border-border bg-card p-6 space-y-6">
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">Theme</h2>
            <p className="mt-0.5 text-xs text-muted">
              Saved in local storage (`seon-theme`) across sessions.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                  theme === 'light'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-border bg-background/60 hover:bg-card-muted'
                }`}
              >
                <Sun className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Light mode</p>
                  <p className="text-xs text-muted">Crisp daylight canvas</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                  theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-border bg-background/60 hover:bg-card-muted'
                }`}
              >
                <Moon className="h-5 w-5 text-sky-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Dark mode</p>
                  <p className="text-xs text-muted">Deep obsidian slate</p>
                </div>
              </button>
            </div>
          </div>

          <div className="divide-y divide-border border-t border-border pt-4">
            <ToggleRow
              id="pref-reduce-motion"
              label="Reduce motion"
              description="Disables UI transitions and KPI count-up animations globally."
              checked={preferences?.reduceMotion ?? false}
              onChange={(v) => void handlePrefToggle('reduceMotion', v)}
            />
            <ToggleRow
              id="pref-compact-density"
              label="Compact density"
              description="Reduces card padding across dashboard and monitoring panels."
              checked={preferences?.compactDensity ?? false}
              onChange={(v) => void handlePrefToggle('compactDensity', v)}
            />
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {tab === 'notifications' && (
        <div className="max-w-2xl rounded-xl border border-border bg-card p-6">
          <p className="mb-4 text-xs text-muted">
            Preferences persist to your profile. Automated email delivery is not wired in this
            prototype.
          </p>
          <div className="divide-y divide-border">
            <ToggleRow
              id="notif-peak"
              label="Peak alerts"
              description="Notify when building load exceeds 90% of daily quota."
              checked={preferences?.peakAlerts ?? true}
              onChange={(v) => void handlePrefToggle('peakAlerts', v)}
            />
            <ToggleRow
              id="notif-digest"
              label="Weekly digest"
              description="Monday morning portfolio energy summary."
              checked={preferences?.weeklyDigest ?? true}
              onChange={(v) => void handlePrefToggle('weeklyDigest', v)}
            />
            <ToggleRow
              id="notif-esg"
              label="ESG milestones"
              description="Alert when category ESG score shifts by ±5 points."
              checked={preferences?.esgMilestones ?? false}
              onChange={(v) => void handlePrefToggle('esgMilestones', v)}
            />
            <ToggleRow
              id="notif-updates"
              label="Product updates"
              description="Occasional updates about new SEON capabilities."
              checked={preferences?.productUpdates ?? false}
              onChange={(v) => void handlePrefToggle('productUpdates', v)}
            />
          </div>
        </div>
      )}

      {/* AI tab */}
      {tab === 'ai' && (
        <div className="max-w-2xl rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="divide-y divide-border">
            <ToggleRow
              id="ai-recs"
              label="Enable AI recommendations"
              description="Show Gemini optimization suggestions on Dashboard and ESG."
              checked={preferences?.aiRecommendations ?? true}
              onChange={(v) => void handlePrefToggle('aiRecommendations', v)}
            />
            <ToggleRow
              id="ai-auto"
              label="Auto-apply low-risk actions"
              description="Simulate automated scheduling for suggestions estimated below 3% impact."
              checked={preferences?.autoApplyLowRisk ?? false}
              onChange={(v) => void handlePrefToggle('autoApplyLowRisk', v)}
            />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground">Assistant tone</p>
            <p className="mt-0.5 text-xs text-muted">
              Passed directly to SEON Assistant while maintaining strict response brevity.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['Professional', 'Concise', 'Friendly'] as const).map((toneOpt) => (
                <button
                  key={toneOpt}
                  type="button"
                  onClick={() => void handleToneChange(toneOpt)}
                  className={`h-9 rounded-lg border px-4 text-xs font-medium transition-colors ${
                    (preferences?.aiTone ?? 'Concise') === toneOpt
                      ? 'border-emerald-500 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
                      : 'border-border bg-background text-secondary hover:text-foreground'
                  }`}
                >
                  {toneOpt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
