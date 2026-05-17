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
        {/* ── Stat cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StreakCard streak={streak.currentStreak} longest={streak.longestStreak} />
          <LevelCard level={userLevel.level} title={userLevel.title} xp={userLevel.xp} xpMax={userLevel.xpToNextLevel} />
          <WeightCard weight={todayWeight?.weightKg} goal={profile?.goalWeightKg} current={profile?.currentWeightKg} />
          <WorkoutCard completed={completedWorkouts} goal={Math.ceil(goals.workoutsPerWeek / 7)} workouts={todayWorkouts} />
        </div>

        {/* ── Calorie ring + metrics + macros ─────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Calorie ring */}
          <Card glow className="p-7 flex flex-col items-center text-center">
            <p className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest w-full text-left mb-6">Calories Today</p>
            <CircularProgress value={calPercent} size={156} strokeWidth={12} color={calPercent > 110 ? '#FF4560' : '#C8FF00'}>
              <div className="text-center">
                <div className="text-4xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {caloriesConsumed.toLocaleString()}
                </div>
                <div className="text-xs text-[#8A8A9C] font-semibold mt-1">of {calGoal.toLocaleString()} kcal</div>
              </div>
            </CircularProgress>
            <div className="w-full mt-6 rounded-2xl bg-[#1E1E23] p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#9A9AAC]">Consumed</span>
                <span className="text-sm font-bold text-[#C8FF00]">{caloriesConsumed.toLocaleString()} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#9A9AAC]">Burned</span>
                <span className="text-sm font-bold text-[#FF4560]">−{caloriesBurned} kcal</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#2A2A30] pt-3">
                <span className="text-sm text-[#9A9AAC]">Net remaining</span>
                <span className="text-sm font-bold text-[#F0F0F5]">{Math.max(0, calGoal - caloriesConsumed + caloriesBurned).toLocaleString()} kcal</span>
              </div>
            </div>
          </Card>

          {/* Steps + Water */}
          <div className="space-y-5">
            <MetricCard
              icon={<Footprints size={20} />}
              label="Steps"
              value={formatSteps(todayMetrics.steps)}
              goal={formatSteps(todayMetrics.stepsGoal)}
              percent={stepPercent}
              color="#0A84FF"
              onAdd={() => setQuickAdd('steps')}
            />
            <MetricCard
              icon={<Droplets size={20} />}
              label="Water"
              value={formatWater(todayMetrics.waterMl)}
              goal={formatWater(todayMetrics.waterGoalMl)}
              percent={waterPercent}
              color="#30D158"
              onAdd={() => setQuickAdd('water')}
            />
          </div>

          {/* Macros */}
          <Card className="p-7">
            <p className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest mb-6">Macro Targets</p>
            <div className="space-y-5">
              {[
                { label: 'Protein', target: Math.round(profile ? profile.currentWeightKg * 2 : 160), color: '#FF4560', unit: 'g' },
                { label: 'Carbs', target: Math.round((calGoal * 0.45) / 4), color: '#C8FF00', unit: 'g' },
                { label: 'Fat', target: Math.round((calGoal * 0.25) / 9), color: '#FF9F0A', unit: 'g' },
              ].map(({ label, target, color, unit }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-[#B0B0BC] font-medium">{label}</span>
                    <span className="font-bold tabular-nums" style={{ color }}>0 / {target}{unit}</span>
                  </div>
                  <ProgressBar value={0} color={color} height={7} />
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-6" onClick={() => setQuickAdd('meal')}>
              <Plus size={14} /> Log Meal
            </Button>
          </Card>
        </div>

        {/* ── Quick actions ──────────────────────────────────── */}
        <div>
          <SectionHeader title="Quick Add" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {[
              { label: 'Log Workout', icon: '💪', action: () => setQuickAdd('workout') },
              { label: 'Log Meal', icon: '🥗', action: () => setQuickAdd('meal') },
              { label: 'Log Weight', icon: '⚖️', action: () => setQuickAdd('weight') },
              { label: 'Log Steps', icon: '👟', action: () => setQuickAdd('steps') },
            ].map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-4 p-5 rounded-2xl border border-[#2A2A30] bg-[#17171A] hover:bg-[#1E1E23] hover:border-[#3A3A45] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-left group"
              >
                <span className="text-3xl leading-none">{icon}</span>
                <span className="text-sm font-semibold text-[#9A9AAC] group-hover:text-[#F0F0F5] transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Insights ───────────────────────────────────────── */}
        {insights.length > 0 && (
          <div>
            <SectionHeader title="Today's Insights" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {insights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* ── Today's workouts ───────────────────────────────── */}
        {todayWorkouts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader title="Today's Workouts" />
              <Button variant="ghost" size="sm" className="gap-1">View All <ChevronRight size={14} /></Button>
            </div>
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <Card key={workout.id} hover className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center shrink-0">
                    <Dumbbell size={20} className="text-[#C8FF00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-[#F0F0F5] truncate">{workout.name}</p>
                    <p className="text-sm text-[#9A9AAC] mt-1">{workout.durationMin} min · {workout.caloriesBurned ?? 0} kcal burned</p>
                  </div>
                  <Badge label={workout.intensity} color="#C8FF00" />
                  {workout.completed && (
                    <div className="w-7 h-7 rounded-full bg-[#30D158]/20 flex items-center justify-center shrink-0">
                      <span className="text-[#30D158] text-sm font-bold">✓</span>
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
    <h2 className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest">{title}</h2>
  );
}

function StatCard({ accent, label, children }: {
  accent: string; label: string; children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3 border border-[#2A2A30] bg-[#17171A] hover:border-[#3A3A45] transition-colors">
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] -translate-y-1/3 translate-x-1/3"
        style={{ backgroundColor: accent }}
      />
      <span className="text-xs font-bold text-[#8A8A9C] uppercase tracking-widest">{label}</span>
      {children}
    </div>
  );
}

function StreakCard({ streak, longest }: { streak: number; longest: number }) {
  return (
    <StatCard accent="#FF9F0A" label="Streak">
      <div className="flex items-end gap-2 mt-1">
        <span className="text-5xl font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#FF9F0A' }}>
          {streak}
        </span>
        <span className="text-2xl leading-none mb-1">🔥</span>
      </div>
      <p className="text-sm text-[#8A8A9C]">Best: {longest} days</p>
    </StatCard>
  );
}

function LevelCard({ level, title, xp, xpMax }: { level: number; title: string; xp: number; xpMax: number }) {
  return (
    <StatCard accent="#C8FF00" label="Level">
      <div className="flex items-end gap-2 mt-1">
        <span className="text-5xl font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#C8FF00' }}>
          {level}
        </span>
        <span className="text-sm font-semibold text-[#9A9AAC] mb-1">{title}</span>
      </div>
      <ProgressBar value={Math.round((xp / xpMax) * 100)} height={4} />
      <p className="text-sm text-[#8A8A9C] tabular-nums">{xp} / {xpMax} XP</p>
    </StatCard>
  );
}

function WeightCard({ weight, goal, current }: { weight?: number; goal?: number; current?: number }) {
  const diff = current && goal ? current - goal : 0;
  return (
    <StatCard accent="#F0F0F5" label="Weight">
      <div className="flex items-end gap-1.5 mt-1">
        <span className="text-5xl font-black leading-none text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {weight ? weight.toFixed(1) : current?.toFixed(1) ?? '--'}
        </span>
        <span className="text-sm text-[#8A8A9C] mb-1">kg</span>
      </div>
      {diff !== 0 && (
        <div className="flex items-center gap-1.5 text-sm mt-1">
          <TrendingDown size={13} style={{ color: diff > 0 ? '#30D158' : '#FF4560' }} />
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
      <div className="flex items-end gap-1.5 mt-1">
        <span className="text-5xl font-black leading-none text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {done}
        </span>
        <span className="text-sm text-[#8A8A9C] mb-1">today</span>
      </div>
      <p className="text-sm text-[#8A8A9C]">
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
    <div className="flex items-center gap-5 p-5 rounded-2xl bg-[#17171A] border border-[#2A2A30] hover:border-[#3A3A45] transition-colors">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18`, color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-semibold text-[#B0B0BC]">{label}</span>
          <span className="text-sm font-bold tabular-nums" style={{ color }}>{value} / {goal}</span>
        </div>
        <ProgressBar value={percent} color={color} height={6} />
      </div>
      <button
        onClick={onAdd}
        className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[#7A7A8C] hover:text-[#F0F0F5] hover:bg-[#2A2A30] transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function InsightCard({ insight }: { insight: { type: InsightType; title: string; description: string; icon: string } }) {
  const color = insightColors[insight.type];
  return (
    <div
      className="flex gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-0.5"
      style={{ backgroundColor: `${color}0A`, borderColor: `${color}25` }}
    >
      <span className="text-2xl shrink-0 mt-0.5">{insight.icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-snug" style={{ color }}>{insight.title}</p>
        <p className="text-sm text-[#9A9AAC] mt-1.5 leading-relaxed">{insight.description}</p>
      </div>
    </div>
  );
}
