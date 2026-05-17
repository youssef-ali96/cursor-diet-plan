import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useUserStore } from '@/store/userStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';

// ─── User Store ───────────────────────────────────────────────────────────────

describe('useUserStore', () => {
  beforeEach(() => {
    act(() => { useUserStore.setState({ profile: null, isOnboarded: false }); });
  });

  it('starts with no profile and not onboarded', () => {
    const { profile, isOnboarded } = useUserStore.getState();
    expect(profile).toBeNull();
    expect(isOnboarded).toBe(false);
  });

  it('setProfile creates a profile and marks onboarded', () => {
    act(() => {
      useUserStore.getState().setProfile({
        name: 'Ali', age: 25, gender: 'male', heightCm: 175,
        currentWeightKg: 85, goalWeightKg: 75, activityLevel: 'moderate',
        trainingExperience: 'intermediate', theme: 'dark',
      });
    });
    const { profile, isOnboarded } = useUserStore.getState();
    expect(profile).not.toBeNull();
    expect(profile?.name).toBe('Ali');
    expect(profile?.id).toBeTruthy();
    expect(profile?.createdAt).toBeTruthy();
    expect(isOnboarded).toBe(true);
  });

  it('updateProfile merges updates into existing profile', () => {
    act(() => {
      useUserStore.getState().setProfile({
        name: 'Ali', age: 25, gender: 'male', heightCm: 175,
        currentWeightKg: 85, goalWeightKg: 75, activityLevel: 'moderate',
        trainingExperience: 'intermediate', theme: 'dark',
      });
    });
    act(() => { useUserStore.getState().updateProfile({ currentWeightKg: 82, age: 26 }); });
    const { profile } = useUserStore.getState();
    expect(profile?.currentWeightKg).toBe(82);
    expect(profile?.age).toBe(26);
    expect(profile?.name).toBe('Ali');
  });

  it('updateProfile is a no-op when profile is null', () => {
    act(() => { useUserStore.getState().updateProfile({ age: 30 }); });
    expect(useUserStore.getState().profile).toBeNull();
  });

  it('setTheme updates profile theme', () => {
    act(() => {
      useUserStore.getState().setProfile({
        name: 'Ali', age: 25, gender: 'male', heightCm: 175,
        currentWeightKg: 85, goalWeightKg: 75, activityLevel: 'moderate',
        trainingExperience: 'intermediate', theme: 'dark',
      });
    });
    act(() => { useUserStore.getState().setTheme('light'); });
    expect(useUserStore.getState().profile?.theme).toBe('light');
  });

  it('resetOnboarding clears profile and resets flag', () => {
    act(() => {
      useUserStore.getState().setProfile({
        name: 'Ali', age: 25, gender: 'male', heightCm: 175,
        currentWeightKg: 85, goalWeightKg: 75, activityLevel: 'moderate',
        trainingExperience: 'intermediate', theme: 'dark',
      });
    });
    act(() => { useUserStore.getState().resetOnboarding(); });
    expect(useUserStore.getState().profile).toBeNull();
    expect(useUserStore.getState().isOnboarded).toBe(false);
  });
});

// ─── Tracking Store — workouts ────────────────────────────────────────────────

const workoutBase = {
  date: '2024-06-17',
  type: 'strength' as const,
  name: 'Upper Body',
  durationMin: 45,
  intensity: 'moderate' as const,
  exercises: [],
  completed: false,
};

const resetTracking = () => {
  act(() => {
    useTrackingStore.setState({
      workouts: [], meals: [], weights: [], dailyMetrics: [], progressPhotos: [],
    });
  });
};

describe('useTrackingStore — workouts', () => {
  beforeEach(resetTracking);

  it('starts with empty workouts', () => {
    expect(useTrackingStore.getState().workouts).toHaveLength(0);
  });

  it('addWorkout appends a workout with generated id', () => {
    act(() => { useTrackingStore.getState().addWorkout(workoutBase); });
    const { workouts } = useTrackingStore.getState();
    expect(workouts).toHaveLength(1);
    expect(workouts[0].id).toBeTruthy();
    expect(workouts[0].name).toBe('Upper Body');
  });

  it('deleteWorkout removes the correct workout', () => {
    act(() => { useTrackingStore.getState().addWorkout(workoutBase); });
    const id = useTrackingStore.getState().workouts[0].id;
    act(() => { useTrackingStore.getState().deleteWorkout(id); });
    expect(useTrackingStore.getState().workouts).toHaveLength(0);
  });

  it('updateWorkout changes specific fields', () => {
    act(() => { useTrackingStore.getState().addWorkout(workoutBase); });
    const id = useTrackingStore.getState().workouts[0].id;
    act(() => { useTrackingStore.getState().updateWorkout(id, { name: 'Chest Day', durationMin: 60 }); });
    const updated = useTrackingStore.getState().workouts[0];
    expect(updated.name).toBe('Chest Day');
    expect(updated.durationMin).toBe(60);
  });

  it('toggleWorkoutComplete flips the completed flag', () => {
    act(() => { useTrackingStore.getState().addWorkout(workoutBase); });
    const id = useTrackingStore.getState().workouts[0].id;
    act(() => { useTrackingStore.getState().toggleWorkoutComplete(id); });
    expect(useTrackingStore.getState().workouts[0].completed).toBe(true);
    act(() => { useTrackingStore.getState().toggleWorkoutComplete(id); });
    expect(useTrackingStore.getState().workouts[0].completed).toBe(false);
  });

  it('getWorkoutsForDate returns only workouts matching the date', () => {
    act(() => {
      useTrackingStore.getState().addWorkout({ ...workoutBase, date: '2024-06-17' });
      useTrackingStore.getState().addWorkout({ ...workoutBase, date: '2024-06-18' });
    });
    const result = useTrackingStore.getState().getWorkoutsForDate('2024-06-17');
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2024-06-17');
  });
});

// ─── Tracking Store — meals ───────────────────────────────────────────────────

const mealBase = {
  date: '2024-06-17',
  type: 'lunch' as const,
  items: [],
  totalCalories: 600,
};

describe('useTrackingStore — meals', () => {
  beforeEach(resetTracking);

  it('addMeal appends meal with id', () => {
    act(() => { useTrackingStore.getState().addMeal(mealBase); });
    expect(useTrackingStore.getState().meals).toHaveLength(1);
    expect(useTrackingStore.getState().meals[0].id).toBeTruthy();
  });

  it('deleteMeal removes the meal', () => {
    act(() => { useTrackingStore.getState().addMeal(mealBase); });
    const id = useTrackingStore.getState().meals[0].id;
    act(() => { useTrackingStore.getState().deleteMeal(id); });
    expect(useTrackingStore.getState().meals).toHaveLength(0);
  });

  it('getMealsForDate filters by date', () => {
    act(() => {
      useTrackingStore.getState().addMeal({ ...mealBase, date: '2024-06-17' });
      useTrackingStore.getState().addMeal({ ...mealBase, date: '2024-06-18' });
    });
    expect(useTrackingStore.getState().getMealsForDate('2024-06-17')).toHaveLength(1);
    expect(useTrackingStore.getState().getMealsForDate('2024-06-19')).toHaveLength(0);
  });

  it('getCaloriesForDate sums totalCalories for the day', () => {
    act(() => {
      useTrackingStore.getState().addMeal({ ...mealBase, date: '2024-06-17', totalCalories: 400 });
      useTrackingStore.getState().addMeal({ ...mealBase, date: '2024-06-17', totalCalories: 600 });
      useTrackingStore.getState().addMeal({ ...mealBase, date: '2024-06-18', totalCalories: 500 });
    });
    expect(useTrackingStore.getState().getCaloriesForDate('2024-06-17')).toBe(1000);
    expect(useTrackingStore.getState().getCaloriesForDate('2024-06-18')).toBe(500);
  });
});

// ─── Tracking Store — weights ─────────────────────────────────────────────────

describe('useTrackingStore — weights', () => {
  beforeEach(resetTracking);

  it('addWeight inserts and sorts newest first', () => {
    act(() => {
      useTrackingStore.getState().addWeight({ date: '2024-06-15', weightKg: 85 });
      useTrackingStore.getState().addWeight({ date: '2024-06-17', weightKg: 84 });
      useTrackingStore.getState().addWeight({ date: '2024-06-16', weightKg: 84.5 });
    });
    const dates = useTrackingStore.getState().weights.map((w) => w.date);
    expect(dates).toEqual(['2024-06-17', '2024-06-16', '2024-06-15']);
  });

  it('getWeightForDate finds the correct entry', () => {
    act(() => { useTrackingStore.getState().addWeight({ date: '2024-06-17', weightKg: 84 }); });
    const found = useTrackingStore.getState().getWeightForDate('2024-06-17');
    expect(found?.weightKg).toBe(84);
    expect(useTrackingStore.getState().getWeightForDate('2024-06-01')).toBeUndefined();
  });

  it('deleteWeight removes entry', () => {
    act(() => { useTrackingStore.getState().addWeight({ date: '2024-06-17', weightKg: 84 }); });
    const id = useTrackingStore.getState().weights[0].id;
    act(() => { useTrackingStore.getState().deleteWeight(id); });
    expect(useTrackingStore.getState().weights).toHaveLength(0);
  });
});

// ─── Tracking Store — dailyMetrics ────────────────────────────────────────────

describe('useTrackingStore — dailyMetrics', () => {
  beforeEach(resetTracking);

  it('getDailyMetrics returns defaults when no entry exists', () => {
    const m = useTrackingStore.getState().getDailyMetrics('2024-06-17');
    expect(m.steps).toBe(0);
    expect(m.waterMl).toBe(0);
    expect(m.stepsGoal).toBe(8000);
  });

  it('updateDailyMetrics creates a new entry if none exists', () => {
    act(() => { useTrackingStore.getState().updateDailyMetrics('2024-06-17', { steps: 5000 }); });
    expect(useTrackingStore.getState().getDailyMetrics('2024-06-17').steps).toBe(5000);
  });

  it('updateDailyMetrics merges into existing entry', () => {
    act(() => { useTrackingStore.getState().updateDailyMetrics('2024-06-17', { steps: 5000 }); });
    act(() => { useTrackingStore.getState().updateDailyMetrics('2024-06-17', { waterMl: 1000 }); });
    const m = useTrackingStore.getState().getDailyMetrics('2024-06-17');
    expect(m.steps).toBe(5000);
    expect(m.waterMl).toBe(1000);
  });
});

// ─── Goals Store ──────────────────────────────────────────────────────────────

describe('useGoalsStore — goals', () => {
  beforeEach(() => {
    act(() => {
      useGoalsStore.setState({
        goals: { workoutsPerWeek: 4, dailySteps: 8000, dailyCalories: 2000, dailyWaterMl: 2500, weeklyCardioMin: 150 },
      });
    });
  });

  it('setGoals merges partial updates', () => {
    act(() => { useGoalsStore.getState().setGoals({ dailySteps: 10000 }); });
    const { goals } = useGoalsStore.getState();
    expect(goals.dailySteps).toBe(10000);
    expect(goals.workoutsPerWeek).toBe(4);
  });
});

describe('useGoalsStore — XP & levels', () => {
  beforeEach(() => {
    act(() => {
      useGoalsStore.setState({ userLevel: { level: 1, xp: 0, xpToNextLevel: 500, title: 'Rookie' } });
    });
  });

  it('addXP increments xp', () => {
    act(() => { useGoalsStore.getState().addXP(100); });
    expect(useGoalsStore.getState().userLevel.xp).toBe(100);
  });

  it('addXP levels up when XP crosses threshold', () => {
    act(() => { useGoalsStore.getState().addXP(500); });
    expect(useGoalsStore.getState().userLevel.level).toBe(2);
    expect(useGoalsStore.getState().userLevel.xp).toBe(0);
  });

  it('addXP handles multiple level-ups', () => {
    act(() => { useGoalsStore.getState().addXP(1500); });
    expect(useGoalsStore.getState().userLevel.level).toBe(4);
  });

  it('level title updates on level-up', () => {
    act(() => { useGoalsStore.getState().addXP(2500); });
    expect(useGoalsStore.getState().userLevel.title).toBe('Contender');
  });
});

describe('useGoalsStore — achievements', () => {
  beforeEach(() => {
    const defaultAchievements = useGoalsStore.getState().achievements.map((a) => ({
      ...a, unlocked: false, progress: 0,
    }));
    act(() => { useGoalsStore.setState({ achievements: defaultAchievements }); });
  });

  it('unlockAchievement sets unlocked=true and sets progress to requirement', () => {
    act(() => { useGoalsStore.getState().unlockAchievement('streak_7'); });
    const ach = useGoalsStore.getState().achievements.find((a) => a.id === 'streak_7')!;
    expect(ach.unlocked).toBe(true);
    expect(ach.progress).toBe(ach.requirement);
    expect(ach.unlockedAt).toBeTruthy();
  });

  it('updateAchievementProgress caps at requirement', () => {
    act(() => { useGoalsStore.getState().updateAchievementProgress('workouts_10', 999); });
    const ach = useGoalsStore.getState().achievements.find((a) => a.id === 'workouts_10')!;
    expect(ach.progress).toBe(ach.requirement);
  });

  it('updateAchievementProgress sets partial progress', () => {
    act(() => { useGoalsStore.getState().updateAchievementProgress('workouts_30', 15); });
    const ach = useGoalsStore.getState().achievements.find((a) => a.id === 'workouts_30')!;
    expect(ach.progress).toBe(15);
  });
});

describe('useGoalsStore — habits', () => {
  beforeEach(() => {
    act(() => { useGoalsStore.setState({ habits: [] }); });
  });

  it('addHabit appends with generated id and empty completedDates', () => {
    act(() => {
      useGoalsStore.getState().addHabit({ name: 'Meditate', icon: '🧘', color: '#BF5AF2', targetDaysPerWeek: 7 });
    });
    const { habits } = useGoalsStore.getState();
    expect(habits).toHaveLength(1);
    expect(habits[0].id).toBeTruthy();
    expect(habits[0].completedDates).toEqual([]);
  });

  it('toggleHabitDate adds a date when not present', () => {
    act(() => {
      useGoalsStore.getState().addHabit({ name: 'Run', icon: '🏃', color: '#30D158', targetDaysPerWeek: 5 });
    });
    const id = useGoalsStore.getState().habits[0].id;
    act(() => { useGoalsStore.getState().toggleHabitDate(id, '2024-06-17'); });
    expect(useGoalsStore.getState().habits[0].completedDates).toContain('2024-06-17');
  });

  it('toggleHabitDate removes a date when already present', () => {
    act(() => {
      useGoalsStore.getState().addHabit({ name: 'Run', icon: '🏃', color: '#30D158', targetDaysPerWeek: 5 });
    });
    const id = useGoalsStore.getState().habits[0].id;
    act(() => { useGoalsStore.getState().toggleHabitDate(id, '2024-06-17'); });
    act(() => { useGoalsStore.getState().toggleHabitDate(id, '2024-06-17'); });
    expect(useGoalsStore.getState().habits[0].completedDates).not.toContain('2024-06-17');
  });

  it('deleteHabit removes the habit', () => {
    act(() => {
      useGoalsStore.getState().addHabit({ name: 'Run', icon: '🏃', color: '#30D158', targetDaysPerWeek: 5 });
    });
    const id = useGoalsStore.getState().habits[0].id;
    act(() => { useGoalsStore.getState().deleteHabit(id); });
    expect(useGoalsStore.getState().habits).toHaveLength(0);
  });
});
