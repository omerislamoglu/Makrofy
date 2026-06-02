import { Routes, Route } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'
import OnboardingPage from '../pages/OnboardingPage'
import AuthPage from '../pages/AuthPage'
import GoalSetupPage from '../pages/GoalSetupPage'
import HomePage from '../pages/HomePage'
import AddMealPage from '../pages/AddMealPage'
import AnalysisResultPage from '../pages/AnalysisResultPage'

import HistoryPage from '../pages/HistoryPage'
import FitnessPage from '../pages/FitnessPage'
import PaywallPage from '../pages/PaywallPage'
import ProfilePage from '../pages/ProfilePage'
import WorkoutTrackerPage from '../pages/WorkoutTrackerPage'

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
            <GoalSetupPage />
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
        <Route path="/add" element={<AddMealPage />} />
        <Route path="/analysis" element={<AnalysisResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/fitness" element={<FitnessPage />} />
        <Route path="/paywall" element={<PaywallPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/workout" element={<WorkoutTrackerPage />} />
      </Route>
    </Routes>
  )
}
