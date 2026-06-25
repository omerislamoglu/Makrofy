import { FirestoreTimestamp } from './user'

// ─── Subscription ───────────────────────────────────────────────────────────
export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  platform: SubscriptionPlatform
  productId?: string // App Store / Play Store product ID
  transactionId?: string
  startedAt: FirestoreTimestamp
  expiresAt: FirestoreTimestamp | null
  cancelledAt: FirestoreTimestamp | null
  renewsAt?: FirestoreTimestamp | null
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export type SubscriptionPlan =
  | 'free'
  | 'plus_monthly'
  | 'plus_quarterly'
  | 'plus_yearly'
  | 'pro_monthly'
  | 'pro_quarterly'
  | 'pro_yearly'

export type SubscriptionTier = 'free' | 'plus' | 'pro'

export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'trial'
  | 'past_due'
  | 'grace_period'

export type SubscriptionPlatform = 'ios' | 'android' | 'web' | 'none'

// ─── Scan Limit ─────────────────────────────────────────────────────────────
export interface ScanLimit {
  used: number
  total: number
  remaining: number
  isLimited: boolean
  extraCredits?: number
  resetsAt?: string // ISO date when free scans reset (if applicable)
}

export const FREE_DAILY_SCAN_LIMIT = 0
export const PLUS_DAILY_SCAN_LIMIT = 3
export const PRO_DAILY_SCAN_LIMIT = 5

export function getPlanTier(plan?: SubscriptionPlan | string | null): SubscriptionTier {
  if (!plan) return 'free'
  if (plan.includes('pro')) return 'pro'
  if (plan.includes('plus')) return 'plus'
  return 'free'
}

export function getDailyScanLimitForTier(tier: SubscriptionTier): number {
  if (tier === 'pro') return PRO_DAILY_SCAN_LIMIT
  if (tier === 'plus') return PLUS_DAILY_SCAN_LIMIT
  return FREE_DAILY_SCAN_LIMIT
}

// ─── Paywall Config ─────────────────────────────────────────────────────────
export interface PaywallConfig {
  title: string
  subtitle?: string
  features: PaywallFeature[]
  ctaText: string
  dismissible: boolean
}

export interface PaywallFeature {
  label: string
  description?: string
  included: boolean
}
