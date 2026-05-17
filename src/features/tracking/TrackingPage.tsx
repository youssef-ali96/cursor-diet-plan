import { useState } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Dumbbell, UtensilsCrossed, Scale, Footprints, Trash2 } from 'lucide-react';
import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, intensityColors, workoutTypeColors } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { QuickAddModal } from '@/features/dashboard/QuickAddModal';
import { calcProgress, formatDate, formatWater } from '@/lib/utils';

type QuickType = 'workout' | 'meal' | 'weight' | 'steps' | 'water' | null;

export function TrackingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quickAdd, setQuickAdd] = useState<QuickType>(null);
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { getWorkoutsForDate, getMealsForDate, getWeightForDate, getDailyMetrics, deleteWorkout, deleteMeal } = useTrackingStore();
  const { goals } = useGoalsStore();

  const workouts = getWorkoutsForDate(dateStr);
  const meals = getMealsForDate(dateStr);
  const weight = getWeightForDate(dateStr);
  const metrics = getDailyMetrics(dateStr);

  const totalCalories = meals.reduce((a, m) => a + m.totalCalories, 0);
  const calPercent = calcProgress(totalCalories, goals.dailyCalories);

  const navDate = (dir: number) => {
    setSelectedDate((d) => dir > 0 ? addDays(d, 1) : subDays(d, 1));
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <AppLayout>
      <PageHeader
        title="Daily Log"
        subtitle="Track every rep, meal & metric"
        actions={
          <Button size="sm" onClick={() => setQuickAdd('meal')} className="gap-1.5">
            <Plus size={14} /> Add
          </Button>
        }
      />

      <PageContent>
        {/* Date navigator */}
        <div className="flex items-center justify-between bg-[#17171A] border border-[#2A2A30] rounded-2xl p-7">
          <Button variant="ghost" size="icon" onClick={() => navDate(-1)}>
            <ChevronLeft size={18} />
          </Button>
          <div className="text-center">
            <p className="text-base font-bold text-[#F0F0F5]">
              {isToday ? 'Today' : formatDate(selectedDate, 'EEEE')}
            </p>
            <p className="text-sm text-[#7A7A8C]">{formatDate(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navDate(1)} disabled={isToday}>
            <ChevronRight size={18} />
          </Button>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'Calories', value: `${totalCalories}`, unit: 'kcal', color: '#C8FF00', percent: calPercent },
            { label: 'Steps', value: metrics.steps.toLocaleString(), unit: 'steps', color: '#0A84FF', percent: calcProgress(metrics.steps, metrics.stepsGoal) },
            { label: 'Water', value: formatWater(metrics.waterMl), unit: '', color: '#0A84FF', percent: calcProgress(metrics.waterMl, metrics.waterGoalMl) },
            { label: 'Weight', value: weight ? `${weight.weightKg}` : '--', unit: 'kg', color: '#FF9F0A', percent: 100 },
          ].map(({ label, value, unit, color, percent }) => (
            <Card key={label} className="p-8 text-center">
              <p className="text-sm font-bold text-[#8A8A9C] uppercase tracking-widest mb-5">{label}</p>
              <p className="text-3xl font-black leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}>
                {value}
              </p>
              {unit && <p className="text-sm text-[#9A9AAC] mt-6">{unit}</p>}
              <ProgressBar value={percent} color={color} height={8} className="mt-6" />
            </Card>
          ))}
        </div>

        {/* Workouts */}
        <Section
          title="Workouts"
          icon={<Dumbbell size={16} />}
          onAdd={() => setQuickAdd('workout')}
          empty={workouts.length === 0}
          emptyText="No workouts logged for this day"
        >
          {workouts.map((w) => (
            <Card key={w.id} className="p-8 flex items-center gap-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-[#0F0F11]"
                style={{ backgroundColor: workoutTypeColors[w.type] + '20' }}
              >
                <Dumbbell size={16} style={{ color: workoutTypeColors[w.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-5">
                  <p className="text-base font-semibold text-[#F0F0F5] truncate">{w.name}</p>
                  {w.completed && <span className="text-[#30D158] text-sm">✓</span>}
                </div>
                <p className="text-sm text-[#9A9AAC] mt-0.5">{w.durationMin} min · {w.caloriesBurned ?? 0} kcal burned</p>
                {w.exercises.length > 0 && (
                  <p className="text-sm text-[#9A9AAC] mt-0.5">{w.exercises.length} exercises</p>
                )}
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <Badge label={w.intensity} color={intensityColors[w.intensity]} variant="subtle" />
                <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => deleteWorkout(w.id)}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </Card>
          ))}
        </Section>

        {/* Meals */}
        <Section
          title="Nutrition"
          icon={<UtensilsCrossed size={16} />}
          onAdd={() => setQuickAdd('meal')}
          empty={meals.length === 0}
          emptyText="No meals logged for this day"
        >
          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
            const typeMeals = meals.filter((m) => m.type === mealType);
            if (typeMeals.length === 0) return null;
            const typeTotal = typeMeals.reduce((a, m) => a + m.totalCalories, 0);
            return (
              <div key={mealType} className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-bold text-[#9A9AAC] uppercase tracking-widest capitalize">{mealType}</p>
                  <p className="text-sm font-bold text-[#C8FF00]">{typeTotal} kcal</p>
                </div>
                {typeMeals.map((m) => (
                  <Card key={m.id} className="p-8 flex items-center gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-[#F0F0F5]">
                        {m.items.map((i) => i.name).join(', ')}
                      </p>
                      <p className="text-sm text-[#9A9AAC] mt-6">{m.totalCalories} kcal · {m.items.reduce((a, i) => a + i.proteinG, 0)}g protein</p>
                    </div>
                    <Button variant="ghost" size="icon" className="w-14 h-14 shrink-0" onClick={() => deleteMeal(m.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </Card>
                ))}
              </div>
            );
          })}
        </Section>

        {/* Body metrics */}
        <Section
          title="Body Metrics"
          icon={<Scale size={16} />}
          onAdd={() => setQuickAdd('weight')}
          empty={!weight}
          emptyText="No weight entry for this day"
        >
          {weight && (
            <Card className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FF9F0A]/10 flex items-center justify-center">
                  <Scale size={16} className="text-[#FF9F0A]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#F0F0F5]">Body Weight</p>
                  <p className="text-sm text-[#9A9AAC]">{formatDate(weight.date, 'h:mm a')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#FF9F0A]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {weight.weightKg} kg
                </p>
                {weight.bodyFatPercent && (
                  <p className="text-sm text-[#9A9AAC]">{weight.bodyFatPercent}% body fat</p>
                )}
              </div>
            </Card>
          )}
        </Section>

        {/* Steps & Water */}
        <Section
          title="Activity"
          icon={<Footprints size={16} />}
          onAdd={() => setQuickAdd('steps')}
          empty={false}
        >
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-7">
              <p className="text-sm font-bold text-[#8A8A9C] uppercase tracking-widest mb-5">Steps</p>
              <p className="text-3xl font-black text-[#0A84FF]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {metrics.steps.toLocaleString()}
              </p>
              <ProgressBar
                value={calcProgress(metrics.steps, metrics.stepsGoal)}
                color="#0A84FF"
                height={8}
                className="mt-6"
              />
              <p className="text-sm text-[#9A9AAC] mt-6">Goal: {metrics.stepsGoal.toLocaleString()}</p>
            </Card>
            <Card className="p-7">
              <p className="text-sm font-bold text-[#8A8A9C] uppercase tracking-widest mb-5">Water</p>
              <p className="text-3xl font-black text-[#30D158]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {formatWater(metrics.waterMl)}
              </p>
              <ProgressBar
                value={calcProgress(metrics.waterMl, metrics.waterGoalMl)}
                color="#30D158"
                height={8}
                className="mt-6"
              />
              <p className="text-sm text-[#9A9AAC] mt-6">Goal: {formatWater(metrics.waterGoalMl)}</p>
            </Card>
          </div>
        </Section>
      </PageContent>

      <QuickAddModal type={quickAdd} onClose={() => setQuickAdd(null)} />
    </AppLayout>
  );
}

function Section({
  title, icon, onAdd, children, empty, emptyText,
}: {
  title: string; icon: React.ReactNode; onAdd: () => void;
  children: React.ReactNode; empty: boolean; emptyText?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-5">
          <div className="w-1 h-7 rounded-full bg-[#C8FF00]" />
          <div className="w-14 h-14 rounded-xl bg-[#C8FF00]/10 flex items-center justify-center text-[#C8FF00]">
            {icon}
          </div>
          <span className="text-base font-bold text-[#E0E0EA]">{title}</span>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-sm font-bold text-[#C8FF00] px-7 py-5 rounded-xl bg-[#C8FF00]/10 hover:bg-[#C8FF00]/20 transition-colors"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {empty ? (
        <div className="flex items-center justify-center py-14 border-2 border-dashed border-[#2A2A30] rounded-2xl">
          <div className="text-center px-6">
            <p className="text-base text-[#9A9AAC] mb-4">{emptyText}</p>
            <Button variant="outline" onClick={onAdd} className="gap-5">
              <Plus size={15} /> Add Entry
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">{children}</div>
      )}
    </div>
  );
}
