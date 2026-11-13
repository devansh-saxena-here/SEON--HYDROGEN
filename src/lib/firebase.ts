import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type User } from 'firebase/auth';
import {
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

export type LanguageOption = 'English' | 'Français' | 'Deutsch' | 'Español';
export type AiToneOption = 'Professional' | 'Concise' | 'Friendly';

export interface UserProfileRecord {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  provider: 'password' | 'google.com';
  role: string;
  language: LanguageOption;
}

export interface UserPreferencesRecord {
  uid: string;
  reduceMotion: boolean;
  compactDensity: boolean;
  peakAlerts: boolean;
  weeklyDigest: boolean;
  esgMilestones: boolean;
  productUpdates: boolean;
  aiRecommendations: boolean;
  autoApplyLowRisk: boolean;
  aiTone: AiToneOption;
}

export function getDefaultPreferences(uid: string): UserPreferencesRecord {
  return {
    uid,
    reduceMotion: false,
    compactDensity: false,
    peakAlerts: true,
    weeklyDigest: true,
    esgMilestones: false,
    productUpdates: false,
    aiRecommendations: true,
    autoApplyLowRisk: false,
    aiTone: 'Concise',
  };
}

export async function ensureUserProfile(
  user: User,
  overrideDisplayName?: string,
): Promise<UserProfileRecord> {
  const profilePath = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  const providerId: 'password' | 'google.com' =
    user.providerData.some((p) => p.providerId === 'google.com') ? 'google.com' : 'password';

  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: user.uid,
        email: typeof data.email === 'string' ? data.email : (user.email ?? ''),
        displayName:
          typeof data.displayName === 'string'
            ? data.displayName
            : (user.displayName ?? user.email?.split('@')[0] ?? 'User'),
        avatarUrl: typeof data.avatarUrl === 'string' ? data.avatarUrl : (user.photoURL ?? null),
        provider: data.provider === 'google.com' ? 'google.com' : providerId,
        role: typeof data.role === 'string' ? data.role : 'Sustainability Lead',
        language:
          data.language === 'Français' ||
          data.language === 'Deutsch' ||
          data.language === 'Español'
            ? data.language
            : 'English',
      };
    }

    const email = (user.email ?? 'user@seon.app').slice(0, 255);
    const rawName =
      overrideDisplayName?.trim() ||
      user.displayName?.trim() ||
      email.split('@')[0] ||
      'User';
    const displayName = rawName.slice(0, 80);
    const avatarUrl = user.photoURL ? user.photoURL.slice(0, 512) : null;

    await setDoc(ref, {
      uid: user.uid,
      email,
      displayName,
      avatarUrl,
      provider: providerId,
      role: 'Sustainability Lead',
      language: 'English',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      uid: user.uid,
      email,
      displayName,
      avatarUrl,
      provider: providerId,
      role: 'Sustainability Lead',
      language: 'English',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, profilePath);
  }
}

export async function updateUserProfileRecord(
  uid: string,
  updates: {
    displayName: string;
    role: string;
    language: LanguageOption;
    avatarUrl?: string | null;
  },
): Promise<void> {
  const profilePath = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      displayName: updates.displayName.trim().slice(0, 80),
      role: updates.role.trim().slice(0, 60),
      language: updates.language,
      ...(updates.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl } : {}),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, profilePath);
  }
}

export async function loadUserPreferences(uid: string): Promise<UserPreferencesRecord> {
  const prefPath = `users/${uid}/preferences/settings`;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'preferences', 'settings'));
    if (!snap.exists()) {
      return getDefaultPreferences(uid);
    }
    const d = snap.data();
    return {
      uid,
      reduceMotion: Boolean(d.reduceMotion),
      compactDensity: Boolean(d.compactDensity),
      peakAlerts: d.peakAlerts !== undefined ? Boolean(d.peakAlerts) : true,
      weeklyDigest: d.weeklyDigest !== undefined ? Boolean(d.weeklyDigest) : true,
      esgMilestones: Boolean(d.esgMilestones),
      productUpdates: Boolean(d.productUpdates),
      aiRecommendations: d.aiRecommendations !== undefined ? Boolean(d.aiRecommendations) : true,
      autoApplyLowRisk: Boolean(d.autoApplyLowRisk),
      aiTone:
        d.aiTone === 'Professional' || d.aiTone === 'Friendly' || d.aiTone === 'Concise'
          ? d.aiTone
          : 'Concise',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, prefPath);
  }
}

export async function saveUserPreferences(
  uid: string,
  prefs: UserPreferencesRecord,
): Promise<void> {
  const prefPath = `users/${uid}/preferences/settings`;
  try {
    await setDoc(doc(db, 'users', uid, 'preferences', 'settings'), {
      uid,
      reduceMotion: Boolean(prefs.reduceMotion),
      compactDensity: Boolean(prefs.compactDensity),
      peakAlerts: Boolean(prefs.peakAlerts),
      weeklyDigest: Boolean(prefs.weeklyDigest),
      esgMilestones: Boolean(prefs.esgMilestones),
      productUpdates: Boolean(prefs.productUpdates),
      aiRecommendations: Boolean(prefs.aiRecommendations),
      autoApplyLowRisk: Boolean(prefs.autoApplyLowRisk),
      aiTone: prefs.aiTone,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, prefPath);
  }
}
