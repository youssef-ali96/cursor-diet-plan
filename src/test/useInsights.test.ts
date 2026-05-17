import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useInsights } from '@/hooks/useInsights';
import { useTrackingStore } from '@/store/trackingStore';
import { useGoalsStore } from '@/store/goalsStore';

// Pin the date to a Friday so Mon–Thu workouts fall within [weekStart, today]
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-06-21T12:00:00.000Z')); // Friday (week: Mon 17 → Fri 21)

function resetStores() {
  act(() => {
    useTrackingStore.setState({
      workouts: [],
      meals: [],
      weights: [],
      dailyMetrics: [],
      progressPhotos: [],
      streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: '', activeDates: [] },
    });
    useGoalsStore.setState({
      goals: { workoutsPerWeek: 4, dailySteps: 8000, dailyCalories: 2000, dailyWaterMl: 2500, weeklyCardioMin: 150 },
    });
  });
}

describe('useInsights', () => {
  beforeEach(resetStores);

  it('returns an array', () => {
    const { result } = renderHook(() => useInsights());
    expect(Array.isArray(result.current)).toBe(true);
  });

  it('returns at most 6 insights', () => {
    const { result } = renderHook(() => useInsights());
    expect(result.current.length).toBeLessThanOrEqual(6);
  });

  it('generates a "workouts left this week" warning when goal not met', () => {
    // 0 workouts logged, goal = 4 → 4 left warning
    const { result } = renderHook(() => useInsights());
    const warning = result.current.find((i) => i.type === 'warning' && i.title.includes('Workout'));
    expect(warning).toBeDefined();
    expect(warning?.description).toContain('0/4');
  });

  it('generates a "Weekly Goal Crushed" success when workouts == goal', () => {
    act(() => {
      const addWorkout = useTrackingStore.getState().addWorkout;
      // Today = Friday 2024-06-21 → week range [Mon 2024-06-17 .. Fri 2024-06-21]
      ['2024-06-17', '2024-06-18', '2024-06-19', '2024-06-20'].forEach((date) => {
        addWorkout({ date, type: 'strength', name: 'W', durationMin: 30, intensity: 'moderate', exercises: [], completed: true });
      });
    });

    const { result } = renderHook(() => useInsights());
    const success = result.current.find((i) => i.title === 'Weekly Goal Crushed!');
    expect(success).toBeDefined();
  });

  it('generates weight-loss insight when 14 weights show a downward trend', () => {
    act(() => {
      const addWeight = useTrackingStore.getState().addWeight;
      // Losing weight: recent weight (i=0) is LOWER than old weight (i=13)
      // oldest date = 2024-06-08 (heaviest), newest = 2024-06-21 (lightest)
      for (let i = 0; i < 14; i++) {
        const date = `2024-06-${String(21 - i).padStart(2, '0')}`;
        addWeight({ date, weightKg: 81 + i * 0.3 }); // i=0→81 (newest/lightest), i=13→84.9 (oldest/heaviest)
      }
    });

    const { result } = renderHook(() => useInsights());
    const weightInsight = result.current.find((i) => i.title === 'Losing Weight!');
    expect(weightInsight).toBeDefined();
    expect(weightInsight?.type).toBe('success');
  });

  it('generates weight-gain insight when weights trend upward', () => {
    act(() => {
      const addWeight = useTrackingStore.getState().addWeight;
      // Gaining weight: recent weight (i=0) is HIGHER than old weight (i=13)
      // oldest date = 2024-06-08 (lightest), newest = 2024-06-21 (heaviest)
      for (let i = 0; i < 14; i++) {
        const date = `2024-06-${String(21 - i).padStart(2, '0')}`;
        addWeight({ date, weightKg: 85 - i * 0.3 }); // i=0→85 (newest/heaviest), i=13→81.1 (oldest/lightest)
      }
    });

    const { result } = renderHook(() => useInsights());
    const gainInsight = result.current.find((i) => i.title === 'Gaining Weight');
    expect(gainInsight).toBeDefined();
    expect(gainInsight?.type).toBe('info');
  });

  it('generates streak insight when streak ≥ 5', () => {
    act(() => {
      useTrackingStore.setState((s) => ({
        streak: { ...s.streak, currentStreak: 7, longestStreak: 7, lastActiveDate: '2024-06-17' },
      }));
    });

    const { result } = renderHook(() => useInsights());
    const streakInsight = result.current.find((i) => i.title.includes('Streak'));
    expect(streakInsight).toBeDefined();
    expect(streakInsight?.icon).toBe('🔥');
  });

  it('does NOT generate streak insight when streak < 5', () => {
    act(() => {
      useTrackingStore.setState((s) => ({
        streak: { ...s.streak, currentStreak: 3, longestStreak: 3 },
      }));
    });
    const { result } = renderHook(() => useInsights());
    const streakInsight = result.current.find((i) => i.title.includes('Streak') && i.icon === '🔥');
    expect(streakInsight).toBeUndefined();
  });

  it('generates step goal exceeded insight when avg steps beat goal', () => {
    act(() => {
      const update = useTrackingStore.getState().updateDailyMetrics;
      for (let i = 0; i < 7; i++) {
        const date = `2024-06-${String(21 - i).padStart(2, '0')}`;
        update(date, { steps: 10000 });
      }
    });

    const { result } = renderHook(() => useInsights());
    const stepsInsight = result.current.find((i) => i.title === 'Step Goal Exceeded!');
    expect(stepsInsight).toBeDefined();
  });

  it('generates low steps tip when avg steps are < 60% of goal', () => {
    act(() => {
      const update = useTrackingStore.getState().updateDailyMetrics;
      for (let i = 0; i < 7; i++) {
        const date = `2024-06-${String(21 - i).padStart(2, '0')}`;
        update(date, { steps: 1000 }); // well below 8000 * 0.6 = 4800
      }
    });

    const { result } = renderHook(() => useInsights());
    const tipInsight = result.current.find((i) => i.title === 'Increase Your Steps');
    expect(tipInsight).toBeDefined();
    expect(tipInsight?.type).toBe('tip');
  });

  it('generates consistent logger insight when ≥ 7 unique meal days', () => {
    act(() => {
      const addMeal = useTrackingStore.getState().addMeal;
      for (let i = 0; i < 7; i++) {
        const date = `2024-06-${String(15 + i).padStart(2, '0')}`;
        addMeal({ date, type: 'lunch', items: [], totalCalories: 500 });
      }
    });

    const { result } = renderHook(() => useInsights());
    const loggerInsight = result.current.find((i) => i.title === 'Consistent Logger');
    expect(loggerInsight).toBeDefined();
  });

  it('each insight has required fields', () => {
    const { result } = renderHook(() => useInsights());
    for (const insight of result.current) {
      expect(insight.id).toBeTruthy();
      expect(insight.type).toMatch(/success|warning|info|tip/);
      expect(insight.title).toBeTruthy();
      expect(insight.description).toBeTruthy();
      expect(insight.icon).toBeTruthy();
      expect(insight.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof insight.dismissed).toBe('boolean');
    }
  });
});
