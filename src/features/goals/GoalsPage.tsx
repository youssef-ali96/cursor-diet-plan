import { useState } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Target, Edit3, Save, Dumbbell, Footprints, Flame, Droplets } from 'lucide-react';
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CircularProgress, ProgressBar } from '@/components/ui/Progress';
import { useGoalsStore } from '@/store/goalsStore';
import { useTrackingStore } from '@/store/trackingStore';
import { calcProgress, today } from '@/lib/utils';

export function GoalsPage() {
  const { goals, setGoals } = useGoalsStore();
  const { workouts, dailyMetrics, getCaloriesForDate } = useTrackingStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(goals);

  const todayStr = today();
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const thisWeekWorkouts = workouts.filter(
    (w) => w.completed && w.date >= weekStart && w.date <= weekEnd
  ).length;

  const todayMetrics = dailyMetrics.find((m) => m.date === todayStr);
  const todayCalories = getCaloriesForDate(todayStr);
  const todaySteps = todayMetrics?.steps ?? 0;
  const todayWater = todayMetrics?.waterMl ?? 0;

  const weeklyCardioMin = workouts
    .filter((w) => (w.type === 'cardio' || w.type === 'running' || w.type === 'cycling') && w.date >= weekStart && w.date <= weekEnd)
    .reduce((a, w) => a + w.durationMin, 0);

  const saveGoals = () => {
    setGoals(form);
    setEditing(false);
  };

  const goalItems = [
    {
      id: 'workouts',
      label: 'Weekly Workouts',
      icon: <Dumbbell size={20} />,
      color: '#C8FF00',
      current: thisWeekWorkouts,
      target: goals.workoutsPerWeek,
      unit: 'sessions',
      formKey: 'workoutsPerWeek' as keyof typeof goals,
    },
    {
      id: 'steps',
      label: 'Daily Steps',
      icon: <Footprints size={20} />,
      color: '#0A84FF',
      current: todaySteps,
      target: goals.dailySteps,
      unit: 'steps',
      formKey: 'dailySteps' as keyof typeof goals,
    },
    {
      id: 'calories',
      label: 'Daily Calories',
      icon: <Flame size={20} />,
      color: '#FF9F0A',
      current: todayCalories,
      target: goals.dailyCalories,
      unit: 'kcal',
      formKey: 'dailyCalories' as keyof typeof goals,
    },
    {
      id: 'water',
      label: 'Daily Water',
      icon: <Droplets size={20} />,
      color: '#30D158',
      current: todayWater,
      target: goals.dailyWaterMl,
      unit: 'ml',
      formKey: 'dailyWaterMl' as keyof typeof goals,
    },
    {
      id: 'cardio',
      label: 'Weekly Cardio',
      icon: '🏃',
      color: '#BF5AF2',
      current: weeklyCardioMin,
      target: goals.weeklyCardioMin,
      unit: 'min',
      formKey: 'weeklyCardioMin' as keyof typeof goals,
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Goals"
        subtitle="Set and track your weekly fitness targets"
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => { setForm(goals); setEditing(false); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveGoals} className="gap-1.5">
                <Save size={14} /> Save Goals
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
              <Edit3 size={14} /> Edit Goals
            </Button>
          )
        }
      />

      <div className="p-6 space-y-6">
        {/* Overview rings */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {goalItems.map((item) => {
            const pct = calcProgress(item.current, item.target);
            return (
              <Card key={item.id} className="p-4 flex flex-col items-center text-center gap-2">
                <CircularProgress value={pct} size={72} strokeWidth={5} color={item.color}>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{pct}%</span>
                </CircularProgress>
                <p className="text-[11px] font-semibold text-[#F0F0F5]">{item.label}</p>
                <p className="text-[10px] text-[#7A7A8C]">
                  {typeof item.current === 'number' ? item.current.toLocaleString() : item.current} / {typeof item.target === 'number' ? item.target.toLocaleString() : item.target} {item.unit}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Detail goal cards */}
        <div className="space-y-3">
          {goalItems.map((item) => {
            const pct = calcProgress(item.current, item.target);
            return (
              <Card key={item.id} className="p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {typeof item.icon === 'string' ? item.icon : item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-[#F0F0F5]">{item.label}</p>
                      {pct >= 100 ? (
                        <span className="text-xs font-bold text-[#30D158] bg-[#30D158]/10 px-2 py-0.5 rounded-full">
                          ✓ Complete
                        </span>
                      ) : (
                        <span className="text-xs font-bold" style={{ color: item.color }}>{pct}%</span>
                      )}
                    </div>
                    <ProgressBar value={pct} color={item.color} height={6} animated />
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs text-[#7A7A8C]">
                        {typeof item.current === 'number' ? item.current.toLocaleString() : item.current} {item.unit}
                      </p>
                      {editing ? (
                        <input
                          type="number"
                          value={form[item.formKey] as number}
                          onChange={(e) => setForm((f) => ({ ...f, [item.formKey]: parseInt(e.target.value) || 0 }))}
                          className="w-24 h-7 text-xs text-right bg-[#1E1E23] border border-[#C8FF00]/40 rounded-lg px-2 text-[#C8FF00] outline-none"
                        />
                      ) : (
                        <p className="text-xs font-medium text-[#7A7A8C]">
                          Goal: {typeof item.target === 'number' ? item.target.toLocaleString() : item.target} {item.unit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tips */}
        <Card className="p-5 border-[#C8FF00]/20 bg-[#C8FF00]/5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-[#C8FF00]">Pro Tip</p>
              <p className="text-sm text-[#7A7A8C] mt-1">
                Consistency beats perfection. Meeting 80% of your goals every day is better than being perfect some days and skipping others.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
