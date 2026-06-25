import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Plus, Clock, Dumbbell, User, LucideIcon } from 'lucide-react'
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

/**
 * Read env(safe-area-inset-bottom) once and lock it into --sab.
 * This prevents the bottom nav from resizing during iOS scroll bounce.
 */
let sabLocked = false
function lockSafeAreaBottom() {
  if (sabLocked) return
  sabLocked = true
  // Create a temp element to read the real env() value
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:fixed;bottom:0;left:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;visibility:hidden;'
  document.body.appendChild(probe)
  // Read after layout
  requestAnimationFrame(() => {
    const px = probe.offsetHeight
    probe.remove()
    document.documentElement.style.setProperty('--sab', `${px}px`)
  })
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const haptics = useHaptics()
  const { strings } = useLocale()
  const locked = useRef(false)

  useEffect(() => {
    if (!locked.current) {
      locked.current = true
      lockSafeAreaBottom()
    }
  }, [])

  const handleNavPress = (path: string) => {
    if (location.pathname === path) return
    haptics.selectionChanged()
    navigate(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:left-64 z-50">
      <div className="bg-black border-t border-zinc-800/50 bottom-nav-safe">
        <div className="flex justify-around items-center h-[49px] max-w-lg mx-auto">
          {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
            const isActive = location.pathname === path
            const label = strings.nav[labelKey]

            return (
              <button
                key={path}
                onClick={() => handleNavPress(path)}
                aria-label={label}
                className="flex flex-col items-center justify-center flex-1 min-w-0 h-full gap-0.5 touch-manipulation select-none active:opacity-60"
              >
                <Icon
                  size={22}
                  className={isActive ? 'text-white' : 'text-zinc-500'}
                  strokeWidth={isActive ? 2.2 : 1.6}
                />
                <span
                  className={`text-[10px] leading-none ${
                    isActive ? 'text-white font-semibold' : 'text-zinc-500 font-medium'
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
