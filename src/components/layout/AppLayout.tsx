import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'
import { useAppRating } from '../../hooks/useAppRating'
import RatingModal from '../ui/RatingModal'

export default function AppLayout() {
  const { showRating, handleRate, handleLater, handleDismiss } = useAppRating()

  return (
    <div className="h-dvh bg-black text-white flex overflow-hidden">
      {/* Status bar safe area overlay — siyah arka plan status bar arkasında */}
      <div className="fixed top-0 left-0 right-0 z-[100] safe-area-top bg-black" />

      {/* Sidebar — only on tablet/iPad widths (≥768px) */}
      <Sidebar />

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain smooth-scroll-area">
          <Outlet />
        </main>
        <BottomNav />
      </div>

      <RatingModal
        show={showRating}
        onRate={handleRate}
        onLater={handleLater}
        onDismiss={handleDismiss}
      />
    </div>
  )
}
