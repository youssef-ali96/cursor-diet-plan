import { format, subDays } from 'date-fns';
import type { WorkoutLog, MealLog, WeightEntry, DailyMetrics } from '@/types';

const d = (daysAgo: number) => format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');

export const mockWorkouts: WorkoutLog[] = [
  { id: 'w1', date: d(0), type: 'strength', name: 'Upper Body Power', durationMin: 65, intensity: 'high', exercises: [{ id: 'e1', name: 'Bench Press', sets: 4, reps: 8, weightKg: 80 }, { id: 'e2', name: 'Pull-ups', sets: 4, reps: 10 }, { id: 'e3', name: 'Shoulder Press', sets: 3, reps: 10, weightKg: 50 }], caloriesBurned: 420, completed: true, notes: 'Great session, PR on bench!' },
  { id: 'w2', date: d(1), type: 'cardio', name: 'Morning Run', durationMin: 35, intensity: 'moderate', exercises: [], caloriesBurned: 310, completed: true },
  { id: 'w3', date: d(2), type: 'hiit', name: 'HIIT Circuit', durationMin: 30, intensity: 'max', exercises: [{ id: 'e4', name: 'Burpees', sets: 4, reps: 15 }, { id: 'e5', name: 'Jump Squats', sets: 4, reps: 20 }], caloriesBurned: 380, completed: true },
  { id: 'w4', date: d(3), type: 'strength', name: 'Leg Day', durationMin: 75, intensity: 'high', exercises: [{ id: 'e6', name: 'Squats', sets: 5, reps: 5, weightKg: 120 }, { id: 'e7', name: 'Deadlifts', sets: 4, reps: 6, weightKg: 140 }], caloriesBurned: 480, completed: true },
  { id: 'w5', date: d(5), type: 'yoga', name: 'Recovery Yoga', durationMin: 45, intensity: 'light', exercises: [], caloriesBurned: 150, completed: true },
  { id: 'w6', date: d(6), type: 'strength', name: 'Back & Biceps', durationMin: 60, intensity: 'high', exercises: [{ id: 'e8', name: 'Barbell Row', sets: 4, reps: 8, weightKg: 70 }, { id: 'e9', name: 'Bicep Curls', sets: 3, reps: 12, weightKg: 20 }], caloriesBurned: 390, completed: true },
  { id: 'w7', date: d(8), type: 'running', name: '5K Run', durationMin: 28, intensity: 'high', exercises: [], caloriesBurned: 290, completed: true },
  { id: 'w8', date: d(9), type: 'strength', name: 'Push Day', durationMin: 60, intensity: 'high', exercises: [], caloriesBurned: 400, completed: true },
  { id: 'w9', date: d(11), type: 'cardio', name: 'Cycling Session', durationMin: 45, intensity: 'moderate', exercises: [], caloriesBurned: 360, completed: true },
  { id: 'w10', date: d(13), type: 'hiit', name: 'Tabata Intervals', durationMin: 20, intensity: 'max', exercises: [], caloriesBurned: 300, completed: true },
];

export const mockMeals: MealLog[] = [
  { id: 'm1', date: d(0), type: 'breakfast', items: [{ id: 'f1', name: 'Oatmeal with berries', calories: 320, proteinG: 12, carbsG: 55, fatG: 6, servingSize: '300g', quantity: 1 }, { id: 'f2', name: 'Greek Yogurt', calories: 130, proteinG: 17, carbsG: 9, fatG: 2, servingSize: '150g', quantity: 1 }], totalCalories: 450, notes: 'Pre-workout breakfast' },
  { id: 'm2', date: d(0), type: 'lunch', items: [{ id: 'f3', name: 'Chicken Breast', calories: 280, proteinG: 42, carbsG: 0, fatG: 8, servingSize: '200g', quantity: 1 }, { id: 'f4', name: 'Brown Rice', calories: 215, proteinG: 5, carbsG: 45, fatG: 2, servingSize: '200g', quantity: 1 }, { id: 'f5', name: 'Broccoli', calories: 55, proteinG: 4, carbsG: 8, fatG: 1, servingSize: '150g', quantity: 1 }], totalCalories: 550 },
  { id: 'm3', date: d(0), type: 'snack', items: [{ id: 'f6', name: 'Protein Shake', calories: 180, proteinG: 25, carbsG: 12, fatG: 3, servingSize: '350ml', quantity: 1 }, { id: 'f7', name: 'Banana', calories: 90, proteinG: 1, carbsG: 23, fatG: 0, servingSize: '120g', quantity: 1 }], totalCalories: 270 },
  { id: 'm4', date: d(0), type: 'dinner', items: [{ id: 'f8', name: 'Salmon Fillet', calories: 320, proteinG: 40, carbsG: 0, fatG: 18, servingSize: '200g', quantity: 1 }, { id: 'f9', name: 'Sweet Potato', calories: 180, proteinG: 3, carbsG: 38, fatG: 0, servingSize: '200g', quantity: 1 }], totalCalories: 500 },
  { id: 'm5', date: d(1), type: 'breakfast', items: [{ id: 'f10', name: 'Eggs Scrambled', calories: 220, proteinG: 18, carbsG: 2, fatG: 14, servingSize: '3 eggs', quantity: 1 }], totalCalories: 220 },
  { id: 'm6', date: d(1), type: 'lunch', items: [{ id: 'f11', name: 'Tuna Salad', calories: 380, proteinG: 35, carbsG: 15, fatG: 18, servingSize: '350g', quantity: 1 }], totalCalories: 380 },
  { id: 'm7', date: d(1), type: 'dinner', items: [{ id: 'f12', name: 'Beef Steak', calories: 420, proteinG: 52, carbsG: 0, fatG: 22, servingSize: '250g', quantity: 1 }], totalCalories: 420 },
];

export const mockWeights: WeightEntry[] = Array.from({ length: 30 }, (_, i) => ({
  id: `weight-${i}`,
  date: d(i * 1),
  weightKg: parseFloat((84.5 - i * 0.08 + (Math.random() - 0.5) * 0.4).toFixed(1)),
  bodyFatPercent: parseFloat((18.2 - i * 0.05 + (Math.random() - 0.5) * 0.2).toFixed(1)),
}));

export const mockDailyMetrics: DailyMetrics[] = Array.from({ length: 14 }, (_, i) => ({
  date: d(i),
  steps: Math.floor(6000 + Math.random() * 6000),
  stepsGoal: 8000,
  waterMl: Math.floor(1500 + Math.random() * 1500),
  waterGoalMl: 2500,
  sleepHours: parseFloat((6 + Math.random() * 3).toFixed(1)),
  mood: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
}));

// Pre-fill today's metrics with good values
if (mockDailyMetrics[0]) {
  mockDailyMetrics[0].steps = 7234;
  mockDailyMetrics[0].waterMl = 1800;
}
