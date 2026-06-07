import { useSyncExternalStore, useCallback } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { Capacitor } from '@capacitor/core'
import { UserProfile } from '../types/user'
import { isDemoMode } from '../services/firebase'
import {
  subscribeToAuthState,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle as googleSignIn,
  signInWithApple as appleSignIn,
  signOut as authSignOut,
  deleteAccount as authDeleteAccount,
  resetPassword as authResetPassword,
  getUserProfile,
  persistUserProfile,
} from '../services/authService'

const DEMO_USER: UserProfile = {
  uid: 'demo-user',
  email: 'demo@makrofy.app',
  displayName: 'Demo User',
  photoURL: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  scanCount: 0,
  isPro: false,
  onboardingCompleted: true,
  goalSetupCompleted: false,
  hasExistingPlan: undefined,
  dailyGoal: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  preferredUnits: 'metric',
  mealReminders: false,
  weeklySummary: true,
  promoNotifs: false,
  dateKey: new Date().toISOString().split('T')[0],
  bodyMetrics: undefined,
}

const DEMO_USER_STORAGE_KEY = 'makrofy_user_demo-user'

function getDemoUser(): UserProfile {
  try {
    const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY)
    const extra = stored ? JSON.parse(stored) : {}
    return {
      ...DEMO_USER,
      ...extra,
      uid: DEMO_USER.uid,
      email: DEMO_USER.email,
      displayName: DEMO_USER.displayName,
      photoURL: DEMO_USER.photoURL,
      updatedAt: extra.updatedAt ?? new Date().toISOString(),
      dateKey: extra.dateKey ?? new Date().toISOString().split('T')[0],
    }
  } catch {
    return DEMO_USER
  }
}

interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: string | null
}

type NativeAuthUser = {
  uid: string
  email?: string | null
  displayName?: string | null
  photoUrl?: string | null
  metadata?: {
    creationTime?: string | number | null
    lastSignInTime?: string | number | null
  }
}

// ─── Shared store ────────────────────────────────────────────────────────────
// A single source of truth shared across every useAuth() consumer. Without this
// each component held its own state, so updating the profile in one place (e.g.
// finishing goal setup) didn't reach the route guard — causing a redirect loop.

let store: AuthState = { user: null, loading: true, error: null }
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function setStore(partial: Partial<AuthState>) {
  store = { ...store, ...partial }
  emit()
}

let initialized = false

function ensureInitialized() {
  if (initialized) return
  initialized = true

  if (isDemoMode) {
    setStore({ user: getDemoUser(), loading: false, error: null })
    return
  }

  // Fallback: if Firebase auth doesn't respond within 3s, assume signed out
  // (otherwise native app gets stuck on splash forever)
  const timeoutId = setTimeout(() => {
    if (store.loading) {
      console.warn('[useAuth] Auth state timeout — assuming signed out')
      setStore({ user: null, loading: false, error: null })
    }
  }, 3000)

  if (Capacitor.isNativePlatform()) {
    // On native, the @capacitor-firebase/authentication plugin owns auth state.
    // JS SDK's onAuthStateChanged is unreliable here because Apple Sign-In
    // can't sync the credential (nonce mismatch), so we rely exclusively on
    // the native plugin.
    import('@capacitor-firebase/authentication').then(({ FirebaseAuthentication }) => {
      const applyNativeUser = (nativeUser: NativeAuthUser | null) => {
        clearTimeout(timeoutId)
        try {
          if (nativeUser) {
            const fakeUser = {
              uid: nativeUser.uid,
              email: nativeUser.email ?? null,
              displayName: nativeUser.displayName ?? null,
              photoURL: nativeUser.photoUrl ?? null,
              metadata: {
                creationTime: nativeUser.metadata?.creationTime
                  ? new Date(nativeUser.metadata.creationTime).toISOString()
                  : new Date().toISOString(),
                lastSignInTime: nativeUser.metadata?.lastSignInTime
                  ? new Date(nativeUser.metadata.lastSignInTime).toISOString()
                : new Date().toISOString(),
              },
            } as unknown as FirebaseUser
            const profile = getUserProfile(fakeUser)
            setStore({ user: profile, loading: false, error: null })
          } else {
            setStore({ user: null, loading: false, error: null })
          }
        } catch (err: unknown) {
          const record = err && typeof err === 'object' ? err as { message?: string; code?: string; stack?: string } : null
          const msg = record?.message || record?.code || String(err)
          console.error('[useAuth] applyNativeUser error message:', msg)
          console.error('[useAuth] applyNativeUser error stack:', record?.stack)
          setStore({ user: null, loading: false, error: null })
        }
      }

      FirebaseAuthentication.addListener('authStateChange', (event) => {
        applyNativeUser(event.user)
      }).catch((err) => console.error('[useAuth] addListener error:', err))

      FirebaseAuthentication.getCurrentUser()
        .then(({ user: nativeUser }) => applyNativeUser(nativeUser))
        .catch((err) => console.error('[useAuth] getCurrentUser error:', err))
    }).catch((err) => console.error('[useAuth] plugin import error:', err))
  } else {
    // Web: use Firebase JS SDK's onAuthStateChanged
    subscribeToAuthState((firebaseUser: FirebaseUser | null) => {
      clearTimeout(timeoutId)
      if (firebaseUser) {
        setStore({ user: getUserProfile(firebaseUser), loading: false, error: null })
      } else {
        setStore({ user: null, loading: false, error: null })
      }
    })
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  ensureInitialized()
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): AuthState {
  return store
}

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot)

  const signIn = useCallback(async (email: string, password: string) => {
    setStore({ error: null })
    if (isDemoMode) {
      setStore({ user: getDemoUser(), loading: false, error: null })
      return
    }
    try {
      await signInWithEmail(email, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      setStore({ error: message })
      throw err
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setStore({ error: null })
    if (isDemoMode) {
      setStore({ user: getDemoUser(), loading: false, error: null })
      return
    }
    try {
      await signUpWithEmail(email, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed'
      setStore({ error: message })
      throw err
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    setStore({ error: null })
    if (isDemoMode) {
      setStore({ user: getDemoUser(), loading: false, error: null })
      return
    }
    try {
      await googleSignIn()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed'
      setStore({ error: message })
      throw err
    }
  }, [])

  const signInWithApple = useCallback(async () => {
    setStore({ error: null })
    if (isDemoMode) {
      setStore({ user: getDemoUser(), loading: false, error: null })
      return
    }
    try {
      await appleSignIn()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Apple sign-in failed'
      setStore({ error: message })
      throw err
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    setStore({ error: null })
    try {
      await authResetPassword(email)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed'
      setStore({ error: message })
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    if (isDemoMode) {
      setStore({ user: getDemoUser(), loading: false, error: null })
      return
    }
    await authSignOut()
    setStore({ user: null, loading: false, error: null })
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!store.user) return
    if (isDemoMode) {
      setStore({ user: null, loading: false, error: null })
      return
    }
    const userId = store.user.uid
    await authDeleteAccount(userId)
    setStore({ user: null, loading: false, error: null })
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!store.user) return
    setStore({ user: { ...store.user, ...updates } })
    persistUserProfile({ uid: store.user.uid, ...updates })
  }, [])

  const clearError = useCallback(() => {
    setStore({ error: null })
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    signOut,
    deleteAccount,
    updateProfile,
    clearError,
  }
}
