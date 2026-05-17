import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  cn,
  formatDate,
  getWeekDays,
  calculateBMI,
  getBMICategory,
  calculateTDEE,
  calculateCalorieGoal,
  calcProgress,
  formatWeight,
  formatCalories,
  formatSteps,
  formatWater,
  getProgressColor,
  getIntensityColor,
  getLevelTitle,
  calcXPForLevel,
  XP_PER_LEVEL,
  genId,
  defaultGoals,
} from '@/lib/utils';
import type { UserProfile } from '@/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const maleProfile: UserProfile = {
  id: 'u1',
  name: 'Ali',
  age: 25,
  gender: 'male',
  heightCm: 175,
  currentWeightKg: 85,
  goalWeightKg: 75,
  activityLevel: 'moderate',
  trainingExperience: 'intermediate',
  createdAt: '2024-01-01T00:00:00.000Z',
  theme: 'dark',
};

const femaleProfile: UserProfile = {
  ...maleProfile,
  id: 'u2',
  gender: 'female',
  currentWeightKg: 65,
  goalWeightKg: 60,
};

// ─── cn (class merging) ───────────────────────────────────────────────────────

describe('cn', () => {
  it('merges class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('handles undefined and null gracefully', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
});

// ─── formatDate ───────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats an ISO date string with default format', () => {
    expect(formatDate('2024-06-15')).toBe('Jun 15, 2024');
  });

  it('formats a Date object', () => {
    expect(formatDate(new Date('2024-01-01'))).toBe('Jan 1, 2024');
  });

  it('accepts a custom format string', () => {
    expect(formatDate('2024-03-20', 'dd/MM/yyyy')).toBe('20/03/2024');
  });
});

// ─── getWeekDays ──────────────────────────────────────────────────────────────

describe('getWeekDays', () => {
  it('returns 7 days', () => {
    expect(getWeekDays(new Date('2024-06-17'))).toHaveLength(7);
  });

  it('starts on Monday', () => {
    const days = getWeekDays(new Date('2024-06-17')); // a Monday
    expect(days[0].getDay()).toBe(1); // 1 = Monday
  });

  it('ends on Sunday', () => {
    const days = getWeekDays(new Date('2024-06-17'));
    expect(days[6].getDay()).toBe(0); // 0 = Sunday
  });
});

// ─── calculateBMI ─────────────────────────────────────────────────────────────

describe('calculateBMI', () => {
  it('calculates BMI correctly', () => {
    // 70 kg, 175 cm → 70 / (1.75²) = 22.9
    expect(calculateBMI(70, 175)).toBe(22.9);
  });

  it('rounds to one decimal place', () => {
    expect(calculateBMI(85, 175)).toBe(27.8);
  });

  it('handles edge case: 0 weight returns 0', () => {
    expect(calculateBMI(0, 175)).toBe(0);
  });
});

// ─── getBMICategory ───────────────────────────────────────────────────────────

describe('getBMICategory', () => {
  it('returns Underweight for BMI < 18.5', () => {
    expect(getBMICategory(17).label).toBe('Underweight');
    expect(getBMICategory(17).color).toBe('#0A84FF');
  });

  it('returns Normal for 18.5 ≤ BMI < 25', () => {
    expect(getBMICategory(22).label).toBe('Normal');
    expect(getBMICategory(22).color).toBe('#30D158');
  });

  it('returns Overweight for 25 ≤ BMI < 30', () => {
    expect(getBMICategory(27).label).toBe('Overweight');
    expect(getBMICategory(27).color).toBe('#FF9F0A');
  });

  it('returns Obese for BMI ≥ 30', () => {
    expect(getBMICategory(32).label).toBe('Obese');
    expect(getBMICategory(32).color).toBe('#FF4560');
  });

  it('boundary: exactly 18.5 is Normal', () => {
    expect(getBMICategory(18.5).label).toBe('Normal');
  });

  it('boundary: exactly 25 is Overweight', () => {
    expect(getBMICategory(25).label).toBe('Overweight');
  });

  it('boundary: exactly 30 is Obese', () => {
    expect(getBMICategory(30).label).toBe('Obese');
  });
});

// ─── calculateTDEE ────────────────────────────────────────────────────────────

describe('calculateTDEE', () => {
  it('calculates TDEE for a male profile', () => {
    // BMR = 10*85 + 6.25*175 - 5*25 + 5 = 850 + 1093.75 - 125 + 5 = 1823.75
    // Moderate multiplier = 1.55 → 1823.75 * 1.55 ≈ 2827
    expect(calculateTDEE(maleProfile)).toBe(2827);
  });

  it('calculates TDEE for a female profile', () => {
    // BMR = 10*65 + 6.25*175 - 5*25 - 161 = 650 + 1093.75 - 125 - 161 = 1457.75
    // Moderate multiplier = 1.55 → 1457.75 * 1.55 ≈ 2260
    expect(calculateTDEE(femaleProfile)).toBe(2260);
  });

  it('sedentary multiplier is lower than active', () => {
    const sedentary = calculateTDEE({ ...maleProfile, activityLevel: 'sedentary' });
    const active = calculateTDEE({ ...maleProfile, activityLevel: 'active' });
    expect(sedentary).toBeLessThan(active);
  });

  it('all five activity levels produce distinct values', () => {
    const levels = ['sedentary', 'light', 'moderate', 'active', 'very_active'] as const;
    const tdees = levels.map((l) => calculateTDEE({ ...maleProfile, activityLevel: l }));
    const unique = new Set(tdees);
    expect(unique.size).toBe(5);
  });
});

// ─── calculateCalorieGoal ─────────────────────────────────────────────────────

describe('calculateCalorieGoal', () => {
  it('returns deficit (TDEE - 500) when current weight > goal by more than 2 kg', () => {
    const tdee = calculateTDEE(maleProfile); // 10 kg above goal → deficit
    expect(calculateCalorieGoal(maleProfile)).toBe(tdee - 500);
  });

  it('returns surplus (TDEE + 300) when goal weight > current weight by more than 2 kg', () => {
    const bulkProfile = { ...maleProfile, currentWeightKg: 68, goalWeightKg: 80 };
    const tdee = calculateTDEE(bulkProfile);
    expect(calculateCalorieGoal(bulkProfile)).toBe(tdee + 300);
  });

  it('returns maintenance (TDEE) when weight difference ≤ 2 kg', () => {
    const maintProfile = { ...maleProfile, currentWeightKg: 76, goalWeightKg: 75 };
    const tdee = calculateTDEE(maintProfile);
    expect(calculateCalorieGoal(maintProfile)).toBe(tdee);
  });
});

// ─── calcProgress ─────────────────────────────────────────────────────────────

describe('calcProgress', () => {
  it('returns 0 when goal is 0', () => {
    expect(calcProgress(100, 0)).toBe(0);
  });

  it('calculates percentage correctly', () => {
    expect(calcProgress(50, 100)).toBe(50);
    expect(calcProgress(75, 100)).toBe(75);
  });

  it('caps at 100 even if current exceeds goal', () => {
    expect(calcProgress(150, 100)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    expect(calcProgress(1, 3)).toBe(33);
  });
});

// ─── Formatters ───────────────────────────────────────────────────────────────

describe('formatWeight', () => {
  it('appends kg with one decimal', () => {
    expect(formatWeight(75)).toBe('75.0 kg');
    expect(formatWeight(72.5)).toBe('72.5 kg');
  });
});

describe('formatCalories', () => {
  it('appends kcal with locale separator', () => {
    expect(formatCalories(2000)).toContain('kcal');
    expect(formatCalories(2000)).toContain('2');
  });
});

describe('formatSteps', () => {
  it('shows full number below 1000', () => {
    expect(formatSteps(500)).toBe('500');
  });

  it('shows k suffix at or above 1000', () => {
    expect(formatSteps(1000)).toBe('1.0k');
    expect(formatSteps(10500)).toBe('10.5k');
  });
});

describe('formatWater', () => {
  it('shows ml below 1000', () => {
    expect(formatWater(750)).toBe('750ml');
  });

  it('shows L at or above 1000', () => {
    expect(formatWater(1500)).toBe('1.5L');
    expect(formatWater(2000)).toBe('2.0L');
  });
});

// ─── getProgressColor ─────────────────────────────────────────────────────────

describe('getProgressColor', () => {
  it('returns green (#30D158) at 100%', () => {
    expect(getProgressColor(100)).toBe('#30D158');
  });

  it('returns lime (#C8FF00) between 75–99%', () => {
    expect(getProgressColor(75)).toBe('#C8FF00');
    expect(getProgressColor(90)).toBe('#C8FF00');
  });

  it('returns orange (#FF9F0A) between 50–74%', () => {
    expect(getProgressColor(50)).toBe('#FF9F0A');
    expect(getProgressColor(60)).toBe('#FF9F0A');
  });

  it('returns red (#FF4560) below 50%', () => {
    expect(getProgressColor(49)).toBe('#FF4560');
    expect(getProgressColor(0)).toBe('#FF4560');
  });
});

// ─── getIntensityColor ────────────────────────────────────────────────────────

describe('getIntensityColor', () => {
  it('maps all four intensities to correct colors', () => {
    expect(getIntensityColor('light')).toBe('#30D158');
    expect(getIntensityColor('moderate')).toBe('#C8FF00');
    expect(getIntensityColor('high')).toBe('#FF9F0A');
    expect(getIntensityColor('max')).toBe('#FF4560');
  });

  it('falls back to lime for unknown intensity', () => {
    expect(getIntensityColor('unknown')).toBe('#C8FF00');
  });
});

// ─── Level helpers ────────────────────────────────────────────────────────────

describe('getLevelTitle', () => {
  it('returns Rookie for levels 1–4', () => {
    expect(getLevelTitle(1)).toBe('Rookie');
    expect(getLevelTitle(4)).toBe('Rookie');
  });

  it('returns Contender for levels 5–9', () => {
    expect(getLevelTitle(5)).toBe('Contender');
    expect(getLevelTitle(9)).toBe('Contender');
  });

  it('returns Athlete for levels 10–19', () => {
    expect(getLevelTitle(10)).toBe('Athlete');
  });

  it('returns Champion for levels 20–29', () => {
    expect(getLevelTitle(20)).toBe('Champion');
  });

  it('returns Elite for levels 30–39', () => {
    expect(getLevelTitle(30)).toBe('Elite');
  });

  it('returns Legend for level 40+', () => {
    expect(getLevelTitle(40)).toBe('Legend');
    expect(getLevelTitle(100)).toBe('Legend');
  });
});

describe('calcXPForLevel', () => {
  it('returns level × XP_PER_LEVEL', () => {
    expect(calcXPForLevel(1)).toBe(XP_PER_LEVEL);
    expect(calcXPForLevel(5)).toBe(5 * XP_PER_LEVEL);
    expect(calcXPForLevel(10)).toBe(10 * XP_PER_LEVEL);
  });
});

// ─── genId ────────────────────────────────────────────────────────────────────

describe('genId', () => {
  it('returns a non-empty string', () => {
    expect(typeof genId()).toBe('string');
    expect(genId().length).toBeGreaterThan(0);
  });

  it('generates unique IDs', () => {
    const ids = Array.from({ length: 100 }, () => genId());
    expect(new Set(ids).size).toBe(100);
  });
});

// ─── defaultGoals ─────────────────────────────────────────────────────────────

describe('defaultGoals', () => {
  it('returns correct default structure', () => {
    const goals = defaultGoals(maleProfile);
    expect(goals.workoutsPerWeek).toBe(4);
    expect(goals.dailySteps).toBe(8000);
    expect(goals.dailyWaterMl).toBe(2500);
    expect(goals.weeklyCardioMin).toBe(150);
    expect(goals.dailyCalories).toBe(calculateCalorieGoal(maleProfile));
  });
});
