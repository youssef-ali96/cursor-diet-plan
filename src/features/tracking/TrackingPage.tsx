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
        <div className="flex items-center justify-between bg-[#17171A] border border-[#2A2A30] rounded-2xl p-4">
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
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Calories', value: `${totalCalories}`, unit: 'kcal', color: '#C8FF00', percent: calPercent },
            { label: 'Steps', value: metrics.steps.toLocaleString(), unit: 'steps', color: '#0A84FF', percent: calcProgress(metrics.steps, metrics.stepsGoal) },
            { label: 'Water', value: formatWater(metrics.waterMl), unit: '', color: '#0A84FF', percent: calcProgress(metrics.waterMl, metrics.waterGoalMl) },
            { label: 'Weight', value: weight ? `${weight.weightKg}` : '--', unit: 'kg', color: '#FF9F0A', percent: 100 },
          ].map(({ label, value, unit, color, percent }) => (
            <Card key={label} className="p-3 text-center">
              <p className="text-[10px] font-semibold text-[#7A7A8C] uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}>
                {value}<span className="text-xs font-normal text-[#7A7A8C] ml-0.5">{unit}</span>
              </p>
              <ProgressBar value={percent} color={color} height={3} className="mt-2" />
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
            <Card key={w.id} className="p-4 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[#0F0F11]"
                style={{ backgroundColor: workoutTypeColors[w.type] + '20' }}
              >
                <Dumbbell size={16} style={{ color: workoutTypeColors[w.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#F0F0F5] truncate">{w.name}</p>
                  {w.completed && <span className="text-[#30D158] text-xs">✓</span>}
                </div>
                <p className="text-xs text-[#7A7A8C]">{w.durationMin} min · {w.caloriesBurned ?? 0} kcal burned</p>
                {w.exercises.length > 0 && (
                  <p className="text-xs text-[#4A4A5A] mt-0.5">{w.exercises.length} exercises</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
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
              <div key={mealType}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[#7A7A8C] uppercase tracking-wider capitalize">{mealType}</p>
                  <p className="text-xs font-bold" style={{ color: '#C8FF00' }}>{typeTotal} kcal</p>
                </div>
                <div className="space-y-2">
                  {typeMeals.map((m) => (
                    <Card key={m.id} className="p-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#F0F0F5]">
                          {m.items.map((i) => i.name).join(', ')}
                        </p>
                        <p className="text-xs text-[#7A7A8C]">{m.totalCalories} kcal · {m.items.reduce((a, i) => a + i.proteinG, 0)}g protein</p>
                      </div>
                      <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0" onClick={() => deleteMeal(m.id)}>
                        <Trash2 size={12} />
                      </Button>
                    </Card>
                  ))}
                </div>
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
            <Card className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF9F0A]/10 flex items-center justify-center">
                  <Scale size={16} className="text-[#FF9F0A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F0F0F5]">Body Weight</p>
                  <p className="text-xs text-[#7A7A8C]">{formatDate(weight.date, 'h:mm a')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#FF9F0A]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {weight.weightKg} kg
                </p>
                {weight.bodyFatPercent && (
                  <p className="text-xs text-[#7A7A8C]">{weight.bodyFatPercent}% body fat</p>
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
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-xs text-[#7A7A8C] mb-2">Steps</p>
              <p className="text-2xl font-black text-[#0A84FF]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {metrics.steps.toLocaleString()}
              </p>
              <ProgressBar
                value={calcProgress(metrics.steps, metrics.stepsGoal)}
                color="#0A84FF"
                height={4}
                className="mt-2"
              />
              <p className="text-xs text-[#4A4A5A] mt-1">Goal: {metrics.stepsGoal.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-[#7A7A8C] mb-2">Water</p>
              <p className="text-2xl font-black text-[#0A84FF]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {formatWater(metrics.waterMl)}
              </p>
              <ProgressBar
                value={calcProgress(metrics.waterMl, metrics.waterGoalMl)}
                color="#30D158"
                height={4}
                className="mt-2"
              />
              <p className="text-xs text-[#4A4A5A] mt-1">Goal: {formatWater(metrics.waterGoalMl)}</p>
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#F0F0F5] uppercase tracking-wider">
          <span className="text-[#7A7A8C]">{icon}</span>
          {title}
        </div>
        <Button variant="ghost" size="sm" onClick={onAdd} className="gap-1 text-[#C8FF00]">
          <Plus size={14} /> Add
        </Button>
      </div>
      {empty ? (
        <div className="flex items-center justify-center p-8 border border-dashed border-[#2A2A30] rounded-2xl">
          <div className="text-center">
            <p className="text-sm text-[#4A4A5A]">{emptyText}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={onAdd}>
              <Plus size={14} /> Add Entry
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}
