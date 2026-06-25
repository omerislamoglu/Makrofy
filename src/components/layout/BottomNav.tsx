import { useState, useEffect } from 'react'
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

const NAV_HEIGHT = 49

/** Measure safe-area-inset-bottom once, cache forever. */
let cachedSab: number | null = null
function getSafeAreaBottom(): number {
  if (cachedSab !== null) return cachedSab
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:fixed;bottom:0;left:0;height:env(safe-area-inset-bottom,0px);pointer-events:none;visibility:hidden;'
  document.body.appendChild(probe)
  cachedSab = probe.offsetHeight
  probe.remove()
  // Also lock the CSS variable so page-bottom etc. stay consistent
  document.documentElement.style.setProperty('--sab', `${cachedSab}px`)
  return cachedSab
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const haptics = useHaptics()
  const { strings } = useLocale()

  // Fixed pixel value — never changes after mount
  const [sab] = useState(() => getSafeAreaBottom())
  const totalHeight = NAV_HEIGHT + sab

  const handleNavPress = (path: string) => {
    if (location.pathname === path) return
    haptics.selectionChanged()
    navigate(path)
  }

  // Keep --bottom-nav-total in sync (for page-bottom class)
  useEffect(() => {
    document.documentElement.style.setProperty('--bottom-nav-total', `${totalHeight}px`)
  }, [totalHeight])

  return (
    <nav
      className="flex-shrink-0"
      style={{ height: totalHeight }}
    >
      <div
        className="bg-black border-t border-zinc-800/50"
        style={{ height: totalHeight, paddingBottom: sab }}
      >
        <div
          className="flex justify-around items-center max-w-lg mx-auto"
          style={{ height: NAV_HEIGHT }}
        >
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
