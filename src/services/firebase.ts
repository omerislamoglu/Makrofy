import { initializeApp, FirebaseOptions } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore'
import { Capacitor } from '@capacitor/core'
import { getStorage } from 'firebase/storage'

// ─── Environment validation ────────────────────────────────────────────────
// All Firebase config comes from Vite env vars (prefixed VITE_).
// See .env.example for the required keys.

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

const missing = requiredEnvVars.filter((key) => !import.meta.env[key])

if (missing.length > 0 && import.meta.env.PROD) {
  throw new Error(
    `Missing Firebase environment variables:\n${missing.join('\n')}\n\n` +
    'Copy .env.example to .env and fill in your Firebase project values.'
  )
}

if (missing.length > 0) {
  console.warn(
    '[Makrofy] Firebase env vars missing — running in offline/demo mode.\n' +
    'Copy .env.example to .env and add your Firebase project values.'
  )
}

// ─── Demo mode flag ────────────────────────────────────────────────────────

export const isDemoMode = missing.length > 0

// ─── Firebase config ───────────────────────────────────────────────────────

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '0',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '0:0:web:0',
}

// ─── Initialize Firebase ───────────────────────────────────────────────────

const app = initializeApp(firebaseConfig)

export { app }
export const auth = getAuth(app)

// ─── Firestore — offline persistence ─────────────────────────────────────────
// Web path: IndexedDB-backed cache so documents survive page/app reloads.
// Native iOS path: uses Cloud Functions via fetch (not Firestore Web SDK), so
// the Firestore client never executes reads/writes — memoryLocalCache is fine.
// Demo mode: no real Firebase project, any cache setting works, keep it light.
export const db = (isDemoMode || Capacitor.isNativePlatform())
  ? getFirestore(app)
  : initializeFirestore(app, { localCache: persistentLocalCache() })

export const storage = getStorage(app)

export default app
