import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, subDays, parseISO, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns';
import { AppLayout, PageHeader, PageContent } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';

type Period = '7d' | '30d' | '90d';

const BRAND = '#C8FF00';
const DANGER = '#FF4560';
const INFO = '#0A84FF';
const SUCCESS = '#30D158';
const WARNING = '#FF9F0A';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E1E23] border border-[#2A2A30] rounded-xl p-3 text-xs shadow-xl">
      <p className="font-semibold text-[#7A7A8C] mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#F0F0F5]">{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const { weights, workouts, meals, dailyMetrics } = useTrackingStore();
  const { goals } = useGoalsStore();

  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

  // Weight data
  const weightData = Array.from({ length: Math.min(days, weights.length > 0 ? days : 0) }, (_, i) => {
    const dateStr = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
    const entry = weights.find((w) => w.date === dateStr);
    return {
      date: format(parseISO(dateStr), period === '7d' ? 'EEE' : 'MMM d'),
      weight: entry?.weightKg ?? null,
      bodyFat: entry?.bodyFatPercent ?? null,
    };
  }).filter((d) => d.weight !== null);

  // Calorie trend
  const calorieData = Array.from({ length: days }, (_, i) => {
    const dateStr = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
    const dayMeals = meals.filter((m) => m.date === dateStr);
    const total = dayMeals.reduce((a, m) => a + m.totalCalories, 0);
    return {
      date: format(parseISO(dateStr), period === '7d' ? 'EEE' : 'MMM d'),
      calories: total || null,
      goal: goals.dailyCalories,
    };
  });

  // Weekly workout frequency
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const start = startOfWeek(subWeeks(new Date(), 7 - i), { weekStartsOn: 1 });
    const end = endOfWeek(start, { weekStartsOn: 1 });
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    const count = workouts.filter((w) => w.completed && w.date >= startStr && w.date <= endStr).length;
    return {
      week: format(start, 'MMM d'),
      workouts: count,
      goal: goals.workoutsPerWeek,
    };
  });

  // Steps trend
  const stepsData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const dateStr = format(subDays(new Date(), Math.min(days, 30) - 1 - i), 'yyyy-MM-dd');
    const m = dailyMetrics.find((d) => d.date === dateStr);
    return {
      date: format(parseISO(dateStr), 'MMM d'),
      steps: m?.steps ?? 0,
      goal: goals.dailySteps,
    };
  });

  // Stats summary
  const totalWorkouts = workouts.filter((w) => w.completed).length;
  const avgWeight = weights.length ? (weights.reduce((a, w) => a + w.weightKg, 0) / weights.length).toFixed(1) : '--';
  const weightChange = weights.length >= 2
    ? (weights[weights.length - 1].weightKg - weights[0].weightKg).toFixed(1)
    : null;
  const avgCalories = calorieData.filter((d) => d.calories).length
    ? Math.round(calorieData.filter((d) => d.calories).reduce((a, d) => a + (d.calories ?? 0), 0) / calorieData.filter((d) => d.calories).length)
    : 0;
  const avgSteps = stepsData.length
    ? Math.round(stepsData.reduce((a, d) => a + d.steps, 0) / stepsData.length)
    : 0;

  return (
    <AppLayout>
      <PageHeader title="Analytics" subtitle="Visualize your progress over time" />

      <PageContent>
        {/* Period selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                period === p
                  ? 'bg-[#C8FF00] text-[#0F0F11]'
                  : 'bg-[#1E1E23] text-[#7A7A8C] hover:text-[#F0F0F5] border border-[#2A2A30]'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Workouts', value: totalWorkouts, color: BRAND, unit: '' },
            { label: 'Avg Calories', value: avgCalories.toLocaleString(), color: WARNING, unit: 'kcal' },
            { label: 'Avg Steps', value: (avgSteps / 1000).toFixed(1), color: INFO, unit: 'k' },
            { label: 'Weight Change', value: weightChange ? (parseFloat(weightChange) < 0 ? `+${Math.abs(parseFloat(weightChange))}` : `-${weightChange}`) : '--', color: SUCCESS, unit: 'kg' },
          ].map(({ label, value, color, unit }) => (
            <Card key={label} className="p-4 text-center">
              <p className="text-[10px] font-bold text-[#7A7A8C] uppercase tracking-wider mb-1">{label}</p>
              <p className="text-3xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}>
                {value}<span className="text-sm font-normal text-[#7A7A8C] ml-0.5">{unit}</span>
              </p>
            </Card>
          ))}
        </div>

        {/* Weight chart */}
        <Card className="p-5">
          <h3 className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-4">Weight Progression</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weightData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke={BRAND} strokeWidth={2} fill="url(#weightGrad)" dot={false} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Calorie trend */}
        <Card className="p-5">
          <h3 className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-4">Calorie Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={calorieData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={WARNING} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={WARNING} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="goal" name="Goal" stroke={DANGER} strokeWidth={1} strokeDasharray="4 4" dot={false} />
              <Area type="monotone" dataKey="calories" name="Calories (kcal)" stroke={WARNING} strokeWidth={2} fill="url(#calGrad)" dot={false} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Workout frequency */}
        <Card className="p-5">
          <h3 className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-4">Weekly Workout Frequency</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="workouts" name="Workouts" fill={BRAND} radius={[4, 4, 0, 0]} />
              <Bar dataKey="goal" name="Goal" fill={`${BRAND}25`} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Steps trend */}
        <Card className="p-5">
          <h3 className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-4">Daily Steps</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stepsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.floor(stepsData.length / 7)} />
              <YAxis tick={{ fill: '#4A4A5A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="goal" name="Step Goal" fill={`${INFO}15`} radius={[4, 4, 0, 0]} />
              <Bar dataKey="steps" name="Steps" fill={INFO} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </PageContent>
    </AppLayout>
  );
}
