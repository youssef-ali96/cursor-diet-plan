import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Flame, Footprints, Droplets, Scale, Dumbbell, TrendingDown, ChevronRight, Target } from 'lucide-react';
import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularProgress, ProgressBar } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { useUserStore } from '@/store/userStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { useTodayStats } from '@/hooks/useAppData';
import { useInsights } from '@/hooks/useInsights';
import { calcProgress, formatWeight, formatSteps, formatWater, today } from '@/lib/utils';
import { QuickAddModal } from './QuickAddModal';
import { insightColors } from '@/components/ui/Badge';
import type { InsightType } from '@/types';

export function Dashboard() {
  const { profile } = useUserStore();
  const { streak, updateDailyMetrics } = useTrackingStore();
  const { userLevel } = useGoalsStore();
  const { todayWorkouts, todayMetrics, todayWeight, caloriesConsumed, caloriesBurned, goals } = useTodayStats();
  const insights = useInsights();
  const [quickAdd, setQuickAdd] = useState<'workout' | 'meal' | 'weight' | 'steps' | 'water' | null>(null);

  const todayStr = today();
  const calGoal = goals.dailyCalories;
  const calPercent = calcProgress(caloriesConsumed, calGoal);
  const stepPercent = calcProgress(todayMetrics.steps, todayMetrics.stepsGoal);
  const waterPercent = calcProgress(todayMetrics.waterMl, todayMetrics.waterGoalMl);

  const completedWorkouts = todayWorkouts.filter((w) => w.completed).length;
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
          <Button
            size="sm"
            onClick={() => setQuickAdd('meal')}
            className="gap-1.5"
          >
            <Plus size={14} /> Quick Add
          </Button>
        }
      />

      <PageContent>
        {/* Stat cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StreakCard streak={streak.currentStreak} longest={streak.longestStreak} />
          <LevelCard level={userLevel.level} title={userLevel.title} xp={userLevel.xp} xpMax={userLevel.xpToNextLevel} />
          <WeightCard weight={todayWeight?.weightKg} goal={profile?.goalWeightKg} current={profile?.currentWeightKg} />
          <WorkoutCard completed={completedWorkouts} goal={Math.ceil(goals.workoutsPerWeek / 7)} workouts={todayWorkouts} />
        </div>

        {/* Calorie ring + metrics + macros */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Calorie ring */}
          <Card glow className="lg:col-span-1 p-6 flex flex-col items-center text-center">
            <CardTitle className="mb-5 w-full text-left">Calories Today</CardTitle>
            <CircularProgress value={calPercent} size={148} strokeWidth={11} color={calPercent > 110 ? '#FF4560' : '#C8FF00'}>
              <div className="text-center">
                <div className="text-3xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {caloriesConsumed.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#7A7A8C] font-semibold uppercase tracking-wide">of {calGoal.toLocaleString()}</div>
              </div>
            </CircularProgress>
            <div className="w-full mt-5 rounded-xl bg-[#1E1E23] p-3 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#7A7A8C]">Consumed</span>
                <span className="font-bold text-[#C8FF00]">{caloriesConsumed.toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#7A7A8C]">Burned</span>
                <span className="font-bold text-[#FF4560]">−{caloriesBurned} kcal</span>
              </div>
              <div className="flex justify-between text-xs border-t border-[#2A2A30] pt-2">
                <span className="text-[#7A7A8C]">Net remaining</span>
                <span className="font-bold text-[#F0F0F5]">{Math.max(0, calGoal - caloriesConsumed + caloriesBurned).toLocaleString()} kcal</span>
              </div>
            </div>
          </Card>

          {/* Steps + Water */}
          <div className="space-y-4">
            <MetricCard
              icon={<Footprints size={18} />}
              label="Steps"
              value={formatSteps(todayMetrics.steps)}
              goal={formatSteps(todayMetrics.stepsGoal)}
              percent={stepPercent}
              color="#0A84FF"
              onAdd={() => setQuickAdd('steps')}
            />
            <MetricCard
              icon={<Droplets size={18} />}
              label="Water"
              value={formatWater(todayMetrics.waterMl)}
              goal={formatWater(todayMetrics.waterGoalMl)}
              percent={waterPercent}
              color="#30D158"
              onAdd={() => setQuickAdd('water')}
            />
          </div>

          {/* Macros */}
          <Card className="p-5">
            <CardTitle className="mb-5">Macro Targets</CardTitle>
            <div className="space-y-4">
              {[
                { label: 'Protein', target: Math.round(profile ? profile.currentWeightKg * 2 : 160), color: '#FF4560', unit: 'g' },
                { label: 'Carbs', target: Math.round((calGoal * 0.45) / 4), color: '#C8FF00', unit: 'g' },
                { label: 'Fat', target: Math.round((calGoal * 0.25) / 9), color: '#FF9F0A', unit: 'g' },
              ].map(({ label, target, color, unit }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#7A7A8C] font-medium">{label}</span>
                    <span className="font-semibold tabular-nums" style={{ color }}>0 / {target}{unit}</span>
                  </div>
                  <ProgressBar value={0} color={color} height={6} />
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-5" onClick={() => setQuickAdd('meal')}>
              <Plus size={14} /> Log Meal
            </Button>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <SectionHeader title="Quick Add" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {[
              { label: 'Log Workout', icon: '💪', action: () => setQuickAdd('workout'), color: '#C8FF00' },
              { label: 'Log Meal', icon: '🥗', action: () => setQuickAdd('meal'), color: '#30D158' },
              { label: 'Log Weight', icon: '⚖️', action: () => setQuickAdd('weight'), color: '#FF9F0A' },
              { label: 'Log Steps', icon: '👟', action: () => setQuickAdd('steps'), color: '#0A84FF' },
            ].map(({ label, icon, action, color }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-3 p-4 rounded-2xl border border-[#2A2A30] bg-[#17171A] hover:bg-[#1E1E23] hover:border-[#3A3A45] hover:-translate-y-0.5 active:scale-95 transition-all text-left group"
              >
                <span className="text-2xl leading-none">{icon}</span>
                <span className="text-sm font-semibold text-[#7A7A8C] group-hover:text-[#F0F0F5] transition-colors leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div>
            <SectionHeader title="Today's Insights" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {insights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Today's workouts */}
        {todayWorkouts.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <SectionHeader title="Today's Workouts" />
              <Button variant="ghost" size="sm" className="gap-1 -mt-1">View All <ChevronRight size={14} /></Button>
            </div>
            <div className="space-y-2 mt-3">
              {todayWorkouts.map((workout) => (
                <Card key={workout.id} hover className="p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center shrink-0">
                    <Dumbbell size={18} className="text-[#C8FF00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F0F0F5] truncate">{workout.name}</p>
                    <p className="text-xs text-[#7A7A8C] mt-0.5">{workout.durationMin} min · {workout.caloriesBurned ?? 0} kcal burned</p>
                  </div>
                  <Badge label={workout.intensity} color="#C8FF00" />
                  {workout.completed && (
                    <div className="w-6 h-6 rounded-full bg-[#30D158]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#30D158] text-xs font-bold">✓</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </PageContent>

      <QuickAddModal
        type={quickAdd}
        onClose={() => setQuickAdd(null)}
      />
    </AppLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-bold text-[#4A4A5A] uppercase tracking-[0.12em]">{title}</h2>
  );
}

function StatCard({ accent, label, children, badge }: {
  accent: string; label: string; children: React.ReactNode; badge?: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-2 border border-[#2A2A30] bg-[#17171A] hover:border-[#3A3A45] transition-colors"
    >
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.06] -translate-y-1/3 translate-x-1/3"
        style={{ backgroundColor: accent }} />
      <span className="text-[11px] font-bold text-[#4A4A5A] uppercase tracking-widest">{label}</span>
      {children}
      {badge && <div className="mt-auto">{badge}</div>}
    </div>
  );
}

function StreakCard({ streak, longest }: { streak: number; longest: number }) {
  return (
    <StatCard accent="#FF9F0A" label="Streak">
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#FF9F0A' }}>
          {streak}
        </span>
        <span className="text-2xl leading-none mb-1">🔥</span>
      </div>
      <p className="text-xs text-[#4A4A5A]">Best: {longest} days</p>
    </StatCard>
  );
}

function LevelCard({ level, title, xp, xpMax }: { level: number; title: string; xp: number; xpMax: number }) {
  return (
    <StatCard accent="#C8FF00" label="Level">
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#C8FF00' }}>
          {level}
        </span>
        <span className="text-sm font-semibold text-[#7A7A8C] mb-1">{title}</span>
      </div>
      <ProgressBar value={Math.round((xp / xpMax) * 100)} height={3} />
      <p className="text-xs text-[#4A4A5A] tabular-nums">{xp} / {xpMax} XP</p>
    </StatCard>
  );
}

function WeightCard({ weight, goal, current }: { weight?: number; goal?: number; current?: number }) {
  const diff = current && goal ? current - goal : 0;
  return (
    <StatCard accent="#F0F0F5" label="Weight">
      <div className="flex items-end gap-1.5">
        <span className="text-5xl font-black leading-none text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {weight ? weight.toFixed(1) : current?.toFixed(1) ?? '--'}
        </span>
        <span className="text-sm text-[#4A4A5A] mb-1">kg</span>
      </div>
      {diff !== 0 && (
        <div className="flex items-center gap-1 text-xs mt-1">
          <TrendingDown size={11} style={{ color: diff > 0 ? '#30D158' : '#FF4560' }} />
          <span style={{ color: diff > 0 ? '#30D158' : '#FF4560' }}>
            {diff > 0 ? `−${diff.toFixed(1)}` : `+${Math.abs(diff).toFixed(1)}`} to goal
          </span>
        </div>
      )}
    </StatCard>
  );
}

function WorkoutCard({ completed, goal, workouts }: { completed: number; goal: number; workouts: { completed: boolean }[] }) {
  const done = workouts.filter((w) => w.completed).length;
  return (
    <StatCard accent="#C8FF00" label="Workout">
      <div className="flex items-end gap-1.5">
        <span className="text-5xl font-black leading-none text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {done}
        </span>
        <span className="text-sm text-[#4A4A5A] mb-1">today</span>
      </div>
      <p className="text-xs text-[#4A4A5A] mt-1">
        {done > 0 ? '✅ Session logged' : '— No workout yet'}
      </p>
    </StatCard>
  );
}

function MetricCard({ icon, label, value, goal, percent, color, onAdd }: {
  icon: React.ReactNode; label: string; value: string; goal: string;
  percent: number; color: string; onAdd: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#17171A] border border-[#2A2A30] hover:border-[#3A3A45] transition-colors">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18`, color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#7A7A8C]">{label}</span>
          <span className="text-xs font-bold tabular-nums" style={{ color }}>{value} / {goal}</span>
        </div>
        <ProgressBar value={percent} color={color} height={5} />
      </div>
      <button
        onClick={onAdd}
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#4A4A5A] hover:text-[#F0F0F5] hover:bg-[#2A2A30] transition-colors"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function InsightCard({ insight }: { insight: { type: InsightType; title: string; description: string; icon: string } }) {
  const color = insightColors[insight.type];
  return (
    <div
      className="flex gap-3 p-4 rounded-2xl border transition-all hover:-translate-y-0.5"
      style={{ backgroundColor: `${color}0A`, borderColor: `${color}22` }}
    >
      <span className="text-xl shrink-0 mt-0.5">{insight.icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-tight" style={{ color }}>{insight.title}</p>
        <p className="text-xs text-[#7A7A8C] mt-1 leading-relaxed">{insight.description}</p>
      </div>
    </div>
  );
}
