import { useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { useLocale } from '../contexts/LocaleContext'
import { hasChosenLanguage, markLanguageChosen, type AppLocale } from '../i18n'

interface LanguageOption {
  locale: AppLocale
  label: string // native name
  sub: string // English helper so global users always understand
  flag: string
}

const OPTIONS: LanguageOption[] = [
  { locale: 'en', label: 'English', sub: 'Continue in English', flag: '🌐' },
  { locale: 'tr', label: 'Türkçe', sub: 'Türkçe devam et', flag: '🇹🇷' },
  { locale: 'de', label: 'Deutsch', sub: 'Auf Deutsch fortfahren', flag: '🇩🇪' },
  { locale: 'fr', label: 'Français', sub: 'Continuer en français', flag: '🇫🇷' },
  { locale: 'es', label: 'Español', sub: 'Continuar en español', flag: '🇪🇸' },
  { locale: 'it', label: 'Italiano', sub: 'Continua in italiano', flag: '🇮🇹' },
]

/**
 * First-launch language selector. Shown once (until a choice is stored) so global
 * users can pick their language before seeing the app. After selection the choice
 * persists via the locale override + a "chosen" flag, and the gate never reappears.
 * The settings screen can still change the language later.
 */
export default function LanguageGate({ children }: { children: ReactNode }) {
  const { changeLocale } = useLocale()
  const [chosen, setChosen] = useState(() => hasChosenLanguage())
  const [selected, setSelected] = useState<AppLocale | null>(null)

  if (chosen) return <>{children}</>

  const handleContinue = (locale: AppLocale) => {
    setSelected(locale)
    changeLocale(locale)
    markLanguageChosen()
    // Small delay so the selection check is visible before the gate closes.
    window.setTimeout(() => setChosen(true), 180)
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-7 py-8 overflow-y-auto safe-area-top">
        <div className="mb-10">
          <h1 className="text-[30px] font-bold tracking-tight">Makrofy</h1>
          <p className="text-[15px] text-zinc-400 mt-3 leading-snug">
            Choose your language
            <br />
            <span className="text-zinc-500">Dilini seç</span>
          </p>
        </div>

        <div className="space-y-3">
          {OPTIONS.map((opt) => {
            const isSel = selected === opt.locale
            return (
              <button
                key={opt.locale}
                type="button"
                onClick={() => handleContinue(opt.locale)}
                className={`w-full flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all active:scale-[0.98] ${
                  isSel
                    ? 'bg-white/10 border-white/40 ring-1 ring-white/20'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className="text-[26px] leading-none">{opt.flag}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[16px] font-semibold">{opt.label}</span>
                  <span className="block text-[12px] text-zinc-500 mt-0.5">{opt.sub}</span>
                </span>
                {isSel && <Check size={20} className="text-white shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-center text-[11px] text-zinc-600 pb-8 px-7">
        You can change this later in Settings · Daha sonra Ayarlar'dan değiştirebilirsin
      </p>
    </div>
  )
}
