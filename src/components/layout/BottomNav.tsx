import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Plus, Clock, Dumbbell, User, LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useHaptics } from '../../hooks/useCapacitor'
import { useLocale } from '../../contexts/LocaleContext'

interface NavItem {
  path: string
  icon: LucideIcon
  labelKey: 'home' | 'history' | 'add' | 'fitness' | 'profile'
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', icon: Home, labelKey: 'home' },
  { path: '/history', icon: Clock, labelKey: 'history' },
  { path: '/add', icon: Plus, labelKey: 'add' },
  { path: '/fitness', icon: Dumbbell, labelKey: 'fitness' },
  { path: '/profile', icon: User, labelKey: 'profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const haptics = useHaptics()
  const { strings } = useLocale()

  // Start invisible, become visible after layout stabilises (safe areas, etc.).
  // The splash screen covers everything for ~2.4 s anyway, so the user never
  // sees the invisible → visible transition.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 150)
    return () => clearTimeout(timer)
  }, [])

  const handleNavPress = (path: string) => {
    if (location.pathname === path) return
    haptics.selectionChanged()
    navigate(path)
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 md:left-64 z-50 transition-opacity duration-300 ${
        ready ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Gradient fade above nav */}
      <div className="h-6 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800/40 bottom-nav-safe">
        <div className="flex justify-around items-center h-[50px] max-w-lg mx-auto px-2">
          {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
            const isActive = location.pathname === path
            const label = strings.nav[labelKey]

            return (
              <motion.button
                key={path}
                onClick={() => handleNavPress(path)}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.06, ease: 'easeOut' }}
                aria-label={label}
                className="relative flex items-center justify-center flex-1 min-w-0 h-full rounded-xl touch-manipulation select-none"
              >
                <Icon
                  size={26}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-zinc-500'
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
