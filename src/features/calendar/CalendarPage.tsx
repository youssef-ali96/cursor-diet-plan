import { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isToday, parseISO, isSameDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Dumbbell, Utensils, Scale } from 'lucide-react';
import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useTrackingStore } from '@/store/trackingStore';
import { cn } from '@/lib/utils';

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { workouts, meals, weights } = useTrackingStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayWorkouts = workouts.filter((w) => w.date === dateStr);
    const dayMeals = meals.filter((m) => m.date === dateStr);
    const dayWeight = weights.find((w) => w.date === dateStr);
    return { workouts: dayWorkouts, meals: dayMeals, weight: dayWeight };
  };

  const navMonth = (dir: number) => {
    setCurrentMonth((d) => {
      const m = new Date(d);
      m.setMonth(m.getMonth() + dir);
      return m;
    });
  };

  const selectedDayData = selectedDay ? getDayData(selectedDay) : null;

  return (
    <AppLayout>
      <PageHeader title="Calendar" subtitle="Your fitness history at a glance" />

      <PageContent>
        {/* Month nav */}
        <div className="flex items-center justify-between">
          <h2
            className="text-2xl font-black text-[#F0F0F5] uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="icon" onClick={() => navMonth(-1)}>
              <ChevronLeft size={18} />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
            <Button variant="secondary" size="icon" onClick={() => navMonth(1)}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-[#7A7A8C]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#C8FF00]" />
            <span>Workout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#30D158]" />
            <span>Meal logged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#FF9F0A]" />
            <span>Weight logged</span>
          </div>
        </div>

        {/* Calendar grid */}
        <Card className="overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#2A2A30]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="p-3 text-center text-[10px] font-bold text-[#4A4A5A] uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const { workouts: dw, meals: dm, weight: dWeight } = getDayData(day);
              const inMonth = isSameMonth(day, currentMonth);
              const todayFlag = isToday(day);
              const selected = selectedDay && isSameDay(day, selectedDay);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'relative min-h-[72px] p-2 border-b border-r border-[#2A2A30] text-left transition-colors',
                    'hover:bg-[#1E1E23] last-of-type:border-r-0',
                    !inMonth && 'opacity-25',
                    selected && 'bg-[#C8FF00]/8 border-[#C8FF00]/30',
                    todayFlag && !selected && 'bg-[#C8FF00]/5',
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
                      todayFlag && 'bg-[#C8FF00] text-[#0F0F11]',
                      !todayFlag && inMonth && 'text-[#F0F0F5]',
                    )}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Indicators */}
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {dw.length > 0 && (
                      <div className="flex items-center gap-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
                        {dw.length > 1 && <span className="text-[8px] text-[#C8FF00] font-bold">×{dw.length}</span>}
                      </div>
                    )}
                    {dm.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />}
                    {dWeight && <div className="w-1.5 h-1.5 rounded-full bg-[#FF9F0A]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Monthly summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Workouts',
              value: workouts.filter((w) => {
                const d = parseISO(w.date);
                return isSameMonth(d, currentMonth) && w.completed;
              }).length,
              icon: <Dumbbell size={18} />,
              color: '#C8FF00',
            },
            {
              label: 'Days Logged',
              value: [...new Set(meals.filter((m) => {
                const d = parseISO(m.date);
                return isSameMonth(d, currentMonth);
              }).map((m) => m.date))].length,
              icon: <Utensils size={18} />,
              color: '#30D158',
            },
            {
              label: 'Weigh-ins',
              value: weights.filter((w) => {
                const d = parseISO(w.date);
                return isSameMonth(d, currentMonth);
              }).length,
              icon: <Scale size={18} />,
              color: '#FF9F0A',
            },
          ].map(({ label, value, icon, color }) => (
            <Card key={label} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15`, color }}>
                {icon}
              </div>
              <div>
                <p className="text-2xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}>{value}</p>
                <p className="text-xs text-[#7A7A8C]">{label} this month</p>
              </div>
            </Card>
          ))}
        </div>
      </PageContent>

      {/* Day detail modal */}
      {selectedDay && (
        <Modal
          open={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          title={format(selectedDay, 'EEEE, MMMM d')}
          size="md"
        >
          <DayDetail data={selectedDayData!} />
        </Modal>
      )}
    </AppLayout>
  );
}

function DayDetail({ data }: { data: ReturnType<typeof useTrackingStore.getState>['workouts'] extends infer W ? {
  workouts: W extends Array<infer R> ? R[] : never[];
  meals: any[];
  weight: any;
} : never }) {
  if (!data.workouts.length && !data.meals.length && !data.weight) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-3">😴</p>
        <p className="text-[#7A7A8C]">Rest day — no activity logged</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.workouts.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-2">Workouts</p>
          <div className="space-y-2">
            {data.workouts.map((w: any) => (
              <div key={w.id} className="flex items-center justify-between p-3 bg-[#1E1E23] rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#F0F0F5]">{w.name}</p>
                  <p className="text-xs text-[#7A7A8C]">{w.durationMin} min · {w.caloriesBurned ?? 0} kcal</p>
                </div>
                {w.completed && <span className="text-[#30D158] text-sm">✓ Done</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.meals.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-2">
            Nutrition · {data.meals.reduce((a: number, m: any) => a + m.totalCalories, 0)} kcal total
          </p>
          <div className="space-y-2">
            {data.meals.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-[#1E1E23] rounded-xl">
                <span className="text-sm text-[#F0F0F5] capitalize">{m.type}</span>
                <span className="text-sm font-bold text-[#30D158]">{m.totalCalories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.weight && (
        <div>
          <p className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-2">Body Weight</p>
          <div className="flex items-center justify-between p-3 bg-[#1E1E23] rounded-xl">
            <span className="text-sm text-[#F0F0F5]">Weigh-in</span>
            <span className="text-xl font-black text-[#FF9F0A]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {data.weight.weightKg} kg
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
