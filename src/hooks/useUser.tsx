import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, updateProfile, type User } from 'firebase/auth';
import {
  auth,
  ensureUserProfile,
  getDefaultPreferences,
  loadUserPreferences,
  saveUserPreferences,
  updateUserProfileRecord,
  type LanguageOption,
  type UserPreferencesRecord,
  type UserProfileRecord,
} from '../lib/firebase';
import { normalizeUserIdentity, type NormalizedUserIdentity } from '../lib/user-identity';
import { useTheme } from '../components/ThemeProvider';

interface AuthContextValue {
  firebaseUser: User | null;
  user: NormalizedUserIdentity | null;
  profile: UserProfileRecord | null;
  preferences: UserPreferencesRecord | null;
  loading: boolean;
  saveProfile: (updates: {
    displayName: string;
    role: string;
    language: LanguageOption;
  }) => Promise<void>;
  updatePreferences: (next: Partial<UserPreferencesRecord>) => Promise<void>;
  signOutAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [preferences, setPreferences] = useState<UserPreferencesRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const { setReduceMotion, setCompactDensity } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setFirebaseUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setPreferences(null);
        setLoading(false);
        return;
      }

      try {
        const [prof, prefs] = await Promise.all([
          ensureUserProfile(nextUser),
          loadUserPreferences(nextUser.uid),
        ]);
        setProfile(prof);
        setPreferences(prefs);
        setReduceMotion(prefs.reduceMotion);
        setCompactDensity(prefs.compactDensity);
      } catch (err) {
        console.error('Failed loading user profile/preferences:', err);
        setPreferences(getDefaultPreferences(nextUser.uid));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setCompactDensity, setReduceMotion]);

  const user: NormalizedUserIdentity | null = firebaseUser
    ? normalizeUserIdentity({
        uid: firebaseUser.uid,
        email: profile?.email ?? firebaseUser.email,
        displayName: profile?.displayName ?? firebaseUser.displayName,
        photoURL: profile?.avatarUrl ?? firebaseUser.photoURL,
        providerId:
          profile?.provider ??
          (firebaseUser.providerData.some((p) => p.providerId === 'google.com')
            ? 'google.com'
            : 'password'),
      })
    : null;

  const saveProfile = useCallback(
    async (updates: { displayName: string; role: string; language: LanguageOption }) => {
      if (!firebaseUser) throw new Error('No active signed-in user.');
      await updateProfile(firebaseUser, { displayName: updates.displayName.trim() });
      await updateUserProfileRecord(firebaseUser.uid, updates);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName: updates.displayName.trim(),
              role: updates.role.trim(),
              language: updates.language,
            }
          : prev,
      );
    },
    [firebaseUser],
  );

  const updatePreferences = useCallback(
    async (patch: Partial<UserPreferencesRecord>) => {
      if (!firebaseUser) throw new Error('No active signed-in user.');
      const base = preferences ?? getDefaultPreferences(firebaseUser.uid);
      const next: UserPreferencesRecord = {
        ...base,
        ...patch,
        uid: firebaseUser.uid,
      };
      setPreferences(next);
      setReduceMotion(next.reduceMotion);
      setCompactDensity(next.compactDensity);
      await saveUserPreferences(firebaseUser.uid, next);
    },
    [firebaseUser, preferences, setCompactDensity, setReduceMotion],
  );

  const signOutAccount = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        profile,
        preferences,
        loading,
        saveProfile,
        updatePreferences,
        signOutAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUser must be used inside AuthProvider');
  return ctx;
}
