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

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_quarterly' | 'pro_yearly'

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
  resetsAt?: string // ISO date when free scans reset (if applicable)
}

export const FREE_DAILY_SCAN_LIMIT = 0
export const PRO_DAILY_SCAN_LIMIT = 5

// ─── Plan Pricing ───────────────────────────────────────────────────────────
export interface PlanPricing {
  plan: SubscriptionPlan
  price: number
  currency: string
  interval: 'month' | 'year' | null
  trialDays?: number
  savings?: string // e.g. "Save 33%"
}

export const PLAN_PRICES: PlanPricing[] = [
  { plan: 'free', price: 0, currency: 'TRY', interval: null },
  { plan: 'pro_monthly', price: 149.99, currency: 'TRY', interval: 'month' },
  { plan: 'pro_quarterly', price: 349.99, currency: 'TRY', interval: 'month', savings: '%22 tasarruf' },
  { plan: 'pro_yearly', price: 899.99, currency: 'TRY', interval: 'year', savings: '%50 tasarruf' },
]

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
