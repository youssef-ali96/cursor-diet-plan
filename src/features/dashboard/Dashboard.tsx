import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Flame, Footprints, Droplets, Scale, Dumbbell, TrendingDown, ChevronRight, Target } from 'lucide-react';
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';
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

      <div className="p-6 space-y-6">
        {/* Hero streak + level */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StreakCard streak={streak.currentStreak} longest={streak.longestStreak} />
          <LevelCard level={userLevel.level} title={userLevel.title} xp={userLevel.xp} xpMax={userLevel.xpToNextLevel} />
          <WeightCard weight={todayWeight?.weightKg} goal={profile?.goalWeightKg} current={profile?.currentWeightKg} />
          <WorkoutCard completed={completedWorkouts} goal={Math.ceil(goals.workoutsPerWeek / 7)} workouts={todayWorkouts} />
        </div>

        {/* Main calorie ring */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card glow className="lg:col-span-1 p-6 flex flex-col items-center text-center">
            <CardTitle className="mb-4">Calories Today</CardTitle>
            <CircularProgress value={calPercent} size={140} strokeWidth={10} color={calPercent > 110 ? '#FF4560' : '#C8FF00'}>
              <div className="text-center">
                <div className="text-2xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {caloriesConsumed.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#7A7A8C] font-medium">of {calGoal.toLocaleString()}</div>
              </div>
            </CircularProgress>
            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#7A7A8C]">Consumed</span>
                <span className="font-semibold text-[#C8FF00]">{caloriesConsumed} kcal</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#7A7A8C]">Burned</span>
                <span className="font-semibold text-[#FF4560]">-{caloriesBurned} kcal</span>
              </div>
              <div className="flex justify-between text-xs border-t border-[#2A2A30] pt-2">
                <span className="text-[#7A7A8C]">Net</span>
                <span className="font-bold text-[#F0F0F5]">{caloriesConsumed - caloriesBurned} kcal</span>
              </div>
            </div>
          </Card>

          {/* Steps + Water stacked */}
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
              color="#0A84FF"
              onAdd={() => setQuickAdd('water')}
            />
          </div>

          {/* Macro breakdown */}
          <Card className="p-5">
            <CardTitle className="mb-4">Macro Targets</CardTitle>
            <div className="space-y-4">
              {[
                { label: 'Protein', target: Math.round(profile ? profile.currentWeightKg * 2 : 160), color: '#FF4560', unit: 'g' },
                { label: 'Carbs', target: Math.round((calGoal * 0.45) / 4), color: '#C8FF00', unit: 'g' },
                { label: 'Fat', target: Math.round((calGoal * 0.25) / 9), color: '#FF9F0A', unit: 'g' },
              ].map(({ label, target, color, unit }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#7A7A8C] font-medium">{label}</span>
                    <span className="font-semibold" style={{ color }}>0 / {target}{unit}</span>
                  </div>
                  <ProgressBar value={0} color={color} height={5} />
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-4"
              onClick={() => setQuickAdd('meal')}
            >
              <Plus size={14} /> Log Meal
            </Button>
          </Card>
        </div>

        {/* Quick actions row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Log Workout', icon: '💪', action: () => setQuickAdd('workout'), color: '#C8FF00' },
            { label: 'Log Meal', icon: '🥗', action: () => setQuickAdd('meal'), color: '#30D158' },
            { label: 'Log Weight', icon: '⚖️', action: () => setQuickAdd('weight'), color: '#FF9F0A' },
            { label: 'Log Steps', icon: '👟', action: () => setQuickAdd('steps'), color: '#0A84FF' },
          ].map(({ label, icon, action, color }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center gap-3 p-4 rounded-2xl border border-[#2A2A30] bg-[#17171A] hover:border-[#3A3A45] hover:-translate-y-0.5 transition-all text-left group"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-semibold text-[#7A7A8C] group-hover:text-[#F0F0F5] transition-colors">{label}</span>
            </button>
          ))}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#F0F0F5] uppercase tracking-wider">Today's Insights</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {insights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Today's workouts */}
        {todayWorkouts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#F0F0F5] uppercase tracking-wider">Today's Workouts</h2>
              <Button variant="ghost" size="sm" className="gap-1">View All <ChevronRight size={14} /></Button>
            </div>
            <div className="space-y-2">
              {todayWorkouts.map((workout) => (
                <Card key={workout.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center shrink-0">
                    <Dumbbell size={18} className="text-[#C8FF00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F0F0F5] truncate">{workout.name}</p>
                    <p className="text-xs text-[#7A7A8C]">{workout.durationMin} min · {workout.caloriesBurned ?? 0} kcal</p>
                  </div>
                  <Badge label={workout.intensity} color="#C8FF00" />
                  {workout.completed && (
                    <div className="w-6 h-6 rounded-full bg-[#30D158]/20 flex items-center justify-center">
                      <span className="text-[#30D158] text-xs">✓</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuickAddModal
        type={quickAdd}
        onClose={() => setQuickAdd(null)}
      />
    </AppLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StreakCard({ streak, longest }: { streak: number; longest: number }) {
  return (
    <Card className="p-5 flex flex-col gap-2" glow>
      <CardTitle>Streak</CardTitle>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-[#FF9F0A]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {streak}
        </span>
        <span className="text-2xl mb-0.5">🔥</span>
      </div>
      <p className="text-xs text-[#7A7A8C]">Best: {longest} days</p>
    </Card>
  );
}

function LevelCard({ level, title, xp, xpMax }: { level: number; title: string; xp: number; xpMax: number }) {
  return (
    <Card className="p-5 flex flex-col gap-2">
      <CardTitle>Level</CardTitle>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {level}
        </span>
        <span className="text-sm font-semibold text-[#7A7A8C] mb-1">{title}</span>
      </div>
      <ProgressBar value={Math.round((xp / xpMax) * 100)} height={4} />
      <p className="text-xs text-[#7A7A8C]">{xp} / {xpMax} XP</p>
    </Card>
  );
}

function WeightCard({ weight, goal, current }: { weight?: number; goal?: number; current?: number }) {
  const diff = current && goal ? current - goal : 0;
  return (
    <Card className="p-5 flex flex-col gap-2">
      <CardTitle>Weight</CardTitle>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-[#F0F0F5]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {weight ? weight.toFixed(1) : current?.toFixed(1) ?? '--'}
        </span>
        <span className="text-sm text-[#7A7A8C] mb-1">kg</span>
      </div>
      {diff !== 0 && (
        <div className="flex items-center gap-1 text-xs">
          <TrendingDown size={12} className={diff > 0 ? 'text-[#30D158]' : 'text-[#FF4560]'} />
          <span className={diff > 0 ? 'text-[#30D158]' : 'text-[#FF4560]'}>
            {diff > 0 ? `-${diff.toFixed(1)}` : `+${Math.abs(diff).toFixed(1)}`} to goal
          </span>
        </div>
      )}
    </Card>
  );
}

function WorkoutCard({ completed, goal, workouts }: { completed: number; goal: number; workouts: { completed: boolean }[] }) {
  const done = workouts.filter((w) => w.completed).length;
  return (
    <Card className="p-5 flex flex-col gap-2">
      <CardTitle>Workout</CardTitle>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-[#C8FF00]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {done}
        </span>
        <span className="text-sm text-[#7A7A8C] mb-1">today</span>
      </div>
      <p className="text-xs text-[#7A7A8C]">
        {done > 0 ? '✅ Session logged' : 'No workout yet'}
      </p>
    </Card>
  );
}

function MetricCard({ icon, label, value, goal, percent, color, onAdd }: {
  icon: React.ReactNode; label: string; value: string; goal: string;
  percent: number; color: string; onAdd: () => void;
}) {
  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-[#7A7A8C]">{label}</span>
          <span className="text-xs font-semibold" style={{ color }}>{value} / {goal}</span>
        </div>
        <ProgressBar value={percent} color={color} height={5} />
      </div>
      <Button variant="ghost" size="icon" onClick={onAdd} className="shrink-0 w-8 h-8">
        <Plus size={14} />
      </Button>
    </Card>
  );
}

function InsightCard({ insight }: { insight: { type: InsightType; title: string; description: string; icon: string } }) {
  const color = insightColors[insight.type];
  return (
    <div
      className="flex gap-3 p-4 rounded-xl border transition-all hover:border-opacity-50"
      style={{ backgroundColor: `${color}08`, borderColor: `${color}25` }}
    >
      <span className="text-xl shrink-0">{insight.icon}</span>
      <div>
        <p className="text-sm font-semibold" style={{ color }}>{insight.title}</p>
        <p className="text-xs text-[#7A7A8C] mt-0.5 leading-relaxed">{insight.description}</p>
      </div>
    </div>
  );
}
