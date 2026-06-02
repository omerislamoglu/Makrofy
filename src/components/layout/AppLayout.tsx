import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Status bar safe area overlay — siyah arka plan status bar arkasında */}
      <div className="fixed top-0 left-0 right-0 z-[100] safe-area-top bg-black" />
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 'var(--bottom-nav-total)' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
