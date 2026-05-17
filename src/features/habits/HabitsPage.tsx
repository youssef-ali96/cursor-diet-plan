import { useState } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/Progress';
import { useGoalsStore } from '@/store/goalsStore';
import { today, cn } from '@/lib/utils';

const ICONS = ['🏋️', '💧', '🥗', '🚶', '😴', '📚', '🧘', '🏃', '💊', '🥤', '🎯', '🫀'];
const COLORS = ['#C8FF00', '#0A84FF', '#30D158', '#FF9F0A', '#FF4560', '#BF5AF2', '#FF6B35', '#5AC8FA'];

export function HabitsPage() {
  const { habits, toggleHabitDate, deleteHabit, addHabit } = useGoalsStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: '🏋️', color: '#C8FF00', targetDaysPerWeek: '5' });

  const todayStr = today();
  const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'));

  const handleAdd = () => {
    if (!newHabit.name) return;
    addHabit({
      name: newHabit.name,
      icon: newHabit.icon,
      color: newHabit.color,
      targetDaysPerWeek: parseInt(newHabit.targetDaysPerWeek) || 5,
    });
    setNewHabit({ name: '', icon: '🏋️', color: '#C8FF00', targetDaysPerWeek: '5' });
    setShowAdd(false);
  };

  const getTodayCompletion = () => {
    const total = habits.length;
    const done = habits.filter((h) => h.completedDates.includes(todayStr)).length;
    return { total, done };
  };

  const { total, done } = getTodayCompletion();

  return (
    <AppLayout>
      <PageHeader
        title="Habits"
        subtitle="Build consistency through daily rituals"
        actions={
          <Button size="sm" onClick={() => setShowAdd(true)} className="gap-1.5">
            <Plus size={14} /> Add Habit
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Today's completion */}
        <Card glow className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">Today's Progress</p>
              <p className="text-3xl font-black text-[#C8FF00] mt-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {done}/{total} <span className="text-base font-normal text-[#7A7A8C]">habits done</span>
              </p>
            </div>
            <div className="text-4xl">
              {done === total && total > 0 ? '🏆' : done >= Math.floor(total / 2) ? '💪' : '⚡'}
            </div>
          </div>
          <ProgressBar
            value={total > 0 ? Math.round((done / total) * 100) : 0}
            color="#C8FF00"
            height={8}
          />
        </Card>

        {/* Habits grid */}
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">✅</span>
            <p className="text-lg font-bold text-[#F0F0F5] mb-2">No habits yet</p>
            <p className="text-sm text-[#7A7A8C] mb-6">Start tracking daily habits to build lasting routines</p>
            <Button onClick={() => setShowAdd(true)}>Add First Habit</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const weekDone = last7.filter((d) => habit.completedDates.includes(d)).length;
              const weekPct = Math.round((weekDone / 7) * 100);
              const isDoneToday = habit.completedDates.includes(todayStr);

              return (
                <Card key={habit.id} className={cn('p-4', isDoneToday && 'border-opacity-30')} style={isDoneToday ? { borderColor: `${habit.color}30` } : {}}>
                  <div className="flex items-center gap-4">
                    {/* Toggle */}
                    <button
                      onClick={() => toggleHabitDate(habit.id, todayStr)}
                      className="shrink-0 transition-transform active:scale-90"
                    >
                      {isDoneToday ? (
                        <CheckCircle2 size={28} style={{ color: habit.color }} />
                      ) : (
                        <Circle size={28} className="text-[#2A2A30]" />
                      )}
                    </button>

                    {/* Icon & name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{habit.icon}</span>
                        <p className={cn('text-sm font-semibold', isDoneToday ? 'text-[#F0F0F5]' : 'text-[#7A7A8C]')}>
                          {habit.name}
                        </p>
                        {isDoneToday && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
                            Done!
                          </span>
                        )}
                      </div>

                      {/* 7-day dots */}
                      <div className="flex items-center gap-1.5">
                        {last7.map((d, i) => (
                          <div
                            key={d}
                            title={format(parseISO(d), 'EEE')}
                            className="flex flex-col items-center gap-1"
                          >
                            <div
                              className="w-5 h-5 rounded-full transition-all"
                              style={{
                                backgroundColor: habit.completedDates.includes(d)
                                  ? habit.color
                                  : '#252529',
                              }}
                            />
                            <span className="text-[8px] text-[#4A4A5A]">
                              {format(parseISO(d), 'E').charAt(0)}
                            </span>
                          </div>
                        ))}
                        <div className="ml-auto pl-2">
                          <span className="text-xs font-bold" style={{ color: habit.color }}>
                            {weekDone}/7
                          </span>
                          <span className="text-[10px] text-[#4A4A5A] ml-1">this week</span>
                        </div>
                      </div>
                    </div>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 w-8 h-8 opacity-40 hover:opacity-100"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add habit modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create New Habit" size="sm">
        <div className="space-y-4">
          <Input
            label="Habit Name"
            placeholder="e.g. Morning Workout"
            value={newHabit.name}
            onChange={(e) => setNewHabit((h) => ({ ...h, name: e.target.value }))}
          />

          <div>
            <p className="text-xs font-semibold text-[#7A7A8C] uppercase tracking-wider mb-2">Icon</p>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewHabit((h) => ({ ...h, icon }))}
                  className={cn(
                    'h-10 text-xl rounded-xl transition-all',
                    newHabit.icon === icon ? 'bg-[#C8FF00]/20 ring-1 ring-[#C8FF00]/60' : 'bg-[#1E1E23] hover:bg-[#252529]'
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#7A7A8C] uppercase tracking-wider mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewHabit((h) => ({ ...h, color }))}
                  className={cn('w-8 h-8 rounded-full transition-transform', newHabit.color === color && 'ring-2 ring-white/40 scale-110')}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Select
            label="Target Days/Week"
            value={newHabit.targetDaysPerWeek}
            onChange={(e) => setNewHabit((h) => ({ ...h, targetDaysPerWeek: e.target.value }))}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n} day{n > 1 ? 's' : ''}</option>
            ))}
          </Select>

          <Button onClick={handleAdd} size="lg" className="w-full" disabled={!newHabit.name}>
            Create Habit
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
