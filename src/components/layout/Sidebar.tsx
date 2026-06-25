import { useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarCheck,
  ClipboardList,
  Plus,
  Activity,
  User,
  Settings,
  Flame,
  LucideIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { useHaptics } from '../../hooks/useCapacitor'
import { useLocale } from '../../contexts/LocaleContext'
import { useAuth } from '../../hooks/useAuth'
import { useTodayMeals } from '../../hooks/useMeals'

interface SidebarItem {
  path: string
  icon: LucideIcon
  label: string
  /** When true, this item never shows the active highlight (secondary shortcut). */
  secondary?: boolean
}

const DEFAULT_GOAL_CALORIES = 2200

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const haptics = useHaptics()
  const { strings } = useLocale()
  const { user } = useAuth()
  const { todayMacros } = useTodayMeals(user?.uid)

  const goalCalories = user?.dailyGoal?.calories ?? DEFAULT_GOAL_CALORIES
  const consumed = Math.round(todayMacros?.calories ?? 0)
  const percent = goalCalories > 0 ? Math.min(Math.round((consumed / goalCalories) * 100), 100) : 0

  const items: SidebarItem[] = useMemo(
    () => [
      { path: '/', icon: CalendarCheck, label: strings.nav.today },
      { path: '/history', icon: ClipboardList, label: strings.nav.history },
      { path: '/add', icon: Plus, label: strings.nav.addMeal },
      { path: '/fitness', icon: Activity, label: strings.nav.fitness },
      { path: '/profile', icon: User, label: strings.nav.profile },
      { path: '/profile', icon: Settings, label: strings.nav.settings, secondary: true },
    ],
    [strings.nav]
  )

  const handlePress = (path: string) => {
    haptics.selectionChanged()
    if (location.pathname !== path) navigate(path)
  }

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-zinc-950 border-r border-zinc-800/40 safe-area-top">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6">
        <h1 className="text-[19px] font-bold tracking-tight text-white">Makrofy</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {items.map((item, idx) => {
          const isActive = !item.secondary && location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={`${item.path}-${idx}`}
              onClick={() => handlePress(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-800/70 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Daily Goal card */}
      <div className="p-3">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/50 px-4 py-4">
          <Flame size={16} className="text-zinc-400 mb-2" strokeWidth={1.8} />
          <p className="text-[11px] text-zinc-500 font-medium mb-1">{strings.home.dailyGoal}</p>
          <p className="text-[26px] font-bold leading-none text-white tabular-nums">{consumed}</p>
          <p className="text-[11px] text-zinc-500 mt-1 tabular-nums">/ {goalCalories} kcal</p>
          <div className="mt-3 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[12px] text-zinc-400 font-semibold mt-2 tabular-nums">{percent}%</p>
        </div>
      </div>
    </aside>
  )
}
