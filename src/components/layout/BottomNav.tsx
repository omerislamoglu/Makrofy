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

  const handleNavPress = (path: string) => {
    if (location.pathname === path) return
    haptics.selectionChanged()
    navigate(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade above nav */}
      <div className="h-6 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-800/40 bottom-nav-safe">
        <div className="flex justify-around items-center h-[60px] max-w-lg mx-auto px-2">
          {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
            const isActive = location.pathname === path
            const label = strings.nav[labelKey]

            return (
              <motion.button
                key={path}
                onClick={() => handleNavPress(path)}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="relative flex flex-col items-center justify-center w-14 h-12 rounded-xl"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-active"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Icon
                    size={21}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-zinc-500'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </motion.div>
                <span
                  className={`text-[9px] mt-0.5 tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-white font-semibold' : 'text-zinc-500'
                  }`}
                >
                  {label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
