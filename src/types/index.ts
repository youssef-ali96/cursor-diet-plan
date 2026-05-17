// ─── User & Profile ───────────────────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type TrainingExperience = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutIntensity = 'light' | 'moderate' | 'high' | 'max';
export type WorkoutType = 
  | 'strength' | 'cardio' | 'hiit' | 'yoga' | 'pilates' 
  | 'cycling' | 'running' | 'swimming' | 'sports' | 'other';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Theme = 'dark' | 'light';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  activityLevel: ActivityLevel;
  trainingExperience: TrainingExperience;
  profilePhoto?: string;
  createdAt: string;
  theme: Theme;
}

// ─── Workout ──────────────────────────────────────────────────────────────────

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
  durationMin?: number;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  type: WorkoutType;
  name: string;
  durationMin: number;
  intensity: WorkoutIntensity;
  exercises: Exercise[];
  caloriesBurned?: number;
  notes?: string;
  completed: boolean;
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSize: string;
  quantity: number;
}

export interface MealLog {
  id: string;
  date: string;
  type: MealType;
  items: FoodItem[];
  totalCalories: number;
  notes?: string;
}

// ─── Body Metrics ─────────────────────────────────────────────────────────────

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface DailyMetrics {
  date: string;
  steps: number;
  stepsGoal: number;
  waterMl: number;
  waterGoalMl: number;
  sleepHours?: number;
  mood?: 1 | 2 | 3 | 4 | 5;
}

// ─── Progress Photos ──────────────────────────────────────────────────────────

export type PhotoAngle = 'front' | 'side' | 'back';

export interface ProgressPhoto {
  id: string;
  date: string;
  url: string;
  angle: PhotoAngle;
  weightKg?: number;
  notes?: string;
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export interface WeeklyGoals {
  workoutsPerWeek: number;
  dailySteps: number;
  dailyCalories: number;
  dailyWaterMl: number;
  weeklyCardioMin: number;
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'workout' | 'nutrition' | 'weight' | 'steps' | 'consistency';
  requirement: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export interface UserLevel {
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
}

// ─── Habits ───────────────────────────────────────────────────────────────────

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  targetDaysPerWeek: number;
  completedDates: string[];
  createdAt: string;
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export type InsightType = 'success' | 'warning' | 'info' | 'tip';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  icon: string;
  date: string;
  dismissed: boolean;
}

// ─── Dashboard State ──────────────────────────────────────────────────────────

export interface DailyLog {
  date: string;
  meals: MealLog[];
  workouts: WorkoutLog[];
  weight?: WeightEntry;
  metrics: DailyMetrics;
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activeDates: string[];
}
