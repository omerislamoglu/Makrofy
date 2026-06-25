import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'

// Eagerly loaded — tiny, always needed
import OnboardingPage from '../pages/OnboardingPage'
import AuthPage from '../pages/AuthPage'
import HomePage from '../pages/HomePage'

// Lazy loaded — heavy pages with large data imports
const GoalSetupPage = lazy(() => import('../pages/GoalSetupPage'))
const AddMealPage = lazy(() => import('../pages/AddMealPage'))
const AnalysisResultPage = lazy(() => import('../pages/AnalysisResultPage'))
const HistoryPage = lazy(() => import('../pages/HistoryPage'))
const FitnessPage = lazy(() => import('../pages/FitnessPage'))
const PaywallPage = lazy(() => import('../pages/PaywallPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const WorkoutTrackerPage = lazy(() => import('../pages/WorkoutTrackerPage'))

/** Minimal fallback — black screen while chunk loads (matches app bg) */
function PageFallback() {
  return <div className="min-h-screen bg-black" />
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Goal setup — protected but outside AppLayout (full-screen) */}
      <Route
        path="/goal-setup"
        element={
          <ProtectedRoute>
            <LazyPage><GoalSetupPage /></LazyPage>
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<LazyPage><AddMealPage /></LazyPage>} />
        <Route path="/analysis" element={<LazyPage><AnalysisResultPage /></LazyPage>} />
        <Route path="/history" element={<LazyPage><HistoryPage /></LazyPage>} />
        <Route path="/fitness" element={<LazyPage><FitnessPage /></LazyPage>} />
        <Route path="/paywall" element={<LazyPage><PaywallPage /></LazyPage>} />
        <Route path="/profile" element={<LazyPage><ProfilePage /></LazyPage>} />
        <Route path="/workout" element={<LazyPage><WorkoutTrackerPage /></LazyPage>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
