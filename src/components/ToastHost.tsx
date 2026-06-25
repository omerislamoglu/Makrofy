import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { useLocale } from '../contexts/LocaleContext'
import type { AppStrings } from '../i18n/locales/types'

// ─── ToastHost ───────────────────────────────────────────────────────────────
// Minimal global toast layer. The app has no toast system, so this listens for
// `makrofy:toast` window events (dispatched by optimisticMeals on a failed
// background save) and shows a short, auto-dismissing bottom toast.
//
// Save-error messages are produced in `mealService` (English only, no locale
// access there), so we localize the known messages here via a small lookup and
// fall back to the raw message for anything unrecognized.

type ToastType = 'error' | 'success' | 'info'

interface ToastDetail {
  type: ToastType
  message: string
}

interface ActiveToast extends ToastDetail {
  id: number
}

const AUTO_DISMISS_MS = 3200

// Maps the fixed English source strings from `getSaveErrorMessage` (in
// mealService) to keys in `strings.toastErrors`, so every locale gets native
// copy. Unknown messages fall back to the raw text.
const SAVE_ERROR_KEYS: Record<string, keyof AppStrings['toastErrors']> = {
  'Save permission denied. Please sign in again.': 'permissionDenied',
  'Analysis result could not be saved.': 'resultNotSaved',
  'Could not save meal. Check your connection and try again.': 'mealNotSaved',
}

function localizeMessage(message: string, strings: AppStrings): string {
  const key = SAVE_ERROR_KEYS[message]
  return key ? strings.toastErrors[key] : message
}

const TYPE_STYLES: Record<ToastType, { ring: string; icon: typeof Info }> = {
  error: { ring: 'border-red-500/40', icon: AlertCircle },
  success: { ring: 'border-emerald-500/40', icon: CheckCircle2 },
  info: { ring: 'border-zinc-600/50', icon: Info },
}

export default function ToastHost() {
  const { strings } = useLocale()
  const [toasts, setToasts] = useState<ActiveToast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail
      if (!detail || !detail.message) return
      const id = Date.now() + Math.random()
      const toast: ActiveToast = {
        id,
        type: detail.type ?? 'info',
        message: localizeMessage(detail.message, strings),
      }
      setToasts((prev) => [...prev.slice(-2), toast])
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    }
    window.addEventListener('makrofy:toast', handleToast)
    return () => window.removeEventListener('makrofy:toast', handleToast)
  }, [strings, dismiss])

  return (
    <div className="fixed inset-x-0 bottom-[84px] z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const { ring, icon: Icon } = TYPE_STYLES[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => dismiss(toast.id)}
              className={`pointer-events-auto flex items-center gap-2.5 max-w-sm w-full rounded-2xl border ${ring} bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-xl shadow-black/40`}
            >
              <Icon size={18} className="shrink-0 text-zinc-200" strokeWidth={2} />
              <span className="text-[13px] leading-snug text-zinc-100">
                {toast.message}
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
