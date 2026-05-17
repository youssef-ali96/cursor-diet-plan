import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeeklyGoals, Achievement, UserLevel, Habit } from '@/types';
import { genId, getLevelTitle, calcXPForLevel } from '@/lib/utils';

interface GoalsState {
  goals: WeeklyGoals;
  achievements: Achievement[];
  userLevel: UserLevel;
  habits: Habit[];

  setGoals: (goals: Partial<WeeklyGoals>) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;

  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void;
  toggleHabitDate: (habitId: string, date: string) => void;
  deleteHabit: (id: string) => void;
}

const defaultAchievements: Achievement[] = [
  { id: 'streak_7', title: '7-Day Warrior', description: '7 days active streak', icon: '🔥', category: 'streak', requirement: 7, unlocked: false, progress: 0 },
  { id: 'streak_30', title: 'Month Master', description: '30 days active streak', icon: '⚡', category: 'streak', requirement: 30, unlocked: false, progress: 0 },
  { id: 'workouts_10', title: 'Getting Started', description: 'Complete 10 workouts', icon: '💪', category: 'workout', requirement: 10, unlocked: false, progress: 0 },
  { id: 'workouts_30', title: 'Dedicated', description: 'Complete 30 workouts', icon: '🏋️', category: 'workout', requirement: 30, unlocked: false, progress: 0 },
  { id: 'workouts_100', title: 'Century Club', description: 'Complete 100 workouts', icon: '🏆', category: 'workout', requirement: 100, unlocked: false, progress: 0 },
  { id: 'weight_5', title: 'First Steps', description: 'Lose 5 kg from starting weight', icon: '⚖️', category: 'weight', requirement: 5, unlocked: false, progress: 0 },
  { id: 'steps_10k', title: 'Step Master', description: 'Hit 10,000 steps in a day', icon: '👟', category: 'steps', requirement: 10000, unlocked: false, progress: 0 },
  { id: 'log_7', title: 'Food Logger', description: 'Log meals 7 days in a row', icon: '🥗', category: 'nutrition', requirement: 7, unlocked: false, progress: 0 },
  { id: 'consistent_14', title: 'Consistent', description: '14 day workout streak', icon: '📅', category: 'consistency', requirement: 14, unlocked: false, progress: 0 },
  { id: 'photo_first', title: 'First Transformation', description: 'Upload first progress photo', icon: '📸', category: 'consistency', requirement: 1, unlocked: false, progress: 0 },
];

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: {
        workoutsPerWeek: 4,
        dailySteps: 8000,
        dailyCalories: 2000,
        dailyWaterMl: 2500,
        weeklyCardioMin: 150,
      },
      achievements: defaultAchievements,
      userLevel: {
        level: 1,
        xp: 0,
        xpToNextLevel: 500,
        title: getLevelTitle(1),
      },
      habits: [
        { id: genId(), name: 'Morning Workout', icon: '🏋️', color: '#C8FF00', targetDaysPerWeek: 5, completedDates: [], createdAt: new Date().toISOString() },
        { id: genId(), name: 'Drink Water', icon: '💧', color: '#0A84FF', targetDaysPerWeek: 7, completedDates: [], createdAt: new Date().toISOString() },
        { id: genId(), name: 'Log Meals', icon: '🥗', color: '#30D158', targetDaysPerWeek: 7, completedDates: [], createdAt: new Date().toISOString() },
        { id: genId(), name: 'Evening Walk', icon: '🚶', color: '#FF9F0A', targetDaysPerWeek: 5, completedDates: [], createdAt: new Date().toISOString() },
        { id: genId(), name: 'Sleep 8hrs', icon: '😴', color: '#BF5AF2', targetDaysPerWeek: 7, completedDates: [], createdAt: new Date().toISOString() },
      ],

      setGoals: (newGoals) =>
        set((s) => ({ goals: { ...s.goals, ...newGoals } })),

      addXP: (amount) =>
        set((s) => {
          const totalXP = s.userLevel.xp + amount;
          const newLevel = Math.floor(totalXP / 500) + 1;
          return {
            userLevel: {
              level: newLevel,
              xp: totalXP % 500,
              xpToNextLevel: 500,
              title: getLevelTitle(newLevel),
            },
          };
        }),

      unlockAchievement: (id) =>
        set((s) => ({
          achievements: s.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString(), progress: a.requirement } : a
          ),
        })),

      updateAchievementProgress: (id, progress) =>
        set((s) => ({
          achievements: s.achievements.map((a) =>
            a.id === id ? { ...a, progress: Math.min(progress, a.requirement) } : a
          ),
        })),

      addHabit: (habit) =>
        set((s) => ({
          habits: [...s.habits, { ...habit, id: genId(), completedDates: [], createdAt: new Date().toISOString() }],
        })),

      toggleHabitDate: (habitId, date) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const has = h.completedDates.includes(date);
            return {
              ...h,
              completedDates: has
                ? h.completedDates.filter((d) => d !== date)
                : [...h.completedDates, date],
            };
          }),
        })),

      deleteHabit: (id) =>
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
    }),
    { name: 'fitness-goals' }
  )
);
