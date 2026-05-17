import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WorkoutLog, MealLog, WeightEntry, DailyMetrics, ProgressPhoto, StreakData
} from '@/types';
import { genId, today } from '@/lib/utils';
import { format } from 'date-fns';

interface TrackingState {
  workouts: WorkoutLog[];
  meals: MealLog[];
  weights: WeightEntry[];
  dailyMetrics: DailyMetrics[];
  progressPhotos: ProgressPhoto[];
  streak: StreakData;

  // Workout actions
  addWorkout: (workout: Omit<WorkoutLog, 'id'>) => void;
  updateWorkout: (id: string, updates: Partial<WorkoutLog>) => void;
  deleteWorkout: (id: string) => void;
  toggleWorkoutComplete: (id: string) => void;

  // Meal actions
  addMeal: (meal: Omit<MealLog, 'id'>) => void;
  updateMeal: (id: string, updates: Partial<MealLog>) => void;
  deleteMeal: (id: string) => void;

  // Weight actions
  addWeight: (entry: Omit<WeightEntry, 'id'>) => void;
  deleteWeight: (id: string) => void;

  // Metrics actions
  updateDailyMetrics: (date: string, updates: Partial<DailyMetrics>) => void;
  getDailyMetrics: (date: string) => DailyMetrics;

  // Photo actions
  addPhoto: (photo: Omit<ProgressPhoto, 'id'>) => void;
  deletePhoto: (id: string) => void;

  // Streak
  updateStreak: () => void;

  // Query helpers
  getWorkoutsForDate: (date: string) => WorkoutLog[];
  getMealsForDate: (date: string) => MealLog[];
  getWeightForDate: (date: string) => WeightEntry | undefined;
  getCaloriesForDate: (date: string) => number;
}

const defaultMetrics = (date: string): DailyMetrics => ({
  date,
  steps: 0,
  stepsGoal: 8000,
  waterMl: 0,
  waterGoalMl: 2500,
});

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set, get) => ({
      workouts: [],
      meals: [],
      weights: [],
      dailyMetrics: [],
      progressPhotos: [],
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        activeDates: [],
      },

      addWorkout: (workout) =>
        set((s) => ({ workouts: [{ ...workout, id: genId() }, ...s.workouts] })),

      updateWorkout: (id, updates) =>
        set((s) => ({
          workouts: s.workouts.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),

      deleteWorkout: (id) =>
        set((s) => ({ workouts: s.workouts.filter((w) => w.id !== id) })),

      toggleWorkoutComplete: (id) =>
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === id ? { ...w, completed: !w.completed } : w
          ),
        })),

      addMeal: (meal) =>
        set((s) => ({ meals: [{ ...meal, id: genId() }, ...s.meals] })),

      updateMeal: (id, updates) =>
        set((s) => ({
          meals: s.meals.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),

      deleteMeal: (id) =>
        set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),

      addWeight: (entry) =>
        set((s) => ({
          weights: [{ ...entry, id: genId() }, ...s.weights].sort((a, b) =>
            b.date.localeCompare(a.date)
          ),
        })),

      deleteWeight: (id) =>
        set((s) => ({ weights: s.weights.filter((w) => w.id !== id) })),

      updateDailyMetrics: (date, updates) =>
        set((s) => {
          const existing = s.dailyMetrics.find((m) => m.date === date);
          if (existing) {
            return {
              dailyMetrics: s.dailyMetrics.map((m) =>
                m.date === date ? { ...m, ...updates } : m
              ),
            };
          }
          return {
            dailyMetrics: [{ ...defaultMetrics(date), ...updates }, ...s.dailyMetrics],
          };
        }),

      getDailyMetrics: (date) => {
        const found = get().dailyMetrics.find((m) => m.date === date);
        return found ?? defaultMetrics(date);
      },

      addPhoto: (photo) =>
        set((s) => ({
          progressPhotos: [{ ...photo, id: genId() }, ...s.progressPhotos],
        })),

      deletePhoto: (id) =>
        set((s) => ({
          progressPhotos: s.progressPhotos.filter((p) => p.id !== id),
        })),

      updateStreak: () =>
        set((s) => {
          const todayStr = today();
          const activeDates = new Set(s.streak.activeDates);
          activeDates.add(todayStr);

          const sortedDates = Array.from(activeDates).sort().reverse();
          let streak = 0;
          for (let i = 0; i < sortedDates.length; i++) {
            const expected = format(
              new Date(new Date().setDate(new Date().getDate() - i)),
              'yyyy-MM-dd'
            );
            if (sortedDates[i] === expected) streak++;
            else break;
          }

          return {
            streak: {
              currentStreak: streak,
              longestStreak: Math.max(streak, s.streak.longestStreak),
              lastActiveDate: todayStr,
              activeDates: sortedDates,
            },
          };
        }),

      getWorkoutsForDate: (date) => get().workouts.filter((w) => w.date === date),
      getMealsForDate: (date) => get().meals.filter((m) => m.date === date),
      getWeightForDate: (date) => get().weights.find((w) => w.date === date),
      getCaloriesForDate: (date) =>
        get()
          .meals.filter((m) => m.date === date)
          .reduce((acc, m) => acc + m.totalCalories, 0),
    }),
    { name: 'fitness-tracking' }
  )
);
