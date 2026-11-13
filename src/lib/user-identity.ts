export interface RawAuthIdentity {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  providerId?: string | null;
  metadataName?: string | null;
  fullName?: string | null;
  picture?: string | null;
}

export interface NormalizedUserIdentity {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  avatarUrl: string | null;
  initials: string;
  provider: 'Google' | 'Email';
  providerId: 'google.com' | 'password';
}

export function computeInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function normalizeUserIdentity(raw: RawAuthIdentity): NormalizedUserIdentity {
  const email = (raw.email ?? '').trim();
  const emailLocal = email.includes('@') ? email.split('@')[0] : email;

  const displayName =
    raw.metadataName?.trim() ||
    raw.fullName?.trim() ||
    raw.displayName?.trim() ||
    emailLocal.trim() ||
    'User';

  const firstName = displayName.split(/\s+/)[0] || 'there';
  const avatarUrl = raw.photoURL?.trim() || raw.picture?.trim() || null;
  const initials = computeInitials(displayName);

  const isGoogle = raw.providerId === 'google.com';
  return {
    id: raw.uid,
    email,
    displayName,
    firstName,
    avatarUrl,
    initials,
    provider: isGoogle ? 'Google' : 'Email',
    providerId: isGoogle ? 'google.com' : 'password',
  };
}
