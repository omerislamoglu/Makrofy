import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithCredential,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { Capacitor } from '@capacitor/core'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app, auth, isDemoMode } from './firebase'
import { UserProfile, DailyGoal } from '../types/user'
import { logOutRevenueCat } from './revenueCatService'
import { clearNativeMealAuthCache } from './mealService'
import { clearOptimisticMeals } from './optimisticMeals'
import { clearOfflineQueue } from './offlineQueue'

const FUNCTIONS_REGION = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'

const STORAGE_KEY_PREFIX = 'makrofy_user_'

const DEFAULT_DAILY_GOAL: DailyGoal = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fat: 70,
}

export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, callback)
}

export async function signInWithEmail(email: string, password: string) {
  if (Capacitor.isNativePlatform() && !isDemoMode) {
    const { FirebaseAuthentication } = await import(
      '@capacitor-firebase/authentication'
    )
    return FirebaseAuthentication.signInWithEmailAndPassword({ email, password })
  }
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signUpWithEmail(email: string, password: string) {
  if (Capacitor.isNativePlatform() && !isDemoMode) {
    const { FirebaseAuthentication } = await import(
      '@capacitor-firebase/authentication'
    )
    return FirebaseAuthentication.createUserWithEmailAndPassword({ email, password })
  }
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}

// ─── Google Sign-In ─────────────────────────────────────────────────────────
export async function signInWithGoogle() {
  if (Capacitor.isNativePlatform()) {
    // Native: use @capacitor-firebase/authentication
    const { FirebaseAuthentication } = await import(
      '@capacitor-firebase/authentication'
    )
    const result = await FirebaseAuthentication.signInWithGoogle()
    // Sync credential with Firebase JS SDK
    const credential = GoogleAuthProvider.credential(result.credential?.idToken)
    return signInWithCredential(auth, credential)
  }
  // Web: popup
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

// ─── Apple Sign-In ──────────────────────────────────────────────────────────
export async function signInWithApple() {
  if (Capacitor.isNativePlatform()) {
    // Native: plugin (with skipNativeAuth: false) already signs into Firebase.
    // We just trigger it and let the auth state listener pick it up.
    const { FirebaseAuthentication } = await import(
      '@capacitor-firebase/authentication'
    )
    const result = await FirebaseAuthentication.signInWithApple()
    // Sync credential with Firebase JS SDK (needed when skipNativeAuth=true,
    // or as a fallback when JS SDK isn't auto-synced)
    if (result.credential?.idToken) {
      try {
        const provider = new OAuthProvider('apple.com')
        const credential = provider.credential({
          idToken: result.credential.idToken,
          rawNonce: result.credential.nonce,
        })
        await signInWithCredential(auth, credential)
      } catch (err) {
        // If JS SDK sync fails but native plugin already signed in,
        // we'll wait for onAuthStateChanged to fire from the native side.
        console.warn('[Apple Sign-In] JS SDK sync failed, relying on native:', err)
      }
    }
    return result
  }
  // Web: popup with Apple OAuth
  const provider = new OAuthProvider('apple.com')
  provider.addScope('email')
  provider.addScope('name')
  return signInWithPopup(auth, provider)
}

export async function signOut() {
  // Drop the previous account's cached native auth token and any in-flight
  // optimistic meals so the next user can never see leftover data (the native
  // meal Cloud Functions resolve the uid from the cached token).
  clearNativeMealAuthCache()
  clearOptimisticMeals()
  clearOfflineQueue()

  try {
    await logOutRevenueCat()
  } catch (err) {
    console.warn('[Auth] RevenueCat logOut skipped/failed:', err)
  }

  if (Capacitor.isNativePlatform() && !isDemoMode) {
    try {
      const { FirebaseAuthentication } = await import(
        '@capacitor-firebase/authentication'
      )
      await FirebaseAuthentication.signOut()
    } catch (err) {
      console.warn('[Auth] Native Firebase signOut failed, falling back to web signOut:', err)
      // fallthrough to web sign out
    }
  }
  return firebaseSignOut(auth)
}

function removeLocalUserProfile(userId: string): void {
  localStorage.removeItem(STORAGE_KEY_PREFIX + userId)
}

function getCFEndpoint(fnName: string): string {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const region = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
  return `https://${region}-${projectId}.cloudfunctions.net/${fnName}`
}

async function callDeleteAccountNative(): Promise<void> {
  const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
  const { token } = await FirebaseAuthentication.getIdToken({ forceRefresh: false })
  if (!token) throw new Error('No auth token available')

  const response = await fetch(getCFEndpoint('deleteAccount'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: {} }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Account deletion failed: ${response.status} ${body.substring(0, 200)}`)
  }
}

export async function deleteAccount(userId: string): Promise<void> {
  if (isDemoMode) {
    removeLocalUserProfile(userId)
    return
  }

  if (Capacitor.isNativePlatform()) {
    await callDeleteAccountNative()
  } else {
    const fn = httpsCallable<void, { success: boolean }>(
      getFunctions(app, FUNCTIONS_REGION),
      'deleteAccount'
    )
    await fn()
  }

  removeLocalUserProfile(userId)
  clearNativeMealAuthCache()
  clearOptimisticMeals()
  clearOfflineQueue()

  try {
    await logOutRevenueCat()
  } catch {
    // best effort after account deletion
  }

  if (Capacitor.isNativePlatform()) {
    try {
      const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication')
      await FirebaseAuthentication.signOut()
    } catch {
      // best effort after server-side auth user deletion
    }
  }

  try {
    await firebaseSignOut(auth)
  } catch {
    // The auth user may already be deleted server-side.
  }
}

export async function updateUserDisplayName(displayName: string) {
  if (!auth.currentUser) return
  return updateProfile(auth.currentUser, { displayName })
}

export function getUserProfile(firebaseUser: FirebaseUser): UserProfile {
  let extra: Partial<UserProfile> = {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + firebaseUser.uid)
    extra = stored ? (JSON.parse(stored) as Partial<UserProfile>) : {}
  } catch (e) {
    console.warn('[getUserProfile] localStorage read failed:', e)
  }

  const today = new Date().toISOString().split('T')[0]

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scanCount: extra.scanCount ?? 0,
    isPro: extra.isPro ?? false,
    onboardingCompleted: extra.onboardingCompleted ?? false,
    goalSetupCompleted: extra.goalSetupCompleted ?? false,
    dailyGoal: extra.dailyGoal ?? DEFAULT_DAILY_GOAL,
    hasExistingPlan: extra.hasExistingPlan ?? undefined,
    preferredUnits: extra.preferredUnits ?? 'metric',
    mealReminders: extra.mealReminders ?? false,
    weeklySummary: extra.weeklySummary ?? true,
    promoNotifs: extra.promoNotifs ?? false,
    calorieReminder: extra.calorieReminder ?? true,
    streakReminder: extra.streakReminder ?? true,
    dailyMotivation: extra.dailyMotivation ?? true,
    workoutReminder: extra.workoutReminder ?? true,
    evaluationReminder: extra.evaluationReminder ?? true,
    dateKey: extra.dateKey ?? today,
    bodyMetrics: extra.bodyMetrics ?? undefined,
  }
}

export function persistUserProfile(profile: Partial<UserProfile> & { uid: string }) {
  const key = STORAGE_KEY_PREFIX + profile.uid
  const existing = localStorage.getItem(key)
  let current: Record<string, unknown> = {}
  if (existing) {
    try {
      current = JSON.parse(existing)
    } catch {
      current = {}
    }
  }
  const updated = { ...current, ...profile }
  localStorage.setItem(key, JSON.stringify(updated))
}
