import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Footprints, Droplets, Dumbbell, TrendingDown, ChevronRight } from 'lucide-react';
import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularProgress, ProgressBar } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { useUserStore } from '@/store/userStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { useTodayStats } from '@/hooks/useAppData';
import { useInsights } from '@/hooks/useInsights';
import { calcProgress, formatSteps, formatWater, today } from '@/lib/utils';
import { QuickAddModal } from './QuickAddModal';
import { insightColors } from '@/components/ui/Badge';
import type { InsightType } from '@/types';

export function Dashboard() {
  const { profile } = useUserStore();
  const { streak } = useTrackingStore();
  const { userLevel } = useGoalsStore();
  const { todayWorkouts, todayMetrics, todayWeight, caloriesConsumed, caloriesBurned, goals } = useTodayStats();
  const insights = useInsights();
  const [quickAdd, setQuickAdd] = useState<'workout' | 'meal' | 'weight' | 'steps' | 'water' | null>(null);

  const calGoal = goals.dailyCalories;
  const calPercent = calcProgress(caloriesConsumed, calGoal);
  const stepPercent = calcProgress(todayMetrics.steps, todayMetrics.stepsGoal);
  const waterPercent = calcProgress(todayMetrics.waterMl, todayMetrics.waterGoalMl);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle={`${greeting()}, ${profile?.name ?? 'Athlete'}! · ${format(new Date(), 'EEEE, MMM d')}`}
        actions={
          <Button size="sm" onClick={() => setQuickAdd('meal')} className="gap-2 px-4 py-2">
            <Plus size={15} /> Quick Add
          </Button>
        }
      />

      <PageContent>

        {/* ════════════════════ STAT CARDS ════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard accent="#FF9F0A" label="Streak">
            <div className="flex items-end gap-3 my-2">
              <span className="text-6xl font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#FF9F0A' }}>
                {streak.currentStreak}
              </span>
              <span className="text-3xl leading-none mb-1">🔥</span>
            </div>
            <p className="text-sm text-[#9A9AAC]">Best: {streak.longestStreak} days</p>
          </StatCard>

          <StatCard accent="#C8FF00" label="Level">
            <div className="flex items-end gap-3 my-2">
              <span className="text-6xl font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#C8FF00' }}>
                {userLevel.level}
              </span>
              <span className="text-base font-semibold text-[#9A9AAC] mb-2">{userLevel.title}</span>
            </div>
            <ProgressBar value={Math.round((userLevel.xp / userLevel.xpToNextLevel) * 100)} height={5} />
            <p className="text-sm text-[#9A9AAC] mt-2">{userLevel.xp} / {userLevel.xpToNextLevel} XP</p>
          </StatCard>

          <StatCard accent="#F0F0F5" label="Weight">
            <div className="flex items-end gap-2 my-2">
              <span className="text-6xl font-black leading-none text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {todayWeight?.weightKg ?? profile?.currentWeightKg?.toFixed(1) ?? '--'}
              </span>
              <span className="text-base text-[#9A9AAC] mb-2">kg</span>
            </div>
            {profile?.currentWeightKg && profile?.goalWeightKg && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown size={14} className="text-[#30D158]" />
                <span className="text-[#30D158]">
                  {Math.abs(profile.currentWeightKg - profile.goalWeightKg).toFixed(1)} kg to goal
                </span>
              </div>
            )}
          </StatCard>

          <StatCard accent="#C8FF00" label="Workout">
            <div className="flex items-end gap-2 my-2">
              <span className="text-6xl font-black leading-none text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {todayWorkouts.filter((w) => w.completed).length}
              </span>
              <span className="text-base text-[#9A9AAC] mb-2">today</span>
            </div>
            <p className="text-sm text-[#9A9AAC]">
              {todayWorkouts.filter((w) => w.completed).length > 0 ? '✅ Session logged' : '— No workout yet'}
            </p>
          </StatCard>
        </div>

        {/* ════════════════════ CALORIES + METRICS + MACROS ════════════════════ */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Calorie ring */}
          <Card glow className="p-8 flex flex-col items-center text-center">
            <Label>Calories Today</Label>
            <div className="my-6">
              <CircularProgress value={calPercent} size={160} strokeWidth={13} color={calPercent > 110 ? '#FF4560' : '#C8FF00'}>
                <div className="text-center">
                  <div className="text-4xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {caloriesConsumed.toLocaleString()}
                  </div>
                  <div className="text-sm text-[#9A9AAC] mt-1">of {calGoal.toLocaleString()} kcal</div>
                </div>
              </CircularProgress>
            </div>
            <div className="w-full rounded-2xl bg-[#1A1A1E] border border-[#2A2A30] overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#2A2A30]">
                <span className="text-sm text-[#9A9AAC]">Consumed</span>
                <span className="text-sm font-bold text-[#C8FF00]">{caloriesConsumed.toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#2A2A30]">
                <span className="text-sm text-[#9A9AAC]">Burned</span>
                <span className="text-sm font-bold text-[#FF4560]">−{caloriesBurned} kcal</span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm text-[#9A9AAC]">Remaining</span>
                <span className="text-sm font-bold text-[#F0F0F5]">{Math.max(0, calGoal - caloriesConsumed + caloriesBurned).toLocaleString()} kcal</span>
              </div>
            </div>
          </Card>

          {/* Steps + Water */}
          <div className="flex flex-col gap-5">
            <Card className="p-7 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#0A84FF]/15">
                <Footprints size={22} className="text-[#0A84FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-[#D0D0DA]">Steps</span>
                  <span className="text-base font-bold text-[#0A84FF]">{formatSteps(todayMetrics.steps)} / {formatSteps(todayMetrics.stepsGoal)}</span>
                </div>
                <ProgressBar value={stepPercent} color="#0A84FF" height={7} />
              </div>
              <button
                onClick={() => setQuickAdd('steps')}
                className="w-10 h-10 rounded-xl bg-[#1E1E23] flex items-center justify-center text-[#9A9AAC] hover:text-[#F0F0F5] hover:bg-[#2A2A30] transition-colors shrink-0"
              >
                <Plus size={17} />
              </button>
            </Card>

            <Card className="p-7 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#30D158]/15">
                <Droplets size={22} className="text-[#30D158]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-[#D0D0DA]">Water</span>
                  <span className="text-base font-bold text-[#30D158]">{formatWater(todayMetrics.waterMl)} / {formatWater(todayMetrics.waterGoalMl)}</span>
                </div>
                <ProgressBar value={waterPercent} color="#30D158" height={7} />
              </div>
              <button
                onClick={() => setQuickAdd('water')}
                className="w-10 h-10 rounded-xl bg-[#1E1E23] flex items-center justify-center text-[#9A9AAC] hover:text-[#F0F0F5] hover:bg-[#2A2A30] transition-colors shrink-0"
              >
                <Plus size={17} />
              </button>
            </Card>
          </div>

          {/* Macros */}
          <Card className="p-8">
            <Label>Macro Targets</Label>
            <div className="space-y-6 mt-6">
              {[
                { label: 'Protein', target: Math.round(profile ? profile.currentWeightKg * 2 : 160), color: '#FF4560', unit: 'g' },
                { label: 'Carbs', target: Math.round((calGoal * 0.45) / 4), color: '#C8FF00', unit: 'g' },
                { label: 'Fat', target: Math.round((calGoal * 0.25) / 9), color: '#FF9F0A', unit: 'g' },
              ].map(({ label, target, color, unit }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base text-[#C0C0CC] font-medium">{label}</span>
                    <span className="text-base font-bold tabular-nums" style={{ color }}>0 / {target}{unit}</span>
                  </div>
                  <ProgressBar value={0} color={color} height={8} />
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-8 py-3" onClick={() => setQuickAdd('meal')}>
              <Plus size={16} /> Log Meal
            </Button>
          </Card>
        </div>

        {/* ════════════════════ QUICK ADD ════════════════════ */}
        <div>
          <SectionHeader title="Quick Add" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Log Workout', icon: '💪', action: () => setQuickAdd('workout') },
              { label: 'Log Meal', icon: '🥗', action: () => setQuickAdd('meal') },
              { label: 'Log Weight', icon: '⚖️', action: () => setQuickAdd('weight') },
              { label: 'Log Steps', icon: '👟', action: () => setQuickAdd('steps') },
            ].map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-4 p-6 rounded-2xl border border-[#2A2A30] bg-[#17171A] hover:bg-[#1E1E23] hover:border-[#C8FF00]/30 hover:-translate-y-1 active:scale-[0.98] transition-all text-left group"
              >
                <span className="text-3xl leading-none">{icon}</span>
                <span className="text-base font-semibold text-[#9A9AAC] group-hover:text-[#F0F0F5] transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════ INSIGHTS ════════════════════ */}
        {insights.length > 0 && (
          <div>
            <SectionHeader title="Today's Insights" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {insights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════ TODAY'S WORKOUTS ════════════════════ */}
        {todayWorkouts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <SectionHeader title="Today's Workouts" />
              <Button variant="ghost" size="sm" className="gap-1 text-[#9A9AAC]">View All <ChevronRight size={14} /></Button>
            </div>
            <div className="space-y-4">
              {todayWorkouts.map((workout) => (
                <Card key={workout.id} hover className="p-6 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#C8FF00]/10 flex items-center justify-center shrink-0">
                    <Dumbbell size={22} className="text-[#C8FF00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-[#F0F0F5] truncate">{workout.name}</p>
                    <p className="text-sm text-[#9A9AAC] mt-1.5">{workout.durationMin} min · {workout.caloriesBurned ?? 0} kcal burned</p>
                  </div>
                  <Badge label={workout.intensity} color="#C8FF00" />
                  {workout.completed && (
                    <div className="w-8 h-8 rounded-full bg-[#30D158]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#30D158] font-bold">✓</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

      </PageContent>

      <QuickAddModal type={quickAdd} onClose={() => setQuickAdd(null)} />
    </AppLayout>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest">{children}</p>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-6 rounded-full bg-[#C8FF00]" />
      <h2 className="text-base font-bold text-[#D0D0DA] tracking-wide">{title}</h2>
    </div>
  );
}

function StatCard({ accent, label, children }: {
  accent: string; label: string; children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-7 flex flex-col border border-[#2A2A30] bg-[#17171A] hover:border-[#3A3A45] transition-colors">
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.07] -translate-y-1/3 translate-x-1/3"
        style={{ backgroundColor: accent }}
      />
      <span className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest">{label}</span>
      {children}
    </div>
  );
}

function InsightCard({ insight }: { insight: { type: InsightType; title: string; description: string; icon: string } }) {
  const color = insightColors[insight.type];
  return (
    <div
      className="flex gap-5 p-6 rounded-2xl border transition-all hover:-translate-y-1"
      style={{ backgroundColor: `${color}0C`, borderColor: `${color}28` }}
    >
      <span className="text-3xl shrink-0 mt-0.5">{insight.icon}</span>
      <div className="min-w-0">
        <p className="text-base font-bold leading-snug" style={{ color }}>{insight.title}</p>
        <p className="text-sm text-[#9A9AAC] mt-2 leading-relaxed">{insight.description}</p>
      </div>
    </div>
  );
}
