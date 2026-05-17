import { useMemo } from 'react';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { subDays, format, startOfWeek } from 'date-fns';
import type { Insight } from '@/types';
import { genId } from '@/lib/utils';

export function useInsights(): Insight[] {
  const { workouts, weights, meals, dailyMetrics, streak } = useTrackingStore();
  const { goals } = useGoalsStore();

  return useMemo(() => {
    const insights: Insight[] = [];
    const todayDate = new Date();
    const todayStr = format(todayDate, 'yyyy-MM-dd');

    // ─── Weight trend ────────────────────────────────────────────────────────
    const recentWeights = weights.slice(0, 14);
    if (recentWeights.length >= 7) {
      const first = recentWeights[recentWeights.length - 1].weightKg;
      const last = recentWeights[0].weightKg;
      const diff = first - last;
      const weekly = (diff / 2).toFixed(2);
      if (diff > 0.5) {
        insights.push({ id: genId(), type: 'success', title: 'Losing Weight!', description: `You're losing ~${weekly} kg/week. Keep it up!`, icon: '📉', date: todayStr, dismissed: false });
      } else if (diff < -0.5) {
        insights.push({ id: genId(), type: 'info', title: 'Gaining Weight', description: `You've gained ~${Math.abs(diff).toFixed(1)} kg in 2 weeks. Check your nutrition.`, icon: '📈', date: todayStr, dismissed: false });
      } else {
        insights.push({ id: genId(), type: 'info', title: 'Weight Stable', description: `Your weight has been stable for 2 weeks.`, icon: '⚖️', date: todayStr, dismissed: false });
      }
    }

    // ─── Workout frequency ───────────────────────────────────────────────────
    const weekStart = startOfWeek(todayDate, { weekStartsOn: 1 });
    const thisWeekWorkouts = workouts.filter(
      (w) => w.completed && w.date >= format(weekStart, 'yyyy-MM-dd') && w.date <= todayStr
    );
    const lastWeekStart = format(subDays(weekStart, 7), 'yyyy-MM-dd');
    const lastWeekEnd = format(subDays(weekStart, 1), 'yyyy-MM-dd');
    const lastWeekWorkouts = workouts.filter(
      (w) => w.completed && w.date >= lastWeekStart && w.date <= lastWeekEnd
    );
    const missed = goals.workoutsPerWeek - thisWeekWorkouts.length;

    if (missed > 0) {
      insights.push({ id: genId(), type: 'warning', title: `${missed} Workout${missed > 1 ? 's' : ''} Left This Week`, description: `You've done ${thisWeekWorkouts.length}/${goals.workoutsPerWeek} workouts. Push yourself!`, icon: '💪', date: todayStr, dismissed: false });
    } else {
      insights.push({ id: genId(), type: 'success', title: 'Weekly Goal Crushed!', description: `All ${goals.workoutsPerWeek} workouts done this week!`, icon: '🏆', date: todayStr, dismissed: false });
    }

    // Activity change
    if (lastWeekWorkouts.length > 0) {
      const pct = Math.round(((thisWeekWorkouts.length - lastWeekWorkouts.length) / lastWeekWorkouts.length) * 100);
      if (pct > 0) {
        insights.push({ id: genId(), type: 'success', title: `Activity Up ${pct}%`, description: `You trained more this week vs last week. Building momentum!`, icon: '⚡', date: todayStr, dismissed: false });
      }
    }

    // ─── Streak ──────────────────────────────────────────────────────────────
    if (streak.currentStreak >= 5) {
      insights.push({ id: genId(), type: 'success', title: `${streak.currentStreak}-Day Streak!`, description: `Incredible consistency! You're active ${streak.currentStreak} days in a row.`, icon: '🔥', date: todayStr, dismissed: false });
    }

    // ─── Steps ───────────────────────────────────────────────────────────────
    const recentMetrics = dailyMetrics.slice(0, 7);
    const avgSteps = recentMetrics.length
      ? Math.round(recentMetrics.reduce((a, m) => a + m.steps, 0) / recentMetrics.length)
      : 0;
    if (avgSteps > goals.dailySteps) {
      insights.push({ id: genId(), type: 'success', title: 'Step Goal Exceeded!', description: `Your 7-day avg steps (${avgSteps.toLocaleString()}) beat your goal!`, icon: '👟', date: todayStr, dismissed: false });
    } else if (avgSteps < goals.dailySteps * 0.6) {
      insights.push({ id: genId(), type: 'tip', title: 'Increase Your Steps', description: `Your avg steps (${avgSteps.toLocaleString()}) are well below ${goals.dailySteps.toLocaleString()} goal.`, icon: '🚶', date: todayStr, dismissed: false });
    }

    // ─── Nutrition ───────────────────────────────────────────────────────────
    const loggedDays = [...new Set(meals.map((m) => m.date))].length;
    if (loggedDays >= 7) {
      insights.push({ id: genId(), type: 'success', title: 'Consistent Logger', description: `You've been logging meals for ${loggedDays} days. Great habit!`, icon: '📋', date: todayStr, dismissed: false });
    }

    return insights.slice(0, 6);
  }, [workouts, weights, meals, dailyMetrics, streak, goals]);
}
