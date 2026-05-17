import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';

// We import the store factories directly and reset state between tests
// by calling setState on the store instance.

// ─── User Store ───────────────────────────────────────────────────────────────

describe('useUserStore', () => {
  let store: Awaited<ReturnType<typeof import('@/store/userStore')>>['useUserStore'];

  beforeEach(async () => {
    // Re-import to get a fresh module reference; reset state manually
    const mod = await import('@/store/userStore');
    store = mod.useUserStore;
    act(() => {
      store.setState({ profile: null, isOnboarded: false });
    });
  });

  it('starts with no profile and not onboarded', () => {
    const { profile, isOnboarded } = store.getState();
    expect(profile).toBeNull();
    expect(isOnboarded).toBe(false);
  });

  it('setProfile creates a profile and marks onboarded', () => {
    act(() => {
      store.getState().setProfile({
        name: 'Ali',
        age: 25,
        gender: 'male',
        heightCm: 175,
        currentWeightKg: 85,
        goalWeightKg: 75,
        activityLevel: 'moderate',
        trainingExperience: 'intermediate',
        theme: 'dark',
      });
    });

    const { profile, isOnboarded } = store.getState();
    expect(profile).not.toBeNull();
    expect(profile?.name).toBe('Ali');
    expect(profile?.id).toBeTruthy();
    expect(profile?.createdAt).toBeTruthy();
    expect(isOnboarded).toBe(true);
  });

  it('updateProfile merges updates into existing profile', () => {
    act(() => {
      store.getState().setProfile({
        name: 'Ali',
        age: 25,
        gender: 'male',
        heightCm: 175,
        currentWeightKg: 85,
        goalWeightKg: 75,
        activityLevel: 'moderate',
        trainingExperience: 'intermediate',
        theme: 'dark',
      });
    });

    act(() => {
      store.getState().updateProfile({ currentWeightKg: 82, age: 26 });
    });

    const { profile } = store.getState();
    expect(profile?.currentWeightKg).toBe(82);
    expect(profile?.age).toBe(26);
    expect(profile?.name).toBe('Ali'); // unchanged
  });

  it('updateProfile is a no-op when profile is null', () => {
    act(() => {
      store.getState().updateProfile({ age: 30 });
    });
    expect(store.getState().profile).toBeNull();
  });

  it('setTheme updates profile theme', () => {
    act(() => {
      store.getState().setProfile({
        name: 'Ali', age: 25, gender: 'male', heightCm: 175,
        currentWeightKg: 85, goalWeightKg: 75, activityLevel: 'moderate',
        trainingExperience: 'intermediate', theme: 'dark',
      });
    });
    act(() => { store.getState().setTheme('light'); });
    expect(store.getState().profile?.theme).toBe('light');
  });

  it('resetOnboarding clears profile and resets flag', () => {
    act(() => {
      store.getState().setProfile({
        name: 'Ali', age: 25, gender: 'male', heightCm: 175,
        currentWeightKg: 85, goalWeightKg: 75, activityLevel: 'moderate',
        trainingExperience: 'intermediate', theme: 'dark',
      });
    });
    act(() => { store.getState().resetOnboarding(); });
    expect(store.getState().profile).toBeNull();
    expect(store.getState().isOnboarded).toBe(false);
  });
});

// ─── Tracking Store ───────────────────────────────────────────────────────────

describe('useTrackingStore — workouts', () => {
  let store: Awaited<ReturnType<typeof import('@/store/trackingStore')>>['useTrackingStore'];

  const workoutBase = {
    date: '2024-06-17',
    type: 'strength' as const,
    name: 'Upper Body',
    durationMin: 45,
    intensity: 'moderate' as const,
    exercises: [],
    completed: false,
  };

  beforeEach(async () => {
    const mod = await import('@/store/trackingStore');
    store = mod.useTrackingStore;
    act(() => {
      store.setState({ workouts: [], meals: [], weights: [], dailyMetrics: [], progressPhotos: [] });
    });
  });

  it('starts with empty workouts', () => {
    expect(store.getState().workouts).toHaveLength(0);
  });

  it('addWorkout appends a workout with generated id', () => {
    act(() => { store.getState().addWorkout(workoutBase); });
    const { workouts } = store.getState();
    expect(workouts).toHaveLength(1);
    expect(workouts[0].id).toBeTruthy();
    expect(workouts[0].name).toBe('Upper Body');
  });

  it('deleteWorkout removes the correct workout', () => {
    act(() => { store.getState().addWorkout(workoutBase); });
    const id = store.getState().workouts[0].id;
    act(() => { store.getState().deleteWorkout(id); });
    expect(store.getState().workouts).toHaveLength(0);
  });

  it('updateWorkout changes specific fields', () => {
    act(() => { store.getState().addWorkout(workoutBase); });
    const id = store.getState().workouts[0].id;
    act(() => { store.getState().updateWorkout(id, { name: 'Chest Day', durationMin: 60 }); });
    const updated = store.getState().workouts[0];
    expect(updated.name).toBe('Chest Day');
    expect(updated.durationMin).toBe(60);
  });

  it('toggleWorkoutComplete flips the completed flag', () => {
    act(() => { store.getState().addWorkout(workoutBase); });
    const id = store.getState().workouts[0].id;
    act(() => { store.getState().toggleWorkoutComplete(id); });
    expect(store.getState().workouts[0].completed).toBe(true);
    act(() => { store.getState().toggleWorkoutComplete(id); });
    expect(store.getState().workouts[0].completed).toBe(false);
  });

  it('getWorkoutsForDate returns only workouts matching the date', () => {
    act(() => {
      store.getState().addWorkout({ ...workoutBase, date: '2024-06-17' });
      store.getState().addWorkout({ ...workoutBase, date: '2024-06-18' });
    });
    const result = store.getState().getWorkoutsForDate('2024-06-17');
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2024-06-17');
  });
});

describe('useTrackingStore — meals', () => {
  let store: Awaited<ReturnType<typeof import('@/store/trackingStore')>>['useTrackingStore'];

  const mealBase = {
    date: '2024-06-17',
    type: 'lunch' as const,
    items: [],
    totalCalories: 600,
  };

  beforeEach(async () => {
    const mod = await import('@/store/trackingStore');
    store = mod.useTrackingStore;
    act(() => { store.setState({ workouts: [], meals: [], weights: [], dailyMetrics: [], progressPhotos: [] }); });
  });

  it('addMeal appends meal with id', () => {
    act(() => { store.getState().addMeal(mealBase); });
    expect(store.getState().meals).toHaveLength(1);
    expect(store.getState().meals[0].id).toBeTruthy();
  });

  it('deleteMeal removes the meal', () => {
    act(() => { store.getState().addMeal(mealBase); });
    const id = store.getState().meals[0].id;
    act(() => { store.getState().deleteMeal(id); });
    expect(store.getState().meals).toHaveLength(0);
  });

  it('getMealsForDate filters by date', () => {
    act(() => {
      store.getState().addMeal({ ...mealBase, date: '2024-06-17' });
      store.getState().addMeal({ ...mealBase, date: '2024-06-18' });
    });
    expect(store.getState().getMealsForDate('2024-06-17')).toHaveLength(1);
    expect(store.getState().getMealsForDate('2024-06-19')).toHaveLength(0);
  });

  it('getCaloriesForDate sums totalCalories for the day', () => {
    act(() => {
      store.getState().addMeal({ ...mealBase, date: '2024-06-17', totalCalories: 400 });
      store.getState().addMeal({ ...mealBase, date: '2024-06-17', totalCalories: 600 });
      store.getState().addMeal({ ...mealBase, date: '2024-06-18', totalCalories: 500 });
    });
    expect(store.getState().getCaloriesForDate('2024-06-17')).toBe(1000);
    expect(store.getState().getCaloriesForDate('2024-06-18')).toBe(500);
  });
});

describe('useTrackingStore — weights', () => {
  let store: Awaited<ReturnType<typeof import('@/store/trackingStore')>>['useTrackingStore'];

  beforeEach(async () => {
    const mod = await import('@/store/trackingStore');
    store = mod.useTrackingStore;
    act(() => { store.setState({ workouts: [], meals: [], weights: [], dailyMetrics: [], progressPhotos: [] }); });
  });

  it('addWeight inserts and sorts newest first', () => {
    act(() => {
      store.getState().addWeight({ date: '2024-06-15', weightKg: 85 });
      store.getState().addWeight({ date: '2024-06-17', weightKg: 84 });
      store.getState().addWeight({ date: '2024-06-16', weightKg: 84.5 });
    });
    const dates = store.getState().weights.map((w) => w.date);
    expect(dates).toEqual(['2024-06-17', '2024-06-16', '2024-06-15']);
  });

  it('getWeightForDate finds the correct entry', () => {
    act(() => { store.getState().addWeight({ date: '2024-06-17', weightKg: 84 }); });
    const found = store.getState().getWeightForDate('2024-06-17');
    expect(found?.weightKg).toBe(84);
    expect(store.getState().getWeightForDate('2024-06-01')).toBeUndefined();
  });

  it('deleteWeight removes entry', () => {
    act(() => { store.getState().addWeight({ date: '2024-06-17', weightKg: 84 }); });
    const id = store.getState().weights[0].id;
    act(() => { store.getState().deleteWeight(id); });
    expect(store.getState().weights).toHaveLength(0);
  });
});

describe('useTrackingStore — dailyMetrics', () => {
  let store: Awaited<ReturnType<typeof import('@/store/trackingStore')>>['useTrackingStore'];

  beforeEach(async () => {
    const mod = await import('@/store/trackingStore');
    store = mod.useTrackingStore;
    act(() => { store.setState({ workouts: [], meals: [], weights: [], dailyMetrics: [], progressPhotos: [] }); });
  });

  it('getDailyMetrics returns defaults when no entry exists', () => {
    const m = store.getState().getDailyMetrics('2024-06-17');
    expect(m.steps).toBe(0);
    expect(m.waterMl).toBe(0);
    expect(m.stepsGoal).toBe(8000);
  });

  it('updateDailyMetrics creates a new entry if none exists', () => {
    act(() => { store.getState().updateDailyMetrics('2024-06-17', { steps: 5000 }); });
    expect(store.getState().getDailyMetrics('2024-06-17').steps).toBe(5000);
  });

  it('updateDailyMetrics merges into existing entry', () => {
    act(() => { store.getState().updateDailyMetrics('2024-06-17', { steps: 5000 }); });
    act(() => { store.getState().updateDailyMetrics('2024-06-17', { waterMl: 1000 }); });
    const m = store.getState().getDailyMetrics('2024-06-17');
    expect(m.steps).toBe(5000);
    expect(m.waterMl).toBe(1000);
  });
});

// ─── Goals Store ──────────────────────────────────────────────────────────────

describe('useGoalsStore — goals', () => {
  let store: Awaited<ReturnType<typeof import('@/store/goalsStore')>>['useGoalsStore'];

  beforeEach(async () => {
    const mod = await import('@/store/goalsStore');
    store = mod.useGoalsStore;
    act(() => {
      store.setState({
        goals: { workoutsPerWeek: 4, dailySteps: 8000, dailyCalories: 2000, dailyWaterMl: 2500, weeklyCardioMin: 150 },
      });
    });
  });

  it('setGoals merges partial updates', () => {
    act(() => { store.getState().setGoals({ dailySteps: 10000 }); });
    const { goals } = store.getState();
    expect(goals.dailySteps).toBe(10000);
    expect(goals.workoutsPerWeek).toBe(4); // unchanged
  });
});

describe('useGoalsStore — XP & levels', () => {
  let store: Awaited<ReturnType<typeof import('@/store/goalsStore')>>['useGoalsStore'];

  beforeEach(async () => {
    const mod = await import('@/store/goalsStore');
    store = mod.useGoalsStore;
    act(() => {
      store.setState({ userLevel: { level: 1, xp: 0, xpToNextLevel: 500, title: 'Rookie' } });
    });
  });

  it('addXP increments xp', () => {
    act(() => { store.getState().addXP(100); });
    expect(store.getState().userLevel.xp).toBe(100);
  });

  it('addXP levels up when XP crosses threshold', () => {
    act(() => { store.getState().addXP(500); });
    expect(store.getState().userLevel.level).toBe(2);
    expect(store.getState().userLevel.xp).toBe(0);
  });

  it('addXP handles multiple level-ups', () => {
    act(() => { store.getState().addXP(1500); });
    expect(store.getState().userLevel.level).toBe(4); // 0 + 1500 = 3 full levels + 0
  });

  it('level title updates on level-up', () => {
    act(() => { store.getState().addXP(2500); }); // level 6 → Contender
    expect(store.getState().userLevel.title).toBe('Contender');
  });
});

describe('useGoalsStore — achievements', () => {
  let store: Awaited<ReturnType<typeof import('@/store/goalsStore')>>['useGoalsStore'];

  beforeEach(async () => {
    const mod = await import('@/store/goalsStore');
    store = mod.useGoalsStore;
    const defaultAchievements = store.getState().achievements.map((a) => ({
      ...a, unlocked: false, progress: 0,
    }));
    act(() => { store.setState({ achievements: defaultAchievements }); });
  });

  it('unlockAchievement sets unlocked=true and sets progress to requirement', () => {
    act(() => { store.getState().unlockAchievement('streak_7'); });
    const ach = store.getState().achievements.find((a) => a.id === 'streak_7')!;
    expect(ach.unlocked).toBe(true);
    expect(ach.progress).toBe(ach.requirement);
    expect(ach.unlockedAt).toBeTruthy();
  });

  it('updateAchievementProgress caps at requirement', () => {
    act(() => { store.getState().updateAchievementProgress('workouts_10', 999); });
    const ach = store.getState().achievements.find((a) => a.id === 'workouts_10')!;
    expect(ach.progress).toBe(ach.requirement);
  });

  it('updateAchievementProgress sets partial progress', () => {
    act(() => { store.getState().updateAchievementProgress('workouts_30', 15); });
    const ach = store.getState().achievements.find((a) => a.id === 'workouts_30')!;
    expect(ach.progress).toBe(15);
  });
});

describe('useGoalsStore — habits', () => {
  let store: Awaited<ReturnType<typeof import('@/store/goalsStore')>>['useGoalsStore'];

  beforeEach(async () => {
    const mod = await import('@/store/goalsStore');
    store = mod.useGoalsStore;
    act(() => { store.setState({ habits: [] }); });
  });

  it('addHabit appends with generated id and empty completedDates', () => {
    act(() => {
      store.getState().addHabit({ name: 'Meditate', icon: '🧘', color: '#BF5AF2', targetDaysPerWeek: 7 });
    });
    const { habits } = store.getState();
    expect(habits).toHaveLength(1);
    expect(habits[0].id).toBeTruthy();
    expect(habits[0].completedDates).toEqual([]);
  });

  it('toggleHabitDate adds a date when not present', () => {
    act(() => {
      store.getState().addHabit({ name: 'Run', icon: '🏃', color: '#30D158', targetDaysPerWeek: 5 });
    });
    const id = store.getState().habits[0].id;
    act(() => { store.getState().toggleHabitDate(id, '2024-06-17'); });
    expect(store.getState().habits[0].completedDates).toContain('2024-06-17');
  });

  it('toggleHabitDate removes a date when already present', () => {
    act(() => {
      store.getState().addHabit({ name: 'Run', icon: '🏃', color: '#30D158', targetDaysPerWeek: 5 });
    });
    const id = store.getState().habits[0].id;
    act(() => { store.getState().toggleHabitDate(id, '2024-06-17'); });
    act(() => { store.getState().toggleHabitDate(id, '2024-06-17'); });
    expect(store.getState().habits[0].completedDates).not.toContain('2024-06-17');
  });

  it('deleteHabit removes the habit', () => {
    act(() => {
      store.getState().addHabit({ name: 'Run', icon: '🏃', color: '#30D158', targetDaysPerWeek: 5 });
    });
    const id = store.getState().habits[0].id;
    act(() => { store.getState().deleteHabit(id); });
    expect(store.getState().habits).toHaveLength(0);
  });
});
