import { useEffect } from 'react';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';
import { useUserStore } from '@/store/userStore';
import { mockWorkouts, mockMeals, mockWeights, mockDailyMetrics } from '@/data/mockData';
import { today, calculateCalorieGoal, defaultGoals } from '@/lib/utils';

// Seeds mock data if store is empty and user is onboarded
export function useAppData() {
  const { workouts, meals, weights, dailyMetrics, addWorkout, addMeal, addWeight, updateDailyMetrics } = useTrackingStore();
  const { setGoals } = useGoalsStore();
  const { profile } = useUserStore();

  useEffect(() => {
    if (!profile) return;

    if (workouts.length === 0) {
      mockWorkouts.forEach((w) => addWorkout(w));
    }
    if (meals.length === 0) {
      mockMeals.forEach((m) => addMeal(m));
    }
    if (weights.length === 0) {
      mockWeights.forEach((w) => addWeight(w));
    }
    if (dailyMetrics.length === 0) {
      mockDailyMetrics.forEach((m) => updateDailyMetrics(m.date, m));
    }
    
    // Sync calorie goal with profile
    const calGoal = calculateCalorieGoal(profile);
    setGoals({ ...defaultGoals(profile), dailyCalories: calGoal });
  }, [profile?.id]);
}

export function useTodayStats() {
  const store = useTrackingStore();
  const { goals } = useGoalsStore();
  const todayStr = today();

  const todayWorkouts = store.getWorkoutsForDate(todayStr);
  const todayMeals = store.getMealsForDate(todayStr);
  const todayMetrics = store.getDailyMetrics(todayStr);
  const todayWeight = store.getWeightForDate(todayStr);
  const caloriesConsumed = store.getCaloriesForDate(todayStr);

  const caloriesBurned = todayWorkouts.reduce((acc, w) => acc + (w.caloriesBurned ?? 0), 0);

  return {
    todayWorkouts,
    todayMeals,
    todayMetrics,
    todayWeight,
    caloriesConsumed,
    caloriesBurned,
    netCalories: caloriesConsumed - caloriesBurned,
    goals,
  };
}
