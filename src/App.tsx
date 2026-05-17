import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useUserStore } from '@/store/userStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useAppData } from '@/hooks/useAppData';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { TrackingPage } from '@/features/tracking/TrackingPage';
import { CalendarPage } from '@/features/calendar/CalendarPage';
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage';
import { PhotosPage } from '@/features/photos/PhotosPage';
import { GoalsPage } from '@/features/goals/GoalsPage';
import { AchievementsPage } from '@/features/gamification/AchievementsPage';
import { HabitsPage } from '@/features/habits/HabitsPage';
import { InsightsPage } from '@/features/insights/InsightsPage';
import { WaterPage } from '@/features/habits/WaterPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { PlansPage } from '@/features/plans/PlansPage';
import { PlanDetailPage } from '@/features/plans/PlanDetailPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

function AppInitializer({ children }: { children: React.ReactNode }) {
  useAppData();
  const { updateStreak } = useTrackingStore();

  useEffect(() => {
    updateStreak();
  }, []);

  return <>{children}</>;
}

function AppRouter() {
  const { isOnboarded } = useUserStore();

  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  return (
    <AppInitializer>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/water" element={<WaterPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/plans/:planId" element={<PlanDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppInitializer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
