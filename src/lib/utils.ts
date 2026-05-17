import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import type { ActivityLevel, UserProfile, WeeklyGoals } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Utils ───────────────────────────────────────────────────────────────

export const today = () => format(new Date(), 'yyyy-MM-dd');

export const formatDate = (date: string | Date, fmt = 'MMM d, yyyy') => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
};

export const getWeekDays = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const daysSince = (date: string) => {
  return differenceInDays(new Date(), parseISO(date));
};

// ─── Health Calculations ──────────────────────────────────────────────────────

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};

export const getBMICategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#0A84FF' };
  if (bmi < 25) return { label: 'Normal', color: '#30D158' };
  if (bmi < 30) return { label: 'Overweight', color: '#FF9F0A' };
  return { label: 'Obese', color: '#FF4560' };
};

export const calculateTDEE = (profile: UserProfile): number => {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = 10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;
  }

  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * multipliers[profile.activityLevel]);
};

export const calculateCalorieGoal = (profile: UserProfile): number => {
  const tdee = calculateTDEE(profile);
  const weightDiff = profile.currentWeightKg - profile.goalWeightKg;
  if (weightDiff > 2) return tdee - 500; // deficit for weight loss
  if (weightDiff < -2) return tdee + 300; // surplus for muscle gain
  return tdee; // maintenance
};

// ─── Progress Utils ───────────────────────────────────────────────────────────

export const calcProgress = (current: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
};

export const formatWeight = (kg: number): string => `${kg.toFixed(1)} kg`;
export const formatCalories = (cal: number): string => `${cal.toLocaleString()} kcal`;
export const formatSteps = (steps: number): string => steps >= 1000
  ? `${(steps / 1000).toFixed(1)}k`
  : steps.toString();

export const formatWater = (ml: number): string => ml >= 1000
  ? `${(ml / 1000).toFixed(1)}L`
  : `${ml}ml`;

// ─── Color Utils ──────────────────────────────────────────────────────────────

export const getProgressColor = (percent: number): string => {
  if (percent >= 100) return '#30D158';
  if (percent >= 75) return '#C8FF00';
  if (percent >= 50) return '#FF9F0A';
  return '#FF4560';
};

export const getIntensityColor = (intensity: string): string => {
  const colors: Record<string, string> = {
    light: '#30D158',
    moderate: '#C8FF00',
    high: '#FF9F0A',
    max: '#FF4560',
  };
  return colors[intensity] ?? '#C8FF00';
};

// ─── XP / Level ───────────────────────────────────────────────────────────────

export const XP_PER_LEVEL = 500;

export const getLevelTitle = (level: number): string => {
  if (level < 5) return 'Rookie';
  if (level < 10) return 'Contender';
  if (level < 20) return 'Athlete';
  if (level < 30) return 'Champion';
  if (level < 40) return 'Elite';
  return 'Legend';
};

export const calcXPForLevel = (level: number) => level * XP_PER_LEVEL;

// ─── Default Goals ────────────────────────────────────────────────────────────

export const defaultGoals = (profile: UserProfile): WeeklyGoals => ({
  workoutsPerWeek: 4,
  dailySteps: 8000,
  dailyCalories: calculateCalorieGoal(profile),
  dailyWaterMl: 2500,
  weeklyCardioMin: 150,
});

// ─── ID Generator ─────────────────────────────────────────────────────────────

export const genId = () => Math.random().toString(36).slice(2, 11);
