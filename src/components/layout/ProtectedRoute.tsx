import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../ui/Spinner'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // New user hasn't completed goal setup yet → redirect to onboarding flow
  // (skip if already on /goal-setup to avoid redirect loop)
  if (!user.goalSetupCompleted && location.pathname !== '/goal-setup') {
    return <Navigate to="/goal-setup" replace />
  }

  return <>{children}</>
}
