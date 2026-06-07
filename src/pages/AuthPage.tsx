import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, KeyRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLocale } from '../contexts/LocaleContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import MakrofyLogo from '../components/ui/MakrofyLogo'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ─── Auth modes ───────────────────────────────────────────────────────────────

type AuthMode = 'select' | 'email-login' | 'email-signup' | 'reset-password'

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const { strings } = useLocale()
  const a = strings.auth
  const [mode, setMode] = useState<AuthMode>('select')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const {
    user,
    loading: authLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    resetPassword,
    error,
    clearError,
  } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading || !user) return
    navigate(user.goalSetupCompleted ? '/' : '/goal-setup', { replace: true })
  }, [authLoading, navigate, user])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'email-signup') {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
    } catch {
      // Error handled by hook
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch {
      // Error handled by hook
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      // Error handled by hook
    } finally {
      setLoading(false)
    }
  }

  const handleApple = async () => {
    setLoading(true)
    try {
      await signInWithApple()
    } catch {
      // Error handled by hook
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    clearError()
    setResetSent(false)
    setMode('select')
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* ── Logo ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center mb-6"
        >
          <MakrofyLogo size={72} variant="full" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 text-[13px] text-center mb-10"
        >
          {a.tagline}
        </motion.p>

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════
              SELECT MODE — Social + Email seçim ekranı
              ═══════════════════════════════════════════════════════════ */}
          {mode === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Apple */}
              <button type="button"
                onClick={handleApple}
                disabled={loading}
                className="w-full h-[52px] rounded-2xl bg-white text-black font-semibold text-[15px]
                  flex items-center justify-center gap-3
                  active:scale-[0.97] transition-transform duration-100
                  disabled:opacity-50"
              >
                <AppleIcon />
                {a.continueApple}
              </button>

              {/* Google */}
              <button type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full h-[52px] rounded-2xl bg-zinc-900 text-white font-semibold text-[15px]
                  border border-zinc-800
                  flex items-center justify-center gap-3
                  hover:bg-zinc-800 active:scale-[0.97] transition-all duration-100
                  disabled:opacity-50"
              >
                <GoogleIcon />
                {a.continueGoogle}
              </button>

              {/* Separator */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-zinc-600 text-xs uppercase tracking-wider">{a.or}</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Email */}
              <button type="button"
                onClick={() => { clearError(); setMode('email-login') }}
                disabled={loading}
                className="w-full h-[52px] rounded-2xl bg-zinc-900 text-white font-semibold text-[15px]
                  border border-zinc-800
                  flex items-center justify-center gap-3
                  hover:bg-zinc-800 active:scale-[0.97] transition-all duration-100
                  disabled:opacity-50"
              >
                <Mail size={18} />
                {a.continueEmail}
              </button>

              {error && (
                <p className="text-red-400 text-sm text-center pt-2">{error}</p>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              EMAIL LOGIN
              ═══════════════════════════════════════════════════════════ */}
          {mode === 'email-login' && (
            <motion.div
              key="email-login"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <button type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-zinc-400 text-sm mb-6 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                {a.back}
              </button>

              <h2 className="text-white text-xl font-bold mb-6">{a.signIn}</h2>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder={a.emailPlaceholder}
                  value={email}
                  onChange={(e) => { clearError(); setEmail(e.target.value) }}
                  required
                  autoComplete="email"
                  leftIcon={<Mail size={16} />}
                />
                <Input
                  type="password"
                  placeholder={a.passwordPlaceholder}
                  value={password}
                  onChange={(e) => { clearError(); setPassword(e.target.value) }}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  leftIcon={<KeyRound size={16} />}
                />

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  {a.signIn}
                </Button>
              </form>

              <div className="flex items-center justify-between mt-5">
                <button type="button"
                  onClick={() => { clearError(); setMode('reset-password') }}
                  className="text-zinc-500 text-sm hover:text-white transition-colors"
                >
                  {a.forgotPassword}
                </button>
                <button type="button"
                  onClick={() => { clearError(); setMode('email-signup') }}
                  className="text-white text-sm font-medium underline underline-offset-4"
                >
                  {a.createAccount}
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              EMAIL SIGNUP
              ═══════════════════════════════════════════════════════════ */}
          {mode === 'email-signup' && (
            <motion.div
              key="email-signup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <button type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-zinc-400 text-sm mb-6 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                {a.back}
              </button>

              <h2 className="text-white text-xl font-bold mb-6">{a.createAccount}</h2>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder={a.emailPlaceholder}
                  value={email}
                  onChange={(e) => { clearError(); setEmail(e.target.value) }}
                  required
                  autoComplete="email"
                  leftIcon={<Mail size={16} />}
                />
                <Input
                  type="password"
                  placeholder={a.passwordSignupPlaceholder}
                  value={password}
                  onChange={(e) => { clearError(); setPassword(e.target.value) }}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  leftIcon={<KeyRound size={16} />}
                />

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  {a.signUp}
                </Button>
              </form>

              <p className="text-center mt-5 text-sm text-zinc-500">
                {a.alreadyHaveAccount}{' '}
                <button type="button"
                  onClick={() => { clearError(); setMode('email-login') }}
                  className="text-white underline underline-offset-4"
                >
                  {a.signIn}
                </button>
              </p>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              RESET PASSWORD
              ═══════════════════════════════════════════════════════════ */}
          {mode === 'reset-password' && (
            <motion.div
              key="reset-password"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <button type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-zinc-400 text-sm mb-6 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                {a.back}
              </button>

              <h2 className="text-white text-xl font-bold mb-2">{a.resetTitle}</h2>
              <p className="text-zinc-500 text-sm mb-6">
                {a.resetSubtitle}
              </p>

              {resetSent ? (
                <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 text-center">
                  <p className="text-green-400 text-sm font-medium mb-1">
                    {a.resetLinkSent}
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {a.resetEmailSent(email)}
                  </p>
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    className="mt-4"
                    onClick={() => { clearError(); setResetSent(false); setMode('email-login') }}
                  >
                    {a.signIn}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <Input
                    type="email"
                    placeholder={a.emailPlaceholder}
                    value={email}
                    onChange={(e) => { clearError(); setEmail(e.target.value) }}
                    required
                    autoComplete="email"
                    leftIcon={<Mail size={16} />}
                  />

                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                  >
                    {a.sendResetLink}
                  </Button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[11px] text-zinc-700 mt-10 leading-relaxed"
        >
          {a.footerTerms}{' '}
          <a href="https://makrofy.app/terms" target="_blank" rel="noopener noreferrer" className="text-zinc-500 underline">{a.footerTermsLink}</a> {a.footerAnd}{' '}
          <a href="https://makrofy.app/privacy" target="_blank" rel="noopener noreferrer" className="text-zinc-500 underline">{a.footerPrivacyLink}</a>{a.footerAccept}
        </motion.p>
      </motion.div>
    </div>
  )
}
